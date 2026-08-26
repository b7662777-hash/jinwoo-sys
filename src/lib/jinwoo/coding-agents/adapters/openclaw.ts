import { CodingAgentAdapter, CodingAgentCapabilities, DetectedAgentRuntime, WorkerSessionParams, NormalizedAgentEvent } from "../types";
import { locateCommand } from "@/shared/services/cliRuntime";

export class OpenClawAdapter implements CodingAgentAdapter {
  id = "openclaw";
  name = "OpenClaw";

  getCapabilities(): CodingAgentCapabilities {
    return {
      supportsWorkspace: false,
      supportsTerminal: false,
      supportsFileTools: false,
      supportsGit: false,
      supportsStreaming: false,
      supportsParallelSessions: false,
      supportsAgentMessaging: false,
      supportsSessionInjection: false,
      supportsLiveEvents: false,
      supportsConversationHistory: false,
      supportsInteractiveSession: false,
      supportsExternalMessages: false,
      supportsNativeConversationView: false
    };
  }

  async detectInstallation(): Promise<DetectedAgentRuntime> {
    try {
      const located = await locateCommand("openclaw", process.env);
      if (located.installed && located.commandPath) {
        return {
          id: this.id,
          name: this.name,
          version: "v2.0.0",
          status: "READY",
          executablePath: located.commandPath,
          capabilities: {
            supportsWorkspace: true,
            supportsTerminal: true,
            supportsFileTools: true,
            supportsGit: true,
            supportsStreaming: true,
            supportsParallelSessions: true,
            supportsAgentMessaging: true,
            supportsSessionInjection: true,
            supportsLiveEvents: true
          },
          installInstructions: "OpenClaw is installed and ready."
        };
      }
    } catch (e) {}

    return {
      id: this.id,
      name: this.name,
      status: "NOT_INSTALLED",
      capabilities: this.getCapabilities(),
      installInstructions: "Install OpenClaw via npm: `npm install -g openclaw`"
    };
  }

  async startSession(
    params: WorkerSessionParams,
    onEvent: (event: NormalizedAgentEvent) => void
  ): Promise<{ sessionId: string; pid?: number; stop: () => Promise<void> }> {
    const detection = await this.detectInstallation();
    if (detection.status !== "READY") {
      onEvent({
        eventType: "AGENT_FAILED",
        taskId: params.taskId,
        workflowId: params.workflowId,
        payload: {
          error: "OpenClaw is NOT_INSTALLED. Please install OpenClaw CLI or assign another coding agent."
        }
      });
      throw new Error("OpenClaw is not installed on this system.");
    }

    return {
      sessionId: params.sessionId,
      stop: async () => {}
    };
  }
}
