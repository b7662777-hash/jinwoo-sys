"use client";

import React, { useState } from "react";

export default function CliCodePage() {
  const [tools, setTools] = useState([
    { name: "OpenCode CLI", command: "opencode run", status: "INSTALLED", version: "v1.18.18", path: "node_modules\\.bin\\opencode.cmd" },
    { name: "Claude Code CLI", command: "claude", status: "AVAILABLE", version: "Latest", path: "npm i -g @anthropic-ai/claude-code" },
    { name: "Codex CLI", command: "codex exec", status: "INSTALLED", version: "v0.9.4", path: "Internal Bridge" },
    { name: "Aider CLI", command: "aider", status: "DETECTED", version: "v0.72.0", path: "Python Environment" }
  ]);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>💻</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>CLI Coding Tools</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Local CLI coding agents integrated with OmniRoute OpenAI and Anthropic reverse proxy.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "20px" }}>
        {tools.map((t, idx) => (
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
              <div>
                <strong style={{ color: "#f3f4f6", fontSize: "16px", display: "block" }}>{t.name}</strong>
                <span style={{ color: "#6b7280", fontSize: "11px" }}>{t.version}</span>
              </div>
              <span style={{
                backgroundColor: t.status === "INSTALLED" ? "rgba(16, 185, 129, 0.15)" : "rgba(59, 130, 246, 0.15)",
                color: t.status === "INSTALLED" ? "#34d399" : "#60a5fa",
                border: `1px solid ${t.status === "INSTALLED" ? "rgba(16, 185, 129, 0.3)" : "rgba(59, 130, 246, 0.3)"}`,
                padding: "2px 8px",
                borderRadius: "10px",
                fontSize: "11px",
                fontWeight: "600"
              }}>
                ● {t.status}
              </span>
            </div>

            <div style={{ backgroundColor: "#111827", padding: "10px", borderRadius: "8px", fontSize: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
              <div><span style={{ color: "#9ca3af" }}>Command:</span> <code style={{ color: "#a78bfa" }}>{t.command}</code></div>
              <div><span style={{ color: "#9ca3af" }}>Location:</span> <span style={{ color: "#6b7280", fontSize: "11px", fontFamily: "monospace" }}>{t.path}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
