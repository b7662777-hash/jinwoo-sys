"use client";

import React, { useState } from "react";

export default function CompressionSettingsPage() {
  const [enabled, setEnabled] = useState(true);
  const [globalRatio, setGlobalRatio] = useState("auto");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>⚙️</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Compression Settings</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Global context compression policies, token headroom safety thresholds, and optimization modes.
          </p>
        </div>

        <button
          onClick={handleSave}
          style={{
            backgroundColor: saved ? "#10b981" : "#2563eb",
            color: "white",
            border: "none",
            padding: "8px 18px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          {saved ? "✓ Settings Saved" : "Save Global Settings"}
        </button>
      </div>

      <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <strong style={{ color: "#f3f4f6", fontSize: "15px", display: "block" }}>Enable Gateway Context Compression</strong>
            <span style={{ color: "#9ca3af", fontSize: "12px" }}>Automatically optimize prompt payloads before transmitting to upstream providers.</span>
          </div>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            style={{ width: "18px", height: "18px", accentColor: "#3b82f6", cursor: "pointer" }}
          />
        </div>

        <div style={{ borderTop: "1px solid #1f2937", paddingTop: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontSize: "13px", color: "#f3f4f6", fontWeight: "600" }}>Default Compression Profile</label>
          <select
            value={globalRatio}
            onChange={(e) => setGlobalRatio(e.target.value)}
            style={{ backgroundColor: "#111827", border: "1px solid #374151", color: "#f3f4f6", padding: "8px 12px", borderRadius: "6px", fontSize: "13px", outline: "none", maxWidth: "300px" }}
          >
            <option value="auto">Adaptive Auto (Smart Headroom)</option>
            <option value="lite">Lite (Lossless 15-25% Reduction)</option>
            <option value="aggressive">Aggressive (40-60% Semantic Condensation)</option>
            <option value="ultra">Ultra (75%+ High Entropy Reduction)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
