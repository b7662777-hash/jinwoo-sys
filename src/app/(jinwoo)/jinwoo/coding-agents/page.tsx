"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import OpenCodeRoleLaunchModal from "@/components/jinwoo/OpenCodeRoleLaunchModal";

export default function CodingAgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [interactiveSessions, setInteractiveSessions] = useState<any[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jinwoo_current_workspace") || "";
    }
    return "";
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, { status: string; message: string }>>({});
  const [testingMap, setTestingMap] = useState<Record<string, boolean>>({});
  const [launching, setLaunching] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [modalTargetAgent, setModalTargetAgent] = useState("opencode");

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/jinwoo/coding-agents");
      const data = await res.json();
      if (data.agents) setAgents(data.agents);
      if (data.activeSessions) setActiveSessions(data.activeSessions);
      if (data.interactiveSessions) setInteractiveSessions(data.interactiveSessions);
    } catch (e) {
      console.error("Failed to fetch coding agents:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleOpenLaunchModal = (agentId: string) => {
    setModalTargetAgent(agentId);
    setRoleModalOpen(true);
  };

  const handleLaunchWithRole = async (config: {
    role: string;
    workspacePath: string;
    model: string;
    provider: string;
  }) => {
    setLaunching(true);
    try {
      const res = await fetch("/api/jinwoo/coding-agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "launch_interactive",
          agentId: modalTargetAgent,
          role: config.role,
          workspacePath: config.workspacePath,
          model: config.model,
          provider: config.provider
        })
      });
      const data = await res.json();
      if (data.success) {
        await fetchAgents();
      }
    } catch (err) {
      console.error("Failed to launch interactive terminal:", err);
    } finally {
      setLaunching(false);
    }
  };

  const handleStopInteractive = async (sessionId: string) => {
    try {
      await fetch("/api/jinwoo/coding-agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "stop_interactive", sessionId })
      });
      await fetchAgents();
    } catch (err) {
      console.error("Failed to stop interactive session:", err);
    }
  };

  const handleRestartInteractive = async (sessionId: string) => {
    try {
      await fetch("/api/jinwoo/coding-agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restart_interactive", sessionId })
      });
      await fetchAgents();
    } catch (err) {
      console.error("Failed to restart interactive session:", err);
    }
  };

  const handleTestRuntime = async (agentId: string) => {
    setTestingMap(prev => ({ ...prev, [agentId]: true }));
    try {
      const res = await fetch("/api/jinwoo/coding-agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "test_runtime", agentId })
      });
      const data = await res.json();
      setTestResults(prev => ({
        ...prev,
        [agentId]: {
          status: data.success ? "PASS" : "FAIL",
          message: data.message || (data.success ? "Runtime is healthy and responding." : "Runtime test failed.")
        }
      }));
    } catch (err: any) {
      setTestResults(prev => ({
        ...prev,
        [agentId]: { status: "FAIL", message: err.message }
      }));
    } finally {
      setTestingMap(prev => ({ ...prev, [agentId]: false }));
    }
  };

  const getStatusBadge = (status: string, isInteractiveRunning: boolean) => {
    if (isInteractiveRunning) {
      return <span style={{ backgroundColor: "rgba(59, 130, 246, 0.2)", color: "#60a5fa", border: "1px solid rgba(59, 130, 246, 0.4)", padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "700" }}>● RUNNING</span>;
    }

    switch (status) {
      case "READY":
        return <span style={{ backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#34d399", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "600" }}>● READY</span>;
      case "NOT_INSTALLED":
        return <span style={{ backgroundColor: "rgba(107, 114, 128, 0.15)", color: "#9ca3af", border: "1px solid rgba(107, 114, 128, 0.3)", padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "600" }}>○ NOT INSTALLED</span>;
      case "NOT_CONFIGURED":
        return <span style={{ backgroundColor: "rgba(245, 158, 11, 0.15)", color: "#fbbf24", border: "1px solid rgba(245, 158, 11, 0.3)", padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "600" }}>▲ NOT CONFIGURED</span>;
      default:
        return <span style={{ backgroundColor: "rgba(239, 68, 68, 0.15)", color: "#f87171", border: "1px solid rgba(239, 68, 68, 0.3)", padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "600" }}>✕ UNHEALTHY</span>;
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🤖</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Coding Agent Runtimes</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Orchestrate external worker runtimes (OpenCode, Hermes, Claude Code, Codex, OpenClaw) over a shared local workspace.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            style={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              color: "#f3f4f6",
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "500",
              cursor: refreshing ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            {refreshing ? "Scanning..." : "⟳ Rescan Runtimes"}
          </button>

          <Link
            href="/jinwoo/workforce"
            style={{
              backgroundColor: "#10b981",
              color: "white",
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "600",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            👥 Configure Workforce
          </Link>
        </div>
      </div>

      {/* Target Workspace Selector Bar */}
      <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "16px 20px", marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
          <span style={{ fontSize: "18px" }}>📁</span>
          <div style={{ width: "100%" }}>
            <label style={{ display: "block", color: "#9ca3af", fontSize: "11px", fontWeight: "600", marginBottom: "4px" }}>
              TARGET LOCAL WORKSPACE
            </label>
            <input
              value={currentWorkspace}
              onChange={(e) => setCurrentWorkspace(e.target.value)}
              style={{
                width: "90%",
                backgroundColor: "#0D111C",
                border: "1px solid #374151",
                color: "#60a5fa",
                padding: "6px 10px",
                borderRadius: "6px",
                fontSize: "13px",
                fontFamily: "monospace"
              }}
            />
          </div>
        </div>
        <Link
          href="/jinwoo/workspaces"
          style={{
            backgroundColor: "#1f2937",
            border: "1px solid #374151",
            color: "#a78bfa",
            padding: "8px 14px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: "600",
            textDecoration: "none"
          }}
        >
          Manage Workspaces
        </Link>
      </div>

      {/* Gateway Transport Banner */}
      <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "16px 20px", marginBottom: "24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "18px" }}>🌐</span>
          <div>
            <div style={{ color: "#f3f4f6", fontSize: "14px", fontWeight: "600" }}>Unified Local Gateway: OmniRoute</div>
            <div style={{ color: "#9ca3af", fontSize: "12px" }}>All worker coding agents route model calls through OmniRoute local gateway (port 20128).</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#34d399", fontSize: "12px", fontWeight: "600" }}>
          <span>● Active (http://127.0.0.1:20128)</span>
        </div>
      </div>

      {/* Agent Runtimes Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "20px" }}>
        {agents.map((agent) => {
          const interactiveSession = interactiveSessions.find(s => s.runtimeId === agent.id);
          const isInteractiveRunning = !!interactiveSession;

          return (
            <div
              key={agent.id}
              style={{
                backgroundColor: "#0D111C",
                border: `1px solid ${isInteractiveRunning ? "rgba(59, 130, 246, 0.5)" : agent.status === "READY" ? "rgba(16, 185, 129, 0.3)" : "#1f2937"}`,
                borderRadius: "12px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "16px"
              }}
            >
              {/* Card Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ color: "#f3f4f6", fontSize: "16px", fontWeight: "bold" }}>{agent.name.toUpperCase()}</div>
                  <div style={{ color: "#6b7280", fontSize: "12px", fontFamily: "monospace", marginTop: "2px" }}>
                    {agent.version || "version auto-detect"}
                  </div>
                </div>
                {getStatusBadge(agent.status, isInteractiveRunning)}
              </div>

              {/* Architecture & Live Session State */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", backgroundColor: "rgba(0,0,0,0.3)", padding: "12px", borderRadius: "8px", fontSize: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#9ca3af" }}>Runtime:</span>
                  <strong style={{ color: "#f3f4f6" }}>{agent.name} {agent.version}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#9ca3af" }}>Gateway:</span>
                  <strong style={{ color: "#34d399" }}>OmniRoute</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#9ca3af" }}>Provider:</span>
                  <strong style={{ color: "#a78bfa" }}>{interactiveSession?.provider || "Antigravity / OpenRouter"}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#9ca3af" }}>Model:</span>
                  <strong style={{ color: "#60a5fa", wordBreak: "break-all" }}>{interactiveSession?.model || "claude-sonnet-4-6"}</strong>
                </div>
                {isInteractiveRunning && (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #1f2937", paddingTop: "6px", marginTop: "2px" }}>
                      <span style={{ color: "#9ca3af" }}>Active PID:</span>
                      <strong style={{ color: "#34d399", fontFamily: "monospace" }}>{interactiveSession.pid || "Active"}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#9ca3af" }}>Uptime:</span>
                      <strong style={{ color: "#f3f4f6" }}>{interactiveSession.durationSeconds}s</strong>
                    </div>
                    <div style={{ fontSize: "11px", color: "#6b7280", wordBreak: "break-all" }}>
                      Workspace: <span style={{ color: "#cbd5e1" }}>{interactiveSession.workspacePath}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Capabilities Matrix */}
              <div>
                <div style={{ color: "#9ca3af", fontSize: "11px", fontWeight: "600", marginBottom: "6px" }}>CAPABILITIES</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {agent.capabilities?.supportsWorkspace && (
                    <span style={{ fontSize: "10px", color: "#60a5fa", backgroundColor: "rgba(59, 130, 246, 0.1)", padding: "2px 6px", borderRadius: "4px" }}>📁 Workspace</span>
                  )}
                  {agent.capabilities?.supportsFileTools && (
                    <span style={{ fontSize: "10px", color: "#34d399", backgroundColor: "rgba(52, 211, 153, 0.1)", padding: "2px 6px", borderRadius: "4px" }}>✏ Files</span>
                  )}
                  {agent.capabilities?.supportsTerminal && (
                    <span style={{ fontSize: "10px", color: "#a78bfa", backgroundColor: "rgba(167, 139, 250, 0.1)", padding: "2px 6px", borderRadius: "4px" }}>💻 Terminal</span>
                  )}
                  {agent.capabilities?.supportsGit && (
                    <span style={{ fontSize: "10px", color: "#f59e0b", backgroundColor: "rgba(245, 158, 11, 0.1)", padding: "2px 6px", borderRadius: "4px" }}>🌿 Git</span>
                  )}
                  {agent.capabilities?.supportsStreaming && (
                    <span style={{ fontSize: "10px", color: "#ec4899", backgroundColor: "rgba(236, 72, 153, 0.1)", padding: "2px 6px", borderRadius: "4px" }}>⚡ Streaming</span>
                  )}
                  {agent.capabilities?.supportsParallelSessions && (
                    <span style={{ fontSize: "10px", color: "#38bdf8", backgroundColor: "rgba(56, 189, 248, 0.1)", padding: "2px 6px", borderRadius: "4px" }}>🔀 Parallel Sessions</span>
                  )}
                </div>
              </div>

              {/* Test Result Message Banner */}
              {testResults[agent.id] && (
                <div style={{
                  fontSize: "11px",
                  padding: "8px 10px",
                  borderRadius: "6px",
                  backgroundColor: testResults[agent.id].status === "PASS" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                  border: `1px solid ${testResults[agent.id].status === "PASS" ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                  color: testResults[agent.id].status === "PASS" ? "#34d399" : "#f87171"
                }}>
                  <strong>{testResults[agent.id].status === "PASS" ? "✓ Test Passed" : "✕ Test Failed"}:</strong> {testResults[agent.id].message}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ marginTop: "auto", borderTop: "1px solid #1f2937", paddingTop: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
                {agent.status === "READY" ? (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: isInteractiveRunning ? "1fr 1fr" : "1fr", gap: "8px" }}>
                      {!isInteractiveRunning ? (
                        <button
                          onClick={() => handleOpenLaunchModal(agent.id)}
                          disabled={launching}
                          style={{
                            backgroundColor: "#3b82f6",
                            border: "none",
                            color: "white",
                            padding: "8px 12px",
                            borderRadius: "8px",
                            fontSize: "12px",
                            fontWeight: "700",
                            cursor: launching ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px"
                          }}
                        >
                          ⚡ Assign Role & Launch {agent.name}
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleStopInteractive(interactiveSession.sessionId)}
                            style={{
                              backgroundColor: "rgba(239, 68, 68, 0.2)",
                              border: "1px solid rgba(239, 68, 68, 0.4)",
                              color: "#f87171",
                              padding: "8px 12px",
                              borderRadius: "8px",
                              fontSize: "12px",
                              fontWeight: "700",
                              cursor: "pointer"
                            }}
                          >
                            ⏹ Stop Session
                          </button>
                          <button
                            onClick={() => handleRestartInteractive(interactiveSession.sessionId)}
                            style={{
                              backgroundColor: "#1f2937",
                              border: "1px solid #374151",
                              color: "#60a5fa",
                              padding: "8px 12px",
                              borderRadius: "8px",
                              fontSize: "12px",
                              fontWeight: "600",
                              cursor: "pointer"
                            }}
                          >
                            🔄 Restart
                          </button>
                        </>
                      )}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
                      <button
                        onClick={() => handleTestRuntime(agent.id)}
                        disabled={testingMap[agent.id]}
                        style={{
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                          color: "#9ca3af",
                          padding: "6px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: "600",
                          cursor: testingMap[agent.id] ? "not-allowed" : "pointer"
                        }}
                      >
                        {testingMap[agent.id] ? "Testing..." : "🧪 Test"}
                      </button>

                      <Link
                        href="/jinwoo/workforce"
                        style={{
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                          color: "#a78bfa",
                          padding: "6px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: "600",
                          textAlign: "center",
                          textDecoration: "none"
                        }}
                      >
                        ⚙ Configure
                      </Link>

                      <Link
                        href="/jinwoo/workspaces"
                        style={{
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                          color: "#34d399",
                          padding: "6px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: "600",
                          textAlign: "center",
                          textDecoration: "none"
                        }}
                      >
                        📁 Workspace
                      </Link>
                    </div>
                  </>
                ) : (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      disabled
                      style={{
                        flex: 1,
                        backgroundColor: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        color: "#6b7280",
                        padding: "8px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        cursor: "not-allowed"
                      }}
                    >
                      UNSUPPORTED (NOT INSTALLED)
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <OpenCodeRoleLaunchModal
        isOpen={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        onLaunch={handleLaunchWithRole}
        defaultWorkspace={currentWorkspace}
      />
    </div>
  );
}
