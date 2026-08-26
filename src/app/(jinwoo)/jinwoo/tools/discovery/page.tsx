"use client";

import React, { useState } from "react";

export default function ToolDiscoveryPage() {
  const [tools, setTools] = useState([
    { name: "FileSystem Toolset", tools: ["fs.read", "fs.write", "fs.list", "fs.mkdir", "fs.delete"], status: "ACTIVE" },
    { name: "Terminal Execution Toolset", tools: ["exec.command", "exec.spawn", "exec.kill"], status: "ACTIVE" },
    { name: "Git Version Control Toolset", tools: ["git.status", "git.diff", "git.commit", "git.branch"], status: "ACTIVE" },
    { name: "Web & Search Toolset", tools: ["web.fetch", "web.search_searxng", "web.extract_markdown"], status: "ACTIVE" }
  ]);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🔭</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Tool Discovery</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Catalog of all discovered and registered tool primitives accessible to autonomous worker agents.
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
            <strong style={{ color: "#f3f4f6", fontSize: "16px" }}>{t.name}</strong>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {t.tools.map((fn, i) => (
                <span key={i} style={{ backgroundColor: "#111827", border: "1px solid #374151", color: "#60a5fa", padding: "3px 8px", borderRadius: "4px", fontSize: "11px", fontFamily: "monospace" }}>
                  {fn}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
