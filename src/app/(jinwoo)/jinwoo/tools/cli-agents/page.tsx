"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function CliAgentsPage() {
  const [agents, setAgents] = useState([
    { id: "opencode", name: "OpenCode Terminal Agent", type: "CLI Worker", link: "/jinwoo/coding-agents/opencode", status: "READY" },
    { id: "hermes", name: "Hermes Autonomous Tool Server", type: "Server/CLI", link: "/jinwoo/coding-agents/hermes", status: "ONLINE" },
    { id: "codex", name: "Codex CLI Code Refactorer", type: "CLI Bridge", link: "/jinwoo/coding-agents/codex", status: "READY" }
  ]);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🤖</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>CLI Agents</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Installed command-line agent runtimes available for autonomous and interactive execution.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "20px" }}>
        {agents.map((a) => (
          <div
            key={a.id}
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

            <span style={{ color: "#9ca3af", fontSize: "12px" }}>Runtime Type: <strong style={{ color: "#a78bfa" }}>{a.type}</strong></span>

            <div style={{ marginTop: "auto", paddingTop: "8px" }}>
              <Link
                href={a.link}
                style={{
                  display: "block",
                  textAlign: "center",
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  color: "#60a5fa",
                  padding: "8px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "600",
                  textDecoration: "none"
                }}
              >
                Manage Agent Runtime →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
