import { CodingAgentAdapter, CodingAgentCapabilities, DetectedAgentRuntime, WorkerSessionParams, NormalizedAgentEvent } from "../types";
import { locateCommand } from "@/shared/services/cliRuntime";
import { spawn, ChildProcess, exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";

const execAsync = promisify(exec);

export interface InteractiveSessionInfo {
  sessionId: string;
  runtimeId: string;
  runtimeName: string;
  version: string;
  workspacePath: string;
  role: string;
  agentId: string;
  workflowId?: string;
  model: string;
  provider: string;
  gateway: string;
  pid?: number;
  startTime: number;
}

export class OpenCodeAdapter implements CodingAgentAdapter {
  id = "opencode";
  name = "OpenCode";

  getCapabilities(): CodingAgentCapabilities {
    return {
      supportsWorkspace: true,
      supportsTerminal: true,
      supportsFileTools: true,
      supportsGit: true,
      supportsStreaming: true,
      supportsParallelSessions: true,
      supportsAgentMessaging: true,
      supportsSessionInjection: true,
      supportsLiveEvents: true,
      supportsConversationHistory: true,
      supportsInteractiveSession: true,
      supportsExternalMessages: true,
      supportsNativeConversationView: true
    };
  }

  async sendAgentMessage(message: any): Promise<boolean> {
    // OpenCode receives context injection through running session or task execution prompt
    return true;
  }

  async injectContext(context: any): Promise<boolean> {
    return true;
  }

  async detectInstallation(): Promise<DetectedAgentRuntime> {
    try {
      const located = await locateCommand("opencode", process.env);
      if (located.installed && located.commandPath) {
        return {
          id: this.id,
          name: this.name,
          version: "v1.18.18",
          status: "READY",
          executablePath: located.commandPath,
          capabilities: this.getCapabilities(),
          installInstructions: "OpenCode CLI is installed and ready."
        };
      }
    } catch (e) {}

    return {
      id: this.id,
      name: this.name,
      status: "NOT_INSTALLED",
      capabilities: this.getCapabilities(),
      installInstructions: "Install via npm: `npm install -g opencode-ai` or visit https://opencode.ai"
    };
  }

  public ensureWorkspaceConfig(workspacePath: string, model: string, apiBaseUrl: string) {
    try {
      const configPath = path.join(workspacePath, "opencode.json");
      const config = {
        "$schema": "https://opencode.ai/config.json",
        "provider": {
          "omniroute": {
            "name": "OmniRoute",
            "npm": "@ai-sdk/openai-compatible",
            "options": {
              "baseURL": apiBaseUrl || "http://127.0.0.1:20128/api/v1",
              "apiKey": "local"
            }
          }
        },
        "model": `omniroute/${model}`
      };
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
    } catch (e) {
      console.error("Failed to write opencode.json in workspace:", e);
    }
  }

  private scanWorkspaceFiles(dir: string): Map<string, number> {
    const map = new Map<string, number>();
    try {
      const walk = (d: string) => {
        const items = fs.readdirSync(d, { withFileTypes: true });
        for (const item of items) {
          if (item.name === "node_modules" || item.name === ".git") continue;
          const full = path.join(d, item.name);
          if (item.isDirectory()) {
            walk(full);
          } else {
            const stat = fs.statSync(full);
            map.set(path.relative(dir, full), stat.mtimeMs);
          }
        }
      };
      walk(dir);
    } catch (e) {}
    return map;
  }

  async launchInteractive(
    workspacePath: string,
    model = "antigravity/claude-sonnet-4-6",
    provider = "antigravity",
    apiBaseUrl = "http://127.0.0.1:20128/api/v1",
    role = "DEVELOPER",
    agentId?: string,
    workflowId?: string
  ): Promise<InteractiveSessionInfo> {
    const detection = await this.detectInstallation();
    if (detection.status !== "READY" || !detection.executablePath) {
      throw new Error(`OpenCode is not installed on this host.`);
    }

    fs.mkdirSync(workspacePath, { recursive: true });
    this.ensureWorkspaceConfig(workspacePath, model, apiBaseUrl);

    const actualAgentId = agentId || `agent_opencode_${role.toLowerCase()}_${Date.now().toString().slice(-6)}`;
    const actualWorkflowId = workflowId || `wf_opencode_${Date.now()}`;
    const isWindows = process.platform === "win32";
    const sessionId = `interactive_opencode_${Date.now()}`;
    let spawnedPid: number | undefined = undefined;

    // Inject Role Task Context into workspace
    try {
      const contextPath = path.join(workspacePath, ".opencode_role_context.md");
      const roleDoc = `# ⚡ Jinwoo Sys Workforce Role Assignment
- **Assigned Role**: ${role}
- **Agent Identifier**: ${actualAgentId}
- **Worker Runtime**: OpenCode v1.18.18
- **Workspace Path**: ${workspacePath}
- **Gateway Endpoint**: ${apiBaseUrl} (OmniRoute / Jinwoo Gateway)
- **Model**: ${model}
- **Multi-Agent Bus**: http://127.0.0.1:20128/api/jinwoo/communication

### Operating Instructions
You are operating as the **${role}** worker inside the Jinwoo Sys autonomous multi-agent hierarchy.
When tasks or handoffs arrive from other roles (Architect, QA, Security, or Human Operator):
1. Read the incoming task context carefully.
2. Inspect the relevant workspace files inside \`${workspacePath}\`.
3. Perform the code modification or verification task.
4. Report changes and tests performed back to Jinwoo Sys.
`;
      fs.writeFileSync(contextPath, roleDoc, "utf-8");
    } catch (e) {}

    if (isWindows) {
      // Launch a real Windows Console / Terminal window with role in title
      const windowTitle = `OpenCode [${role}] - Jinwoo Sys (${path.basename(workspacePath)})`;
      const proc = spawn("cmd.exe", ["/c", "start", `"${windowTitle}"`, `"${detection.executablePath}"`], {
        cwd: workspacePath,
        detached: true,
        stdio: "ignore",
        shell: true
      });
      proc.unref();

      // Look up spawned opencode process PID
      try {
        await new Promise((r) => setTimeout(r, 1200));
        const { stdout } = await execAsync(`powershell -Command "Get-Process -Name opencode -ErrorAction SilentlyContinue | Select-Object -Last 1 -ExpandProperty Id"`);
        const parsed = parseInt(stdout.trim(), 10);
        if (!isNaN(parsed) && parsed > 0) {
          spawnedPid = parsed;
        }
      } catch (e) {}
    } else {
      const proc = spawn(detection.executablePath, [], {
        cwd: workspacePath,
        detached: true,
        stdio: "ignore"
      });
      proc.unref();
      spawnedPid = proc.pid;
    }

    // Register active agent in database
    try {
      const { getJinwooDb } = await import("../../db/schema");
      const db = getJinwooDb();
      db.prepare(`
        INSERT OR REPLACE INTO agents (id, workflowId, role, provider, model, status, runtime, sessionId, pid, workspacePath, createdAt)
        VALUES (?, ?, ?, ?, ?, 'working', 'opencode', ?, ?, ?, ?)
      `).run(
        actualAgentId, actualWorkflowId, role, provider, model, sessionId, spawnedPid || null, workspacePath, new Date().toISOString()
      );
    } catch (e) {}

    return {
      sessionId,
      runtimeId: this.id,
      runtimeName: this.name,
      version: detection.version || "v1.18.18",
      workspacePath,
      role,
      agentId: actualAgentId,
      workflowId: actualWorkflowId,
      model,
      provider,
      gateway: "OmniRoute",
      pid: spawnedPid,
      startTime: Date.now()
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
          error: `OpenCode runtime is NOT_INSTALLED. Please install OpenCode CLI to execute this task.`
        }
      });
      return {
        sessionId: params.sessionId,
        stop: async () => {}
      };
    }

    // Ensure workspace directory exists and has config
    fs.mkdirSync(params.workspacePath, { recursive: true });
    this.ensureWorkspaceConfig(params.workspacePath, params.model, params.apiBaseUrl || "http://127.0.0.1:20128/api/v1");

    const initialFiles = this.scanWorkspaceFiles(params.workspacePath);

    let proc: ChildProcess | null = null;
    const isWindows = process.platform === "win32";
    const execCmd = isWindows ? `"${detection.executablePath}"` : detection.executablePath;

    const env = {
      ...process.env,
      OPENCODE_API_BASE: params.apiBaseUrl || "http://127.0.0.1:20128/api/v1",
      WORKSPACE_DIR: params.workspacePath
    };

    const promptText = params.upstreamContext 
      ? `[Context from upstream]: ${params.upstreamContext}\n\n[Task]: ${params.prompt}`
      : params.prompt;

    try {
      proc = spawn(execCmd, ["run", "--dir", params.workspacePath, "--auto", promptText], {
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
            provider: params.provider,
            gateway: "OmniRoute"
          }
        });
      }

      proc.stdout?.on("data", (data) => {
        const text = data.toString();
        
        // Try parsing JSON event or stream as text
        if (text.startsWith("{") && text.endsWith("}\n")) {
          try {
            const j = JSON.parse(text);
            if (j.type === "tool" || j.tool) {
              onEvent({
                eventType: "TOOL_CALL",
                taskId: params.taskId,
                workflowId: params.workflowId,
                payload: { agentId: params.agentId, tool: j.tool || j.name, args: j.args }
              });
            }
          } catch(e) {}
        }

        onEvent({
          eventType: "MODEL_STREAM",
          taskId: params.taskId,
          workflowId: params.workflowId,
          payload: { agentId: params.agentId, delta: text }
        });
      });

      proc.stderr?.on("data", (data) => {
        const text = data.toString();
        if (text.toLowerCase().includes("error") && !text.includes("DeprecationWarning")) {
          onEvent({
            eventType: "ORCHESTRATOR_ERROR",
            taskId: params.taskId,
            workflowId: params.workflowId,
            payload: { error: text }
          });
        }
      });

      proc.on("close", (code) => {
        // Detect modified/created files in workspace
        const finalFiles = this.scanWorkspaceFiles(params.workspacePath);
        for (const [relPath, mtime] of finalFiles.entries()) {
          if (relPath === "opencode.json") continue;
          if (!initialFiles.has(relPath) || initialFiles.get(relPath) !== mtime) {
            onEvent({
              eventType: "FILE_CHANGED",
              taskId: params.taskId,
              workflowId: params.workflowId,
              payload: {
                path: relPath,
                agentId: params.agentId,
                changeType: initialFiles.has(relPath) ? "MODIFIED" : "CREATED",
                timestamp: new Date().toISOString()
              }
            });
          }
        }

        onEvent({
          eventType: code === 0 ? "AGENT_COMPLETED" : "AGENT_FAILED",
          taskId: params.taskId,
          workflowId: params.workflowId,
          payload: { agentId: params.agentId, exitCode: code }
        });
      });

      const activePid = proc.pid;

      return {
        sessionId: params.sessionId,
        pid: activePid,
        stop: async () => {
          if (activePid) {
            if (isWindows) {
              exec(`taskkill /PID ${activePid} /T /F`, () => {});
            } else {
              proc?.kill("SIGTERM");
            }
          }
        }
      };
    } catch (err: any) {
      onEvent({
        eventType: "AGENT_FAILED",
        taskId: params.taskId,
        workflowId: params.workflowId,
        payload: { error: `Failed to spawn OpenCode process: ${err.message}` }
      });

      return {
        sessionId: params.sessionId,
        stop: async () => {}
      };
    }
  }
}
