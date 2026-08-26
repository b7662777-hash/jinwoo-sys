"use client";

import React, { useState } from "react";

export default function AgentBridgePage() {
  const [bridges, setBridges] = useState([
    { name: "Hermes Tool Protocol", target: "Python hermes_server.py:20129", status: "ONLINE", protocol: "HTTP / SSE" },
    { name: "OpenCode StdIO Bridge", target: "node_modules\\.bin\\opencode.cmd", status: "READY", protocol: "Process StdIO" },
    { name: "OmniRoute Gateway Bridge", target: "http://127.0.0.1:20128/v1", status: "ONLINE", protocol: "OpenAI Compatible" }
  ]);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🌉</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Agent Bridge</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Inter-process communication and transport bridges linking external worker agents to Jinwoo Sys.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "20px" }}>
        {bridges.map((b, idx) => (
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
              <strong style={{ color: "#f3f4f6", fontSize: "16px" }}>{b.name}</strong>
              <span style={{
                backgroundColor: "rgba(16, 185, 129, 0.15)",
                color: "#34d399",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                padding: "2px 8px",
                borderRadius: "10px",
                fontSize: "11px",
                fontWeight: "600"
              }}>
                ● {b.status}
              </span>
            </div>

            <div style={{ backgroundColor: "#111827", padding: "10px", borderRadius: "8px", fontSize: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
              <div><span style={{ color: "#9ca3af" }}>Target:</span> <span style={{ color: "#60a5fa", fontFamily: "monospace" }}>{b.target}</span></div>
              <div><span style={{ color: "#9ca3af" }}>Protocol:</span> <span style={{ color: "#a78bfa" }}>{b.protocol}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
