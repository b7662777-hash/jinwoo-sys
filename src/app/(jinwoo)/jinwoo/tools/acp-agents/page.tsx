"use client";

import React, { useState } from "react";

export default function AcpAgentsPage() {
  const [agents, setAgents] = useState([
    { name: "Agent Communication Protocol (ACP)", version: "v1.2", protocol: "JSON-RPC 2.0", transport: "WebSocket / StdIO", status: "ENABLED" },
    { name: "Model Context Protocol (MCP) Bridge", version: "v2024.11", protocol: "MCP Schema", transport: "StdIO Pipe", status: "ONLINE" }
  ]);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🔌</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>ACP & MCP Agent Protocols</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Standardized inter-agent protocol interfaces for tool sharing and structured multi-agent negotiation.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "20px" }}>
        {agents.map((a, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: "#0D111C",
              border: "1px solid #1f2937",
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong style={{ color: "#f3f4f6", fontSize: "16px" }}>{a.name}</strong>
              <span style={{
                backgroundColor: "rgba(16, 185, 129, 0.15)",
                color: "#34d399",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                padding: "2px 8px",
                borderRadius: "10px",
                fontSize: "11px",
                fontWeight: "600"
              }}>
                ● {a.status}
              </span>
            </div>

            <div style={{ backgroundColor: "#111827", padding: "10px", borderRadius: "8px", fontSize: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
              <div><span style={{ color: "#9ca3af" }}>Protocol:</span> <span style={{ color: "#a78bfa" }}>{a.protocol}</span></div>
              <div><span style={{ color: "#9ca3af" }}>Transport:</span> <span style={{ color: "#60a5fa" }}>{a.transport}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
