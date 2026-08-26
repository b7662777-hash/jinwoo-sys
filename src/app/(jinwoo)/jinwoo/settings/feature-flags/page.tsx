"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function FeatureFlagsSettingsPage() {
  const [flags, setFlags] = useState([
    { id: "stream_diff", name: "Streaming File Diffs in UI", enabled: true, desc: "Renders live green/red git diff changes as coding agents write files." },
    { id: "auto_open_tui", name: "Auto-Spawn OpenCode TUI", enabled: true, desc: "Automatically opens dedicated interactive console when developer task starts." },
    { id: "quantum_lock", name: "Multi-Agent WorkspaceGuard", enabled: true, desc: "Atomic file lock coordination preventing conflicting parallel edits." }
  ]);

  const toggleFlag = (id: string) => {
    setFlags(flags.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🚩</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Feature Flags</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Toggle experimental orchestration features, streaming diff modes, and runtime hooks.
          </p>
        </div>

        <Link
          href="/jinwoo/settings"
          style={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#9ca3af", padding: "8px 14px", borderRadius: "8px", fontSize: "13px", textDecoration: "none" }}
        >
          ← All Settings
        </Link>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {flags.map((f) => (
          <div
            key={f.id}
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
              <strong style={{ color: "#f3f4f6", fontSize: "15px", display: "block" }}>{f.name}</strong>
              <span style={{ color: "#9ca3af", fontSize: "12px" }}>{f.desc}</span>
            </div>

            <input
              type="checkbox"
              checked={f.enabled}
              onChange={() => toggleFlag(f.id)}
              style={{ width: "18px", height: "18px", accentColor: "#3b82f6", cursor: "pointer" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
