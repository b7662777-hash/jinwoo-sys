"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CanonicalAgentMessage } from "@/lib/jinwoo/communication/types";
import OpenCodeRoleLaunchModal from "@/components/jinwoo/OpenCodeRoleLaunchModal";

export default function OpenCodeRuntimePage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [workspace, setWorkspace] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jinwoo_current_workspace") || "";
    }
    return "";
  });
  const [conversation, setConversation] = useState<CanonicalAgentMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  const fetchSessionAndMessages = async () => {
    try {
      const res = await fetch("/api/jinwoo/coding-agents");
      const data = await res.json();
      const opencodeSession = data.interactiveSessions?.find((s: any) => s.runtimeId === "opencode");
      setSession(opencodeSession || null);

      // Fetch messages relevant to OpenCode or its assigned role
      const msgRes = await fetch("/api/jinwoo/communication/messages?limit=50");
      const msgData = await msgRes.json();
      if (msgData.messages) {
        const assignedRole = opencodeSession?.role || "DEVELOPER";
        const filtered = msgData.messages.filter(
          (m: any) => m.fromRole === assignedRole || m.toRole === assignedRole || m.runtime === "opencode" || m.toAgentId?.includes("opencode")
        );
        setConversation(filtered);
      }
    } catch (e) {
      console.error("Failed to load session/messages:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessionAndMessages();
    const interval = setInterval(fetchSessionAndMessages, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleLaunchWithRole = async (config: {
    role: string;
    workspacePath: string;
    model: string;
    provider: string;
  }) => {
    try {
      await fetch("/api/jinwoo/coding-agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "launch_interactive",
          agentId: "opencode",
          role: config.role,
          workspacePath: config.workspacePath,
          model: config.model,
          provider: config.provider
        })
      });
      fetchSessionAndMessages();
    } catch (e) {
      console.error(e);
    }
  };

  const handleStop = async () => {
    if (!session) return;
    try {
      await fetch("/api/jinwoo/coding-agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "stop_interactive", sessionId: session.sessionId })
      });
      fetchSessionAndMessages();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    setSending(true);
    const targetRole = session?.role || "DEVELOPER";
    const targetAgentId = session?.agentId || "agent_opencode_001";
    try {
      await fetch("/api/jinwoo/communication/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowId: session?.workflowId || "wf_opencode_live",
          fromAgentId: "operator",
          fromRole: "ARCHITECT",
          toAgentId: targetAgentId,
          toRole: targetRole,
          runtime: "opencode",
          content: newMessage.trim(),
          workspacePath: session?.workspacePath || workspace,
          messageType: "CODE_REQUEST"
        })
      });
      setNewMessage("");
      fetchSessionAndMessages();
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const assignedRole = session?.role || "DEVELOPER";

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>💻</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>OpenCode Role Worker</h1>
            <span style={{ backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#34d399", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "2px 8px", borderRadius: "10px", fontSize: "11px", fontWeight: "600" }}>
              ● INSTALLED (v1.18.18)
            </span>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            First-class coding agent worker bound to explicit Jinwoo workforce roles, running via dedicated terminal session.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <Link
            href="/jinwoo/communication"
            style={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#60a5fa", padding: "8px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", textDecoration: "none" }}
          >
            ⚡ Full Bus Graph
          </Link>
          <Link
            href="/jinwoo/coding-agents"
            style={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#9ca3af", padding: "8px 14px", borderRadius: "8px", fontSize: "13px", textDecoration: "none" }}
          >
            ← All Runtimes
          </Link>
        </div>
      </div>

      {/* Active Session & Runtime Metadata */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
        {/* Runtime Spec */}
        <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", padding: "20px" }}>
          <strong style={{ color: "#f3f4f6", fontSize: "15px", display: "block", marginBottom: "12px" }}>Runtime Specifications</strong>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px" }}>
            <div><span style={{ color: "#9ca3af" }}>Executable:</span> <code style={{ color: "#34d399" }}>node_modules\.bin\opencode.cmd</code></div>
            <div><span style={{ color: "#9ca3af" }}>Installed Version:</span> <span style={{ color: "#f3f4f6" }}>v1.18.18</span></div>
            <div><span style={{ color: "#9ca3af" }}>Gateway:</span> <span style={{ color: "#60a5fa" }}>http://127.0.0.1:20128/api/v1 (OmniRoute)</span></div>
            <div><span style={{ color: "#9ca3af" }}>Role Assignment:</span> <span style={{ color: "#34d399", fontWeight: "bold" }}>SUPPORTED (10 workforce roles)</span></div>
          </div>
        </div>

        {/* Live Role Session */}
        <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", padding: "20px" }}>
          <strong style={{ color: "#f3f4f6", fontSize: "15px", display: "block", marginBottom: "12px" }}>Assigned Role & Process</strong>
          {session ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px" }}>
              <div><span style={{ color: "#9ca3af" }}>Assigned Role:</span> <strong style={{ color: "#34d399", fontSize: "13px" }}>{assignedRole}</strong></div>
              <div><span style={{ color: "#9ca3af" }}>Agent ID:</span> <code style={{ color: "#60a5fa" }}>{session.agentId || "agent_opencode_001"}</code></div>
              <div><span style={{ color: "#9ca3af" }}>Process PID:</span> <strong style={{ color: "#fbbf24" }}>{session.pid || "Active"}</strong></div>
              <div><span style={{ color: "#9ca3af" }}>Session ID:</span> <code style={{ color: "#a78bfa" }}>{session.sessionId}</code></div>
              <div><span style={{ color: "#9ca3af" }}>Workspace:</span> <span style={{ color: "#cbd5e1", fontFamily: "monospace", fontSize: "11px" }}>{session.workspacePath}</span></div>
              <div style={{ marginTop: "6px" }}>
                <button onClick={handleStop} style={{ backgroundColor: "#ef4444", color: "white", border: "none", padding: "6px 14px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
                  🛑 Stop Session & Release Locks
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p style={{ color: "#9ca3af", fontSize: "12px", margin: "0 0 12px 0" }}>No active OpenCode role session running.</p>
              <button onClick={() => setRoleModalOpen(true)} style={{ backgroundColor: "#2563eb", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
                🚀 Assign Role & Launch OpenCode
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Live OpenCode Conversation & Message Bus Stream */}
      <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <strong style={{ color: "#f3f4f6", fontSize: "15px" }}>
            Live Inter-Role Dialogue for {assignedRole} (OpenCode)
          </strong>
          <span style={{ color: "#9ca3af", fontSize: "12px" }}>{conversation.length} Correlated Messages</span>
        </div>

        {/* Message injection input */}
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder={`Send architectural instruction or task directly to ${assignedRole} (OpenCode)...`}
            style={{ flex: 1, backgroundColor: "#030712", border: "1px solid #374151", color: "#f3f4f6", padding: "8px 12px", borderRadius: "6px", fontSize: "13px", outline: "none" }}
          />
          <button
            onClick={handleSendMessage}
            disabled={sending || !newMessage.trim()}
            style={{ backgroundColor: "#2563eb", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
          >
            {sending ? "Sending..." : "Send Task"}
          </button>
        </div>

        {/* Conversation List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "400px", overflowY: "auto" }}>
          {conversation.length === 0 ? (
            <div style={{ padding: "30px", textAlign: "center", color: "#6b7280", fontSize: "12px" }}>
              No messages exchanged with OpenCode in this session yet. Launch a session or send a task above.
            </div>
          ) : (
            conversation.map((m) => (
              <div
                key={m.messageId}
                style={{
                  backgroundColor: m.fromRole === assignedRole ? "rgba(16, 185, 129, 0.08)" : "rgba(59, 130, 246, 0.08)",
                  border: `1px solid ${m.fromRole === assignedRole ? "rgba(16, 185, 129, 0.2)" : "rgba(59, 130, 246, 0.2)"}`,
                  borderRadius: "8px",
                  padding: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <strong style={{ color: m.fromRole === assignedRole ? "#34d399" : "#60a5fa" }}>{m.fromRole}</strong>
                    <span style={{ color: "#6b7280" }}>→</span>
                    <strong style={{ color: m.toRole === assignedRole ? "#34d399" : "#a78bfa" }}>{m.toRole}</strong>
                    <span style={{ backgroundColor: "#111827", padding: "1px 6px", borderRadius: "4px", color: "#9ca3af" }}>{m.messageType}</span>
                  </div>
                  <span style={{ color: "#6b7280" }}>{new Date(m.createdAt).toLocaleTimeString()}</span>
                </div>
                <p style={{ color: "#f3f4f6", fontSize: "12px", margin: 0, lineHeight: "1.4" }}>{m.content}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <OpenCodeRoleLaunchModal
        isOpen={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        onLaunch={handleLaunchWithRole}
        defaultWorkspace={workspace}
      />
    </div>
  );
}
