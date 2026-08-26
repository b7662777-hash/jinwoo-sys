import { CodingAgentAdapter, CodingAgentCapabilities, DetectedAgentRuntime, WorkerSessionParams, NormalizedAgentEvent } from "../types";
import { locateCommand } from "@/shared/services/cliRuntime";
import { spawn, ChildProcess } from "child_process";

export class ClaudeCodeAdapter implements CodingAgentAdapter {
  id = "claude-code";
  name = "Claude Code";

  getCapabilities(): CodingAgentCapabilities {
    return {
      supportsWorkspace: true,
      supportsTerminal: true,
      supportsFileTools: true,
      supportsGit: true,
      supportsStreaming: true,
      supportsParallelSessions: false
    };
  }

  async detectInstallation(): Promise<DetectedAgentRuntime> {
    try {
      const located = await locateCommand("claude", process.env);
      if (located.installed && located.commandPath) {
        return {
          id: this.id,
          name: this.name,
          version: "v0.2.29",
          status: "READY",
          executablePath: located.commandPath,
          capabilities: this.getCapabilities(),
          installInstructions: "Claude Code CLI is installed and ready."
        };
      }
    } catch (e) {}

    return {
      id: this.id,
      name: this.name,
      status: "NOT_INSTALLED",
      capabilities: this.getCapabilities(),
      installInstructions: "Install Claude Code CLI via npm: `npm install -g @anthropic-ai/claude-code`"
    };
  }

  async startSession(
    params: WorkerSessionParams,
    onEvent: (event: NormalizedAgentEvent) => void
  ): Promise<{ sessionId: string; pid?: number; stop: () => Promise<void> }> {
    const detection = await this.detectInstallation();
    
    onEvent({
      eventType: "AGENT_STARTED",
      taskId: params.taskId,
      workflowId: params.workflowId,
      payload: {
        agentId: params.agentId,
        role: params.role,
        runtime: this.name,
        workspacePath: params.workspacePath,
        model: params.model,
        provider: params.provider
      }
    });

    if (detection.status !== "READY" || !detection.executablePath) {
      onEvent({
        eventType: "AGENT_FAILED",
        taskId: params.taskId,
        workflowId: params.workflowId,
        payload: {
          error: `Claude Code CLI is NOT_INSTALLED. Please install @anthropic-ai/claude-code to execute this task.`
        }
      });
      return {
        sessionId: params.sessionId,
        stop: async () => {}
      };
    }

    let proc: ChildProcess | null = null;
    const isWindows = process.platform === "win32";

    const env = {
      ...process.env,
      ANTHROPIC_BASE_URL: params.apiBaseUrl || "http://127.0.0.1:20128/api/v1",
      ANTHROPIC_MODEL: params.model
    };

    const promptText = params.upstreamContext 
      ? `[Context]: ${params.upstreamContext}\n\n[Instruction]: ${params.prompt}`
      : params.prompt;

    try {
      proc = spawn(detection.executablePath, ["-p", promptText], {
        cwd: params.workspacePath,
        env,
        shell: isWindows
      });

      if (proc.pid) {
        onEvent({
          eventType: "AGENT_CONFIG",
          taskId: params.taskId,
          workflowId: params.workflowId,
          payload: {
            agentId: params.agentId,
            pid: proc.pid,
            runtime: this.name,
            model: params.model,
            provider: params.provider
          }
        });
      }

      proc.stdout?.on("data", (data) => {
        const text = data.toString();
        onEvent({
          eventType: "MODEL_STREAM",
          taskId: params.taskId,
          workflowId: params.workflowId,
          payload: { agentId: params.agentId, delta: text }
        });
      });

      proc.stderr?.on("data", (data) => {
        const text = data.toString();
        if (text.includes("error") || text.includes("FAIL")) {
          onEvent({
            eventType: "ORCHESTRATOR_ERROR",
            taskId: params.taskId,
            workflowId: params.workflowId,
            payload: { error: text }
          });
        }
      });

      proc.on("close", (code) => {
        onEvent({
          eventType: code === 0 ? "AGENT_COMPLETED" : "AGENT_FAILED",
          taskId: params.taskId,
          workflowId: params.workflowId,
          payload: { agentId: params.agentId, exitCode: code }
        });
      });

      return {
        sessionId: params.sessionId,
        pid: proc.pid,
        stop: async () => {
          if (proc && !proc.killed) {
            proc.kill("SIGTERM");
          }
        }
      };
    } catch (err: any) {
      onEvent({
        eventType: "AGENT_FAILED",
        taskId: params.taskId,
        workflowId: params.workflowId,
        payload: { error: `Failed to spawn Claude Code process: ${err.message}` }
      });

      return {
        sessionId: params.sessionId,
        stop: async () => {}
      };
    }
  }
}
