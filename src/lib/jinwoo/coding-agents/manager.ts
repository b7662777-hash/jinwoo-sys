import { CodingAgentRegistry } from "./registry";
import { WorkerSessionParams, NormalizedAgentEvent } from "./types";
import { WorkspaceGuard } from "../workspace/guard";
import { OpenCodeAdapter, InteractiveSessionInfo } from "./adapters/opencode";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

interface ActiveSessionHandle {
  sessionId: string;
  workflowId: string;
  taskId: string;
  agentId: string;
  runtimeId: string;
  pid?: number;
  stop: () => Promise<void>;
  startTime: number;
}

export class CodingAgentManager {
  private static instance: CodingAgentManager;
  private registry: CodingAgentRegistry;
  private guard: WorkspaceGuard;
  private activeSessions: Map<string, ActiveSessionHandle> = new Map();
  private interactiveSessions: Map<string, InteractiveSessionInfo> = new Map();

  private constructor() {
    this.registry = CodingAgentRegistry.getInstance();
    this.guard = WorkspaceGuard.getInstance();
  }

  public static getInstance(): CodingAgentManager {
    if (!CodingAgentManager.instance) {
      CodingAgentManager.instance = new CodingAgentManager();
    }
    return CodingAgentManager.instance;
  }

  public async executeTask(
    params: WorkerSessionParams,
    onEvent: (event: NormalizedAgentEvent) => void
  ): Promise<void> {
    // 1. Validate Workspace
    const wsValidation = this.guard.validateWorkspace(params.workspacePath);
    if (!wsValidation.valid) {
      onEvent({
        eventType: "AGENT_FAILED",
        taskId: params.taskId,
        workflowId: params.workflowId,
        payload: { error: `Workspace safety failure: ${wsValidation.error}` }
      });
      return;
    }
    params.workspacePath = wsValidation.resolvedPath;

    // 2. Select Adapter
    const runtimeId = (params as any).runtimeId || "hermes";
    const adapter = this.registry.getAdapter(runtimeId) || this.registry.getAdapter("hermes")!;

    // 3. Wrap onEvent to monitor file changes and detect conflicts
    const wrappedOnEvent = (event: NormalizedAgentEvent) => {
      if (event.eventType === "FILE_CHANGED" && event.payload?.path) {
        const conflictCheck = this.guard.checkConflict(
          event.payload.path,
          params.agentId,
          params.taskId,
          params.workflowId
        );

        if (conflictCheck.conflict && conflictCheck.conflictingWith) {
          onEvent({
            eventType: "CONFLICT_DETECTED",
            taskId: params.taskId,
            workflowId: params.workflowId,
            payload: {
              file: event.payload.path,
              agentA: conflictCheck.conflictingWith.lockedByAgent,
              agentB: params.agentId,
              message: `Concurrent write conflict detected on ${event.payload.path} between ${conflictCheck.conflictingWith.lockedByAgent} and ${params.agentId}.`
            }
          });
        }
      }

      onEvent(event);
    };

    // 4. Start Session
    try {
      const handle = await adapter.startSession(params, wrappedOnEvent);
      this.activeSessions.set(params.sessionId, {
        sessionId: params.sessionId,
        workflowId: params.workflowId,
        taskId: params.taskId,
        agentId: params.agentId,
        runtimeId: adapter.id,
        pid: handle.pid,
        stop: handle.stop,
        startTime: Date.now()
      });
    } catch (err: any) {
      wrappedOnEvent({
        eventType: "AGENT_FAILED",
        taskId: params.taskId,
        workflowId: params.workflowId,
        payload: { error: `Agent runtime error: ${err.message}` }
      });
    } finally {
      this.activeSessions.delete(params.sessionId);
      this.guard.releaseLocksForTask(params.taskId);
    }
  }

  public async stopWorkflowSessions(workflowId: string): Promise<void> {
    const toStop: ActiveSessionHandle[] = [];
    for (const [id, session] of this.activeSessions.entries()) {
      if (session.workflowId === workflowId) {
        toStop.push(session);
        this.activeSessions.delete(id);
      }
    }

    for (const session of toStop) {
      try {
        await session.stop();
      } catch (e) {}
    }

    this.guard.releaseLocksForWorkflow(workflowId);
  }

