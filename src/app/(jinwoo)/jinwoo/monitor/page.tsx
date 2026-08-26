"use client";

import React, { useState, useEffect } from "react";

export default function MonitorPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
    const interval = setInterval(fetchAgents, 2000); // Fast poll for live monitor
    return () => clearInterval(interval);
  }, []);

  const fetchAgents = async () => {
    try {
      const res = await fetch("/api/jinwoo/agents");
      const data = await res.json();
      if (data.agents) setAgents(data.agents.filter((a: any) => a.status !== 'completed'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "32px", color: "#f3f4f6", display: "flex", flexDirection: "column", height: "100%", overflowY: "auto" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "600", marginBottom: "8px", display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ef4444", boxShadow: "0 0 10px #ef4444", animation: "pulse 2s infinite" }}></span>
          Live Execution Monitor
        </h1>
        <p style={{ color: "#9ca3af", fontSize: "14px" }}>Real-time telemetry for active workflow operations.</p>
      </div>

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {loading && agents.length === 0 ? (
        <div style={{ color: "#9ca3af" }}>Connecting to telemetry stream...</div>
      ) : agents.length === 0 ? (
        <div style={{ padding: "64px", background: "#111827", borderRadius: "12px", border: "1px dashed #374151", textAlign: "center", color: "#9ca3af" }}>
          <div style={{ fontSize: "32px", marginBottom: "16px" }}>💤</div>
          No active workflows. System is idle.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "24px" }}>
          {agents.map((a, i) => (
            <div key={i} style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px", borderTop: "4px solid #3b82f6" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#f9fafb", margin: 0, textTransform: "uppercase" }}>{a.role}</h3>
                <span style={{ 
                  background: "rgba(16, 185, 129, 0.1)", 
                  color: "#10b981", 
                  padding: "4px 8px", 
                  borderRadius: "6px", 
                  fontSize: "12px", 
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }}></span>
                  {a.status.toUpperCase()}
                </span>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#9ca3af" }}>Provider</span>
                  <span style={{ color: "#e5e7eb", fontWeight: "500" }}>{a.provider}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#9ca3af" }}>Model</span>
                  <span style={{ color: "#e5e7eb", fontWeight: "500" }}>{a.model}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#9ca3af" }}>Workflow ID</span>
                  <span style={{ color: "#e5e7eb", fontFamily: "monospace" }}>{a.workflowId.substring(0, 8)}...</span>
                </div>
              </div>
              
              <div style={{ background: "#030712", padding: "12px", borderRadius: "8px", fontSize: "12px", fontFamily: "monospace", color: "#60a5fa" }}>
                Waiting for events...
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
