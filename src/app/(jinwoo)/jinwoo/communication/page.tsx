"use client";

import React, { useState, useEffect, useRef } from "react";
import { CanonicalAgentMessage } from "@/lib/jinwoo/communication/types";
import { useJinwooWorkspace } from "../context";

export default function CommunicationCenterPage() {
  const { workspacePath, workflowId } = useJinwooWorkspace();

  const [messages, setMessages] = useState<CanonicalAgentMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<CanonicalAgentMessage | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");
  const [connected, setConnected] = useState(false);
  const [interactiveSessions, setInteractiveSessions] = useState<any[]>([]);

  // Human intervention input
  const [humanInput, setHumanInput] = useState("");
  const [targetAgent, setTargetAgent] = useState("developer");
  const [isSending, setIsSending] = useState(false);

  const timelineEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchInitialMessages();
    fetchActiveRuntimes();

    // Connect to live SSE stream
    const eventSource = new EventSource("/api/jinwoo/communication/stream");

    eventSource.onopen = () => setConnected(true);
    eventSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.eventType === "AGENT_MESSAGE_CREATED" || data.eventType === "AGENT_MESSAGE_DELIVERED" || data.eventType === "AGENT_MESSAGE_ACKNOWLEDGED") {
          const incoming: CanonicalAgentMessage = data.message;
          setMessages((prev) => {
            const exists = prev.findIndex((m) => m.messageId === incoming.messageId);
            if (exists >= 0) {
              const updated = [...prev];
              updated[exists] = incoming;
              return updated;
            }
            return [...prev, incoming];
          });
        }
      } catch (err) {}
    };

    eventSource.onerror = () => setConnected(false);

    return () => {
      eventSource.close();
    };
  }, [workflowId]);

  const fetchActiveRuntimes = async () => {
    try {
      const res = await fetch("/api/jinwoo/coding-agents");
      const data = await res.json();
      if (data.interactiveSessions) {
        setInteractiveSessions(data.interactiveSessions);
      }
    } catch (e) {}
  };

  const fetchInitialMessages = async () => {
    try {
      const res = await fetch(`/api/jinwoo/communication/messages?limit=100`);
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendMessage = async () => {
    if (!humanInput.trim()) return;
    setIsSending(true);
    try {
      await fetch("/api/jinwoo/communication/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowId: workflowId || "wf_default",
          correlationId: `corr_${Date.now()}`,
          fromAgentId: "human_operator",
          fromRole: "HUMAN_OPERATOR",
          toAgentId: targetAgent,
          toRole: targetAgent.toUpperCase(),
          content: humanInput.trim(),
          workspacePath: workspacePath || (typeof window !== "undefined" ? localStorage.getItem("jinwoo_current_workspace") || "" : ""),
          messageType: "AGENT_MESSAGE"
        })
      });
      setHumanInput("");
    } catch (e) {
      console.error(e);
    } finally {
      setIsSending(false);
    }
  };

  const handleApproveHandoff = async (msgId: string) => {
    try {
      await fetch(`/api/jinwoo/communication/${msgId}/ack`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId: "human_operator" })
      });
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = messages.filter((m) => {
    if (selectedFilter === "ALL") return true;
    return m.fromRole === selectedFilter || m.toRole === selectedFilter || m.messageType === selectedFilter;
  });

  const getRuntimeForRole = (role: string, defaultName: string) => {
    const session = interactiveSessions.find((s) => (s.role || "").toUpperCase() === role.toUpperCase() || (role === "DEVELOPER" && s.runtimeId === "opencode"));
    if (session) {
      return `${session.runtimeName || "OpenCode"} ${session.pid ? `(PID: ${session.pid})` : ""}`;
    }
    return defaultName;
  };

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "28px 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>⚡</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Multi-Agent Communication Bus</h1>
            <span style={{
              backgroundColor: connected ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
              color: connected ? "#34d399" : "#f87171",
              border: `1px solid ${connected ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
              padding: "2px 8px",
              borderRadius: "10px",
              fontSize: "11px",
              fontWeight: "600"
            }}>
              ● {connected ? "LIVE SSE STREAM" : "CONNECTING"}
            </span>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Real-time role-to-role communication, correlated handoff protocols, and live delivery guarantees.
          </p>
        </div>

        <button
          onClick={fetchInitialMessages}
          style={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#f3f4f6", padding: "6px 14px", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Visual Communication Topology Graph */}
      <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", padding: "20px", marginBottom: "24px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: "bold", color: "#9ca3af", margin: "0 0 16px 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Live Workforce Topology & Inter-Role Links
        </h3>
        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", position: "relative", padding: "10px 0" }}>
          {/* Architect Node */}
          <div
            onClick={() => setSelectedFilter(selectedFilter === "ARCHITECT" ? "ALL" : "ARCHITECT")}
            style={{
              backgroundColor: "#111827",
              border: selectedFilter === "ARCHITECT" ? "2px solid #3b82f6" : "1px solid #374151",
              borderRadius: "10px",
              padding: "12px 18px",
              textAlign: "center",
              cursor: "pointer",
              minWidth: "140px"
            }}
          >
            <span style={{ fontSize: "20px" }}>🏛️</span>
            <strong style={{ color: "#f3f4f6", fontSize: "13px", display: "block", marginTop: "4px" }}>ARCHITECT</strong>
            <span style={{ color: "#60a5fa", fontSize: "11px" }}>{getRuntimeForRole("ARCHITECT", "Hermes / Opus")}</span>
          </div>

          <div style={{ color: "#6b7280", fontSize: "18px" }}>⇄</div>

          {/* Developer Node */}
          <div
            onClick={() => setSelectedFilter(selectedFilter === "DEVELOPER" ? "ALL" : "DEVELOPER")}
            style={{
              backgroundColor: "#111827",
              border: selectedFilter === "DEVELOPER" ? "2px solid #10b981" : "1px solid #374151",
              borderRadius: "10px",
              padding: "12px 18px",
              textAlign: "center",
              cursor: "pointer",
              minWidth: "140px"
            }}
          >
            <span style={{ fontSize: "20px" }}>💻</span>
            <strong style={{ color: "#f3f4f6", fontSize: "13px", display: "block", marginTop: "4px" }}>DEVELOPER</strong>
            <span style={{ color: "#34d399", fontSize: "11px", fontWeight: "600" }}>{getRuntimeForRole("DEVELOPER", "OpenCode v1.18.18")}</span>
          </div>

          <div style={{ color: "#6b7280", fontSize: "18px" }}>⇄</div>

          {/* QA Node */}
          <div
            onClick={() => setSelectedFilter(selectedFilter === "QA" ? "ALL" : "QA")}
            style={{
              backgroundColor: "#111827",
              border: selectedFilter === "QA" ? "2px solid #a78bfa" : "1px solid #374151",
              borderRadius: "10px",
              padding: "12px 18px",
              textAlign: "center",
              cursor: "pointer",
              minWidth: "140px"
            }}
          >
            <span style={{ fontSize: "20px" }}>🧪</span>
            <strong style={{ color: "#f3f4f6", fontSize: "13px", display: "block", marginTop: "4px" }}>QA VERIFIER</strong>
            <span style={{ color: "#a78bfa", fontSize: "11px" }}>{getRuntimeForRole("QA", "Codex / Python")}</span>
          </div>

          <div style={{ color: "#6b7280", fontSize: "18px" }}>⇄</div>

          {/* Security Node */}
          <div
            onClick={() => setSelectedFilter(selectedFilter === "SECURITY" ? "ALL" : "SECURITY")}
            style={{
              backgroundColor: "#111827",
              border: selectedFilter === "SECURITY" ? "2px solid #f59e0b" : "1px solid #374151",
              borderRadius: "10px",
              padding: "12px 18px",
              textAlign: "center",
              cursor: "pointer",
              minWidth: "140px"
            }}
          >
            <span style={{ fontSize: "20px" }}>🛡️</span>
            <strong style={{ color: "#f3f4f6", fontSize: "13px", display: "block", marginTop: "4px" }}>SECURITY</strong>
            <span style={{ color: "#fbbf24", fontSize: "11px" }}>{getRuntimeForRole("SECURITY", "Guardrails")}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area: Timeline + Inspector Drawer */}
      <div style={{ display: "grid", gridTemplateColumns: selectedMessage ? "1.3fr 1fr" : "1fr", gap: "20px" }}>
        
        {/* Timeline & Interaction Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* Human-in-the-Loop Input */}
          <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", padding: "16px", display: "flex", gap: "10px", alignItems: "center" }}>
            <span style={{ fontSize: "18px" }}>👤</span>
            <select
              value={targetAgent}
              onChange={(e) => setTargetAgent(e.target.value)}
              style={{ backgroundColor: "#111827", border: "1px solid #374151", color: "#f3f4f6", padding: "6px 10px", borderRadius: "6px", fontSize: "12px", outline: "none" }}
            >
              <option value="architect">→ Architect</option>
              <option value="developer">→ Developer (OpenCode)</option>
              <option value="qa">→ QA Verifier</option>
              <option value="security">→ Security</option>
            </select>

            <input
              value={humanInput}
              onChange={(e) => setHumanInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Inject operator message or instruction into the running multi-agent bus..."
              style={{ flex: 1, backgroundColor: "#030712", border: "1px solid #374151", color: "#f3f4f6", padding: "8px 12px", borderRadius: "6px", fontSize: "13px", outline: "none" }}
            />

            <button
              onClick={handleSendMessage}
              disabled={isSending || !humanInput.trim()}
              style={{
                backgroundColor: isSending ? "#374151" : "#2563eb",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: "600",
                cursor: isSending ? "not-allowed" : "pointer"
              }}
            >
              {isSending ? "Sending..." : "Send Message"}
            </button>
          </div>

          {/* Timeline Feed */}
          <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px", maxHeight: "600px", overflowY: "auto" }}>
            {filtered.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
                No inter-agent messages recorded yet. Start a workflow or inject an operator message above.
              </div>
            ) : (
              filtered.map((msg) => (
                <div
                  key={msg.messageId}
                  onClick={() => setSelectedMessage(msg)}
                  style={{
                    backgroundColor: selectedMessage?.messageId === msg.messageId ? "rgba(59, 130, 246, 0.12)" : "#111827",
                    border: selectedMessage?.messageId === msg.messageId ? "1px solid #3b82f6" : "1px solid #1f2937",
                    borderRadius: "10px",
                    padding: "14px 16px",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    transition: "all 0.15s ease"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{
                        backgroundColor: msg.fromRole === "ARCHITECT" ? "rgba(59, 130, 246, 0.2)" : msg.fromRole === "DEVELOPER" ? "rgba(16, 185, 129, 0.2)" : "rgba(167, 139, 250, 0.2)",
                        color: msg.fromRole === "ARCHITECT" ? "#60a5fa" : msg.fromRole === "DEVELOPER" ? "#34d399" : "#c084fc",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: "700"
                      }}>
                        {msg.fromRole}
                      </span>
                      <span style={{ color: "#6b7280", fontSize: "12px" }}>→</span>
                      <span style={{
                        backgroundColor: msg.toRole === "DEVELOPER" ? "rgba(16, 185, 129, 0.2)" : msg.toRole === "QA" ? "rgba(167, 139, 250, 0.2)" : "rgba(59, 130, 246, 0.2)",
                        color: msg.toRole === "DEVELOPER" ? "#34d399" : msg.toRole === "QA" ? "#c084fc" : "#60a5fa",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: "700"
                      }}>
                        {msg.toRole}
                      </span>
                      <span style={{ backgroundColor: "#1f2937", color: "#9ca3af", padding: "2px 6px", borderRadius: "4px", fontSize: "10px", fontFamily: "monospace" }}>
                        {msg.messageType}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ color: "#6b7280", fontSize: "11px", fontFamily: "monospace" }}>
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </span>
                      <span style={{
                        backgroundColor: msg.status === "DELIVERED" || msg.status === "ACKNOWLEDGED" ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                        color: msg.status === "DELIVERED" || msg.status === "ACKNOWLEDGED" ? "#34d399" : "#fbbf24",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontSize: "10px",
                        fontWeight: "bold"
                      }}>
                        ● {msg.status}
                      </span>
                    </div>
                  </div>

                  <p style={{ color: "#e5e7eb", fontSize: "13px", margin: 0, lineHeight: "1.4", wordBreak: "break-word" }}>
                    {msg.content}
                  </p>

                  {msg.messageType === "APPROVAL_REQUEST" && (
                    <div style={{ marginTop: "4px" }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleApproveHandoff(msg.messageId); }}
                        style={{ backgroundColor: "#10b981", color: "white", border: "none", padding: "4px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: "600", cursor: "pointer" }}
                      >
                        ✓ Approve Handoff
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={timelineEndRef} />
          </div>
        </div>

        {/* Message Inspector Drawer */}
        {selectedMessage && (
          <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px", height: "fit-content" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1f2937", paddingBottom: "12px" }}>
              <strong style={{ color: "#f3f4f6", fontSize: "15px" }}>Message Inspector</strong>
              <button onClick={() => setSelectedMessage(null)} style={{ background: "transparent", border: "none", color: "#9ca3af", cursor: "pointer" }}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", backgroundColor: "#111827", padding: "12px", borderRadius: "8px", fontSize: "12px" }}>
              <div><span style={{ color: "#9ca3af" }}>Message ID:</span> <code style={{ color: "#60a5fa" }}>{selectedMessage.messageId}</code></div>
              <div><span style={{ color: "#9ca3af" }}>Correlation ID:</span> <code style={{ color: "#a78bfa" }}>{selectedMessage.correlationId}</code></div>
              <div><span style={{ color: "#9ca3af" }}>Workflow ID:</span> <span style={{ color: "#f3f4f6" }}>{selectedMessage.workflowId}</span></div>
              <div><span style={{ color: "#9ca3af" }}>From:</span> <span style={{ color: "#34d399" }}>{selectedMessage.fromRole} ({selectedMessage.fromAgentId})</span></div>
              <div><span style={{ color: "#9ca3af" }}>To:</span> <span style={{ color: "#60a5fa" }}>{selectedMessage.toRole} ({selectedMessage.toAgentId})</span></div>
              <div><span style={{ color: "#9ca3af" }}>Runtime / Model:</span> <span style={{ color: "#fbbf24" }}>{selectedMessage.runtime} • {selectedMessage.modelId}</span></div>
              <div><span style={{ color: "#9ca3af" }}>Workspace:</span> <span style={{ color: "#9ca3af", fontFamily: "monospace", fontSize: "11px" }}>{selectedMessage.workspacePath}</span></div>
            </div>

            {/* Delivery Lifecycle Timeline */}
            <div>
              <span style={{ fontSize: "11px", fontWeight: "700", color: "#6b7280", letterSpacing: "0.05em", display: "block", marginBottom: "8px" }}>
                DELIVERY GUARANTEE LIFECYCLE
              </span>
              <div style={{ backgroundColor: "#030712", padding: "10px", borderRadius: "6px", fontSize: "11px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ color: "#34d399" }}>✓ Created: {new Date(selectedMessage.createdAt).toLocaleTimeString()}</div>
                <div style={{ color: selectedMessage.deliveredAt ? "#34d399" : "#6b7280" }}>
                  {selectedMessage.deliveredAt ? `✓ Delivered: ${new Date(selectedMessage.deliveredAt).toLocaleTimeString()}` : "⏳ Pending Delivery"}
                </div>
                <div style={{ color: selectedMessage.acknowledgedAt ? "#34d399" : "#6b7280" }}>
                  {selectedMessage.acknowledgedAt ? `✓ Acknowledged: ${new Date(selectedMessage.acknowledgedAt).toLocaleTimeString()}` : "⏳ Awaiting ACK"}
                </div>
                {selectedMessage.respondedAt && (
                  <div style={{ color: "#60a5fa" }}>✓ Responded: {new Date(selectedMessage.respondedAt).toLocaleTimeString()}</div>
                )}
              </div>
            </div>

            {/* Raw Message Content */}
            <div>
              <span style={{ fontSize: "11px", fontWeight: "700", color: "#6b7280", letterSpacing: "0.05em", display: "block", marginBottom: "6px" }}>
                PAYLOAD CONTENT
              </span>
              <pre style={{ backgroundColor: "#030712", border: "1px solid #1f2937", borderRadius: "6px", padding: "10px", color: "#f3f4f6", fontSize: "12px", whiteSpace: "pre-wrap", maxHeight: "200px", overflowY: "auto", margin: 0 }}>
                {selectedMessage.content}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
