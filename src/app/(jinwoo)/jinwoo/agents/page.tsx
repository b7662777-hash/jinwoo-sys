"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function AgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
    const interval = setInterval(fetchAgents, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchAgents = async () => {
    try {
      const res = await fetch("/api/jinwoo/agents");
      const data = await res.json();
      if (data.agents) setAgents(data.agents);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStopAgent = async (agent: any) => {
    if (agent.sessionId) {
      try {
        await fetch("/api/jinwoo/coding-agents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "stop_interactive", sessionId: agent.sessionId })
        });
        fetchAgents();
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div style={{ padding: "32px", color: "#f3f4f6", display: "flex", flexDirection: "column", height: "100%", overflowY: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "600", marginBottom: "8px" }}>Active Workforce Agents</h1>
          <p style={{ color: "#9ca3af", fontSize: "14px" }}>Monitor autonomous workforce agents, assigned roles, and runtime process bindings.</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link
            href="/jinwoo/coding-agents"
            style={{ backgroundColor: "#2563eb", color: "white", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", textDecoration: "none" }}
          >
            🚀 Launch Worker
          </Link>
          <button 
            onClick={fetchAgents}
            style={{ background: "#1f2937", border: "1px solid #374151", color: "#fff", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "13px" }}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {loading && agents.length === 0 ? (
        <div style={{ color: "#9ca3af" }}>Loading active agents...</div>
      ) : agents.length === 0 ? (
        <div style={{ padding: "64px", background: "#0D111C", borderRadius: "12px", border: "1px dashed #374151", textAlign: "center", color: "#9ca3af" }}>
          No agents currently active. Launch an OpenCode or Hermes session from the Coding Agents panel.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {agents.map((a, i) => (
            <div key={i} style={{ background: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "48px", height: "48px", background: "#111827", border: "1px solid #374151", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>
                  {a.role === "ARCHITECT" ? "🏛️" : a.role === "DEVELOPER" ? "💻" : a.role === "QA" ? "🧪" : "🤖"}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#f9fafb", margin: 0, textTransform: "uppercase" }}>{a.role}</h3>
                    <span style={{ backgroundColor: "#1f2937", color: "#60a5fa", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "600" }}>
                      {a.runtime || "OpenCode"}
                    </span>
                    {a.pid && (
                      <span style={{ backgroundColor: "rgba(245, 158, 11, 0.15)", color: "#fbbf24", padding: "2px 6px", borderRadius: "4px", fontSize: "10px", fontFamily: "monospace" }}>
                        PID: {a.pid}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "6px", display: "flex", gap: "14px", flexWrap: "wrap" }}>
                    <div><span style={{ color: "#6b7280" }}>Agent ID:</span> <code style={{ color: "#cbd5e1" }}>{a.id}</code></div>
                    <div><span style={{ color: "#6b7280" }}>Model:</span> <span style={{ color: "#34d399" }}>{a.model}</span></div>
                    <div><span style={{ color: "#6b7280" }}>Provider:</span> <span style={{ color: "#a78bfa" }}>{a.provider}</span></div>
                    {a.workspacePath && (
                      <div><span style={{ color: "#6b7280" }}>Workspace:</span> <span style={{ color: "#9ca3af", fontFamily: "monospace" }}>{a.workspacePath}</span></div>
                    )}
                  </div>
                </div>
              </div>
              
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                  <span style={{ 
                    background: a.status === "working" || a.status === "running" ? "rgba(16, 185, 129, 0.15)" : "rgba(107, 114, 128, 0.15)", 
                    color: a.status === "working" || a.status === "running" ? "#34d399" : "#9ca3af", 
                    padding: "4px 10px", 
                    borderRadius: "6px", 
                    fontSize: "11px", 
                    fontWeight: "700",
                    textTransform: "uppercase"
                  }}>
                    ● {a.status}
                  </span>
                  <span style={{ fontSize: "11px", color: "#6b7280" }}>{new Date(a.createdAt).toLocaleTimeString()}</span>
                </div>

                <Link
                  href="/jinwoo/communication"
                  style={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#60a5fa", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", textDecoration: "none", fontWeight: "600" }}
                >
                  💬 View Bus
                </Link>

                {a.sessionId && (
                  <button
                    onClick={() => handleStopAgent(a)}
                    style={{ backgroundColor: "rgba(239, 68, 68, 0.2)", border: "1px solid rgba(239, 68, 68, 0.4)", color: "#f87171", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
                  >
                    ⏹ Stop
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
