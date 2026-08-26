"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function CavemanCompressionPage() {
  const [enabled, setEnabled] = useState(true);
  const [aggressiveness, setAggressiveness] = useState("medium");
  const [saved, setSaved] = useState(false);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🪨</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Caveman Compression Engine</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            High-efficiency linguistic compression stripping stop-words while retaining strict architectural and algorithmic context.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <Link
            href="/jinwoo/omniproxy/compression/studio"
            style={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#a78bfa", padding: "8px 14px", borderRadius: "8px", fontSize: "13px", textDecoration: "none" }}
          >
            🎨 Open in Studio
          </Link>
          <button
            onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
            style={{ backgroundColor: saved ? "#10b981" : "#2563eb", color: "white", border: "none", padding: "8px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
          >
            {saved ? "✓ Saved" : "Save Engine"}
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <strong style={{ color: "#f3f4f6", fontSize: "15px", display: "block" }}>Enable Caveman Engine</strong>
            <span style={{ color: "#9ca3af", fontSize: "12px" }}>Active on prompt payloads and multi-turn developer chat history.</span>
          </div>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            style={{ width: "18px", height: "18px", accentColor: "#3b82f6", cursor: "pointer" }}
          />
        </div>

        <div style={{ borderTop: "1px solid #1f2937", paddingTop: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontSize: "13px", color: "#f3f4f6", fontWeight: "600" }}>Compression Level</label>
          <select
            value={aggressiveness}
            onChange={(e) => setAggressiveness(e.target.value)}
            style={{ backgroundColor: "#111827", border: "1px solid #374151", color: "#f3f4f6", padding: "8px 12px", borderRadius: "6px", fontSize: "13px", outline: "none", maxWidth: "260px" }}
          >
            <option value="light">Light (30% Reduction)</option>
            <option value="medium">Medium (50% Reduction)</option>
            <option value="hardcore">Hardcore (65% Reduction)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