  public getActiveSessions(): ActiveSessionHandle[] {
    return Array.from(this.activeSessions.values());
  }

  // --- Interactive Terminal TUI Sessions ---

  public async launchInteractive(
    runtimeId: string,
    workspacePath: string,
    model?: string,
    provider?: string,
    role = "DEVELOPER",
    agentId?: string,
    workflowId?: string
  ): Promise<InteractiveSessionInfo> {
    const wsValidation = this.guard.validateWorkspace(workspacePath);
    if (!wsValidation.valid) {
      throw new Error(`Invalid workspace: ${wsValidation.error}`);
    }
    const resolvedPath = wsValidation.resolvedPath;

    // Check if an interactive session is already running for this runtime & workspace
    for (const [id, s] of this.interactiveSessions.entries()) {
      if (s.runtimeId === runtimeId && s.workspacePath.toLowerCase() === resolvedPath.toLowerCase()) {
        const isAlive = await this.isProcessAlive(s.pid);
        if (isAlive) {
          return s;
        } else {
          this.interactiveSessions.delete(id);
        }
      }
    }

    if (runtimeId === "opencode") {
      const adapter = this.registry.getAdapter("opencode") as OpenCodeAdapter;
      const session = await adapter.launchInteractive(
        resolvedPath,
        model,
        provider,
        "http://127.0.0.1:20128/api/v1",
        role,
        agentId,
        workflowId
      );
      this.interactiveSessions.set(session.sessionId, session);
      return session;
    }

    throw new Error(`Interactive TUI launch not supported for ${runtimeId}`);
  }

  public async stopInteractive(sessionId: string): Promise<boolean> {
    const session = this.interactiveSessions.get(sessionId);
    if (!session) return false;

    if (session.pid) {
      if (process.platform === "win32") {
        try {
          await execAsync(`taskkill /PID ${session.pid} /T /F`);
        } catch (e) {}
      } else {
        try {
          process.kill(session.pid, "SIGTERM");
        } catch (e) {}
      }
    }

    this.interactiveSessions.delete(sessionId);
    return true;
  }

  public async restartInteractive(sessionId: string): Promise<InteractiveSessionInfo> {
    const session = this.interactiveSessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    await this.stopInteractive(sessionId);
    return this.launchInteractive(session.runtimeId, session.workspacePath, session.model, session.provider);
  }

  public async getActiveInteractiveSessions(): Promise<InteractiveSessionInfo[]> {
    const active: InteractiveSessionInfo[] = [];

    // Verify all tracked interactive sessions are still alive
    for (const [id, s] of this.interactiveSessions.entries()) {
      const alive = await this.isProcessAlive(s.pid);
      if (alive) {
        active.push(s);
      } else {
        this.interactiveSessions.delete(id);
      }
    }

    // On application restart / rescan, detect existing OpenCode processes
    if (active.length === 0 && process.platform === "win32") {
      try {
        const { stdout } = await execAsync(`powershell -Command "Get-Process -Name opencode -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Id"`);
        const pids = stdout.trim().split(/\r?\n/).map(p => parseInt(p.trim(), 10)).filter(p => !isNaN(p) && p > 0);
        
        for (const pid of pids) {
          const autoId = `interactive_opencode_recovered_${pid}`;
          const recoveredSession: InteractiveSessionInfo = {
            sessionId: autoId,
            runtimeId: "opencode",
            runtimeName: "OpenCode",
            version: "v1.18.18",
            workspacePath: process.cwd(),
            role: "DEVELOPER",
            agentId: `agent_opencode_recovered_${pid}`,
            model: "antigravity/claude-sonnet-4-6",
            provider: "antigravity",
            gateway: "OmniRoute",
            pid,
            startTime: Date.now()
          };
          this.interactiveSessions.set(autoId, recoveredSession);
          active.push(recoveredSession);
        }
      } catch (e) {}
    }

    return active;
  }

  private async isProcessAlive(pid?: number): Promise<boolean> {
    if (!pid) return false;
    try {
      if (process.platform === "win32") {
        const { stdout } = await execAsync(`powershell -Command "Get-Process -Id ${pid} -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Id"`);
        return stdout.trim().length > 0;
      } else {
        process.kill(pid, 0);
        return true;
      }
    } catch (e) {
      return false;
    }
  }
}
