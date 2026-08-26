"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function McpAuditPage() {
  const [logs, setLogs] = useState([
    { timestamp: new Date().toISOString(), server: "filesystem-mcp", tool: "read_file", status: "ALLOWED", agent: "Architect" },
    { timestamp: new Date(Date.now() - 40000).toISOString(), server: "git-mcp", tool: "git_diff", status: "ALLOWED", agent: "QA" }
  ]);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🛡️</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>MCP Server Audit Log</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Security audit logs tracking all Model Context Protocol (MCP) server tool calls and filesystem reads.
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
              <th style={{ padding: "10px 14px" }}>MCP SERVER</th>
              <th style={{ padding: "10px 14px" }}>TOOL ACTION</th>
              <th style={{ padding: "10px 14px" }}>CALLING AGENT</th>
              <th style={{ padding: "10px 14px" }}>DECISION</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #1f2937", color: "#f3f4f6" }}>
                <td style={{ padding: "10px 14px", color: "#9ca3af", fontFamily: "monospace" }}>{new Date(l.timestamp).toLocaleTimeString()}</td>
                <td style={{ padding: "10px 14px", color: "#60a5fa" }}>{l.server}</td>
                <td style={{ padding: "10px 14px", fontFamily: "monospace", color: "#a78bfa" }}>{l.tool}</td>
                <td style={{ padding: "10px 14px" }}>{l.agent}</td>
                <td style={{ padding: "10px 14px" }}>
                  <span style={{ backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#34d399", padding: "2px 6px", borderRadius: "4px", fontWeight: "bold" }}>
                    {l.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
