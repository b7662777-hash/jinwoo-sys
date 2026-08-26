"use client";

import React, { useState } from "react";

export default function CloudAgentsPage() {
  const [agents, setAgents] = useState([
    { name: "Devin / Cognition Integration", type: "Remote Autonomous Cloud Agent", status: "CONFIGURED" },
    { name: "Cursor Background Agent", type: "Remote Cloud Copilot", status: "AVAILABLE" },
    { name: "Replit Agent Cloud Worker", type: "Hosted Runtime", status: "READY" }
  ]);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>☁️</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Cloud Agent Integrations</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Connect remote cloud-hosted autonomous agent providers into Jinwoo orchestration workflows.
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
            <strong style={{ color: "#f3f4f6", fontSize: "16px" }}>{a.name}</strong>
            <span style={{ color: "#9ca3af", fontSize: "12px" }}>{a.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
