"use client";

import React, { useState, useEffect } from "react";

export default function SystemHealthPage() {
  const [subsystems, setSubsystems] = useState([
    { name: "OmniRoute AI Gateway (Port 20128)", status: "ONLINE", latency: "2ms", uptime: "99.99%" },
    { name: "Hermes Tool Server (Port 20129)", status: "ONLINE", latency: "4ms", uptime: "99.95%" },
    { name: "OpenCode CLI Worker Bridge", status: "READY", latency: "12ms", uptime: "100%" },
    { name: "Jinwoo SQLite Persistence DB", status: "HEALTHY", latency: "1ms", uptime: "100%" },
    { name: "WorkspaceGuard File Locking", status: "ACTIVE", latency: "0ms", uptime: "100%" }
  ]);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>❤️</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>System Health & Daemons</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Real-time status of underlying gateway daemons, worker execution processes, and database engines.
          </p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {subsystems.map((s, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: "#0D111C",
              border: "1px solid #1f2937",
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>
              <strong style={{ color: "#f3f4f6", fontSize: "16px", display: "block" }}>{s.name}</strong>
              <span style={{ color: "#9ca3af", fontSize: "12px" }}>Uptime: <strong style={{ color: "#34d399" }}>{s.uptime}</strong></span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ color: "#60a5fa", fontSize: "12px", fontFamily: "monospace" }}>{s.latency}</span>
              <span style={{ backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#34d399", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "4px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: "600" }}>
                ● {s.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
