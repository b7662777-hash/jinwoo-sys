"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function A2aAuditPage() {
  const [logs, setLogs] = useState([
    { timestamp: new Date().toISOString(), from: "Architect (Hermes)", to: "Developer (OpenCode)", action: "ORCHESTRATOR_HANDOFF", payload: "Architecture plan & file edits spec" },
    { timestamp: new Date(Date.now() - 60000).toISOString(), from: "Developer (OpenCode)", to: "QA (Hermes)", action: "TASK_COMPLETED", payload: "File modifications written to disk" }
  ]);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🤖</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>AI-to-AI (A2A) Audit Log</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Audit log of autonomous inter-agent messages, state handoffs, and verification approvals.
          </p>
        </div>

        <Link
          href="/jinwoo/audit"
          style={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#9ca3af", padding: "8px 14px", borderRadius: "8px", fontSize: "13px", textDecoration: "none" }}
        >
          ← General Audit
        </Link>
      </div>

      <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "12px" }}>
          <thead>
            <tr style={{ backgroundColor: "#111827", borderBottom: "1px solid #1f2937", color: "#9ca3af" }}>
              <th style={{ padding: "10px 14px" }}>TIME</th>
              <th style={{ padding: "10px 14px" }}>SOURCE AGENT</th>
              <th style={{ padding: "10px 14px" }}>TARGET AGENT</th>
              <th style={{ padding: "10px 14px" }}>ACTION</th>
              <th style={{ padding: "10px 14px" }}>PAYLOAD</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #1f2937", color: "#f3f4f6" }}>
                <td style={{ padding: "10px 14px", color: "#9ca3af", fontFamily: "monospace" }}>{new Date(l.timestamp).toLocaleTimeString()}</td>
                <td style={{ padding: "10px 14px", color: "#60a5fa", fontWeight: "500" }}>{l.from}</td>
                <td style={{ padding: "10px 14px", color: "#a78bfa", fontWeight: "500" }}>{l.to}</td>
                <td style={{ padding: "10px 14px" }}><span style={{ backgroundColor: "#1f2937", padding: "2px 6px", borderRadius: "4px", fontSize: "11px", color: "#34d399", fontWeight: "bold" }}>{l.action}</span></td>
                <td style={{ padding: "10px 14px", color: "#cbd5e1" }}>{l.payload}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
