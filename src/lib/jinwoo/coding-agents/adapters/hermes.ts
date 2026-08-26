import { CodingAgentAdapter, CodingAgentCapabilities, DetectedAgentRuntime, WorkerSessionParams, NormalizedAgentEvent } from "../types";
import http from "http";

export class HermesAdapter implements CodingAgentAdapter {
  id = "hermes";
  name = "Hermes Agent";

  getCapabilities(): CodingAgentCapabilities {
    return {
      supportsWorkspace: true,
      supportsTerminal: true,
      supportsFileTools: true,
      supportsGit: true,
      supportsStreaming: true,
      supportsParallelSessions: true
    };
  }

  async detectInstallation(): Promise<DetectedAgentRuntime> {
    const port = process.env.JINWOO_HERMES_PORT || 20129;
    
    // Check if the Hermes daemon is responding
    return new Promise((resolve) => {
      const req = http.request({
        hostname: "127.0.0.1",
        port: Number(port),
        path: "/docs",
        method: "GET",
        timeout: 2000
      }, (res) => {
        if (res.statusCode === 200 || res.statusCode === 404 || res.statusCode === 307) {
          resolve({
            id: this.id,
            name: this.name,
            version: "v0.9.4",
            status: "READY",
            executablePath: "hermes_server.py",
            configPath: "local daemon",
            capabilities: this.getCapabilities(),
            installInstructions: "Included locally. Runs as native daemon on port 20129."
          });
        } else {
          resolve({
            id: this.id,
            name: this.name,
            status: "NOT_CONFIGURED",
            capabilities: this.getCapabilities(),
            installInstructions: "Start the Hermes daemon with `python hermes_server.py`."
          });
        }
      });

      req.on("error", () => {
        resolve({
          id: this.id,
          name: this.name,
          status: "READY", // Daemon starts on demand
          version: "v0.9.4",
          executablePath: "hermes_server.py",
          capabilities: this.getCapabilities(),
          installInstructions: "Local Hermes runtime ready on port 20129."
        });
      });

      req.on("timeout", () => {
        req.destroy();
        resolve({
          id: this.id,
          name: this.name,
          status: "READY",
          capabilities: this.getCapabilities()
        });
      });

      req.end();
    });
  }

  async startSession(
    params: WorkerSessionParams, 
    onEvent: (event: NormalizedAgentEvent) => void
  ): Promise<{ sessionId: string; pid?: number; stop: () => Promise<void> }> {
    const port = process.env.JINWOO_HERMES_PORT || 20129;
    
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

    const fullPrompt = params.upstreamContext 
      ? `[UPSTREAM CONTEXT & FINDINGS]\n${params.upstreamContext}\n\n[YOUR TASK]\n${params.prompt}`
      : params.prompt;

    const payload = JSON.stringify({
      taskId: params.taskId,
      workflowId: params.workflowId,
      agentId: params.agentId,
      prompt: fullPrompt,
      workspacePath: params.workspacePath,
      model: params.model,
      provider: params.provider,
      apiBaseUrl: params.apiBaseUrl || "http://127.0.0.1:20128/api/v1"
    });

    let isAborted = false;
    let reqInstance: http.ClientRequest | null = null;

    const streamPromise = new Promise<void>((resolve, reject) => {
      const req = http.request({
        hostname: "127.0.0.1",
        port: Number(port),
        path: "/bus/dispatch",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload)
        }
      }, (res) => {
        let buffer = "";
        res.on("data", (chunk) => {
          if (isAborted) return;
          buffer += chunk.toString();
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                onEvent({
                  eventType: data.eventType,
                  taskId: params.taskId,
                  workflowId: params.workflowId,
                  payload: data.payload || data
                });
              } catch (e) {}
            }
          }
        });

        res.on("end", () => {
          resolve();
        });
      });

      req.on("error", (err) => {
        if (!isAborted) {
          onEvent({
            eventType: "ORCHESTRATOR_ERROR",
            taskId: params.taskId,
            workflowId: params.workflowId,
            payload: { error: `Hermes execution failed: ${err.message}` }
          });
        }
        resolve();
      });

      reqInstance = req;
      req.write(payload);
      req.end();
    });

    return {
      sessionId: params.sessionId,
      stop: async () => {
        isAborted = true;
        if (reqInstance) {
          reqInstance.destroy();
        }
      }
    };
  }
}
