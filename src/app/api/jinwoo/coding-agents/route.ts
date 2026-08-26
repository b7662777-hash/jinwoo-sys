import { NextResponse } from "next/server";
import { CodingAgentRegistry } from "@/lib/jinwoo/coding-agents/registry";
import { CodingAgentManager } from "@/lib/jinwoo/coding-agents/manager";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const registry = CodingAgentRegistry.getInstance();
    const manager = CodingAgentManager.getInstance();

    const agents = await registry.detectAll();
    const activeSessions = manager.getActiveSessions();
    const interactiveSessions = await manager.getActiveInteractiveSessions();

    return NextResponse.json({
      gateway: "OmniRoute",
      agents: agents.map(a => ({
        ...a,
        runtime: "Local",
        gateway: "OmniRoute"
      })),
      activeSessions: activeSessions.map(s => ({
        sessionId: s.sessionId,
        workflowId: s.workflowId,
        taskId: s.taskId,
        agentId: s.agentId,
        runtimeId: s.runtimeId,
        pid: s.pid,
        durationSeconds: Math.round((Date.now() - s.startTime) / 1000)
      })),
      interactiveSessions: interactiveSessions.map(s => ({
        ...s,
        durationSeconds: Math.round((Date.now() - s.startTime) / 1000)
      }))
    });
  } catch (error: any) {
    console.error("Coding Agents API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, agentId, workflowId, sessionId, workspacePath, model, provider, role } = body;

    const registry = CodingAgentRegistry.getInstance();
    const manager = CodingAgentManager.getInstance();

    if (action === "stop_workflow" && workflowId) {
      await manager.stopWorkflowSessions(workflowId);
      return NextResponse.json({ success: true, message: `Stopped all sessions for workflow ${workflowId}` });
    }

    if (action === "launch_interactive") {
      const runtime = body.runtimeId || agentId || "opencode";
      const ws = workspacePath || process.cwd();
      const actualRole = role || "DEVELOPER";
      const session = await manager.launchInteractive(
        runtime,
        ws,
        model,
        provider,
        actualRole,
        agentId,
        workflowId
      );
      return NextResponse.json({ success: true, session });
    }

    if (action === "stop_interactive" && sessionId) {
      const stopped = await manager.stopInteractive(sessionId);
      return NextResponse.json({ success: stopped, message: stopped ? "Session stopped" : "Session not found" });
    }

    if (action === "restart_interactive" && sessionId) {
      const session = await manager.restartInteractive(sessionId);
      return NextResponse.json({ success: true, session });
    }

    if (action === "test_runtime" && agentId) {
      const adapter = registry.getAdapter(agentId);
      if (!adapter) {
        return NextResponse.json({ success: false, error: `Unknown runtime: ${agentId}` }, { status: 404 });
      }

      const detection = await adapter.detectInstallation();
      if (detection.status !== "READY" || !detection.executablePath) {
        return NextResponse.json({ 
          success: false, 
          status: detection.status,
          message: `${adapter.name} is ${detection.status}. ${detection.installInstructions || ''}`
        });
      }

      // Run healthcheck command
      try {
        let testCmd = "";
        if (agentId === "opencode") {
          testCmd = `"${detection.executablePath}" --version`;
        } else if (agentId === "hermes") {
          testCmd = `python --version`;
        } else {
          testCmd = `"${detection.executablePath}" --version`;
        }

        const { stdout, stderr } = await execAsync(testCmd, { timeout: 5000 });
        const output = stdout.trim() || stderr.trim();

        return NextResponse.json({
          success: true,
          status: "READY",
          message: `${adapter.name} is healthy and responding. Output: ${output}`
        });
      } catch (cmdErr: any) {
        return NextResponse.json({
          success: false,
          status: "UNHEALTHY",
          message: `Healthcheck failed for ${adapter.name}: ${cmdErr.message}`
        });
      }
    }

    const agents = await registry.detectAll();
    return NextResponse.json({ success: true, agents });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
