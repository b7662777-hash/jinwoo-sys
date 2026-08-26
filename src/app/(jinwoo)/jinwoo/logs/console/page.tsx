"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ConsoleLogsPage() {
  const [consoleOutput, setConsoleOutput] = useState([
    "[SYSTEM] Jinwoo Sys OS Daemon initialized on port 20128",
    "[ORCHESTRATION] WorkspaceGuard lock table initialized: data/jinwoo_state.sqlite",
    "[WORKFORCE] Role assignments loaded: Architect (Hermes), Developer (OpenCode), QA (Hermes)",
    "[CODING_AGENT] OpenCodeAdapter detected executable at node_modules\\.bin\\opencode.cmd (v1.18.18)",
    "[CODING_AGENT] HermesServerAdapter online on http://127.0.0.1:20129",
    "[OMNIPROXY] Reverse proxy active: routing OpenAI, Anthropic, Ollama models",
    "[READY] All subsystems operational."
  ]);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>📟</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Console Output</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Raw server stdout and stderr console output stream.
          </p>
        </div>

        <Link
          href="/jinwoo/logs"
          style={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#9ca3af", padding: "8px 14px", borderRadius: "8px", fontSize: "13px", textDecoration: "none" }}
        >
          ← Application Logs
        </Link>
      </div>

      <div style={{ backgroundColor: "#030712", border: "1px solid #1f2937", borderRadius: "12px", padding: "16px", minHeight: "350px", fontFamily: "monospace", fontSize: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
        {consoleOutput.map((line, idx) => (
          <div key={idx} style={{ color: line.includes("[READY]") ? "#34d399" : line.includes("[SYSTEM]") ? "#60a5fa" : "#cbd5e1" }}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
