"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function AiSettingsPage() {
  const [defaultTemp, setDefaultTemp] = useState("0.2");
  const [defaultTopP, setDefaultTopP] = useState("0.95");
  const [saved, setSaved] = useState(false);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🧠</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>AI Inference Defaults</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Default temperature, top_p, and sampling hyperparameters for coding agents.
          </p>
        </div>

        <Link
          href="/jinwoo/settings"
          style={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#9ca3af", padding: "8px 14px", borderRadius: "8px", fontSize: "13px", textDecoration: "none" }}
        >
          ← All Settings
        </Link>
      </div>

      <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "13px", color: "#f3f4f6", fontWeight: "600" }}>Default Temperature (Coding Accuracy)</label>
          <input
            type="number"
            step="0.05"
            min="0"
            max="1"
            value={defaultTemp}
            onChange={(e) => setDefaultTemp(e.target.value)}
            style={{ width: "100%", maxWidth: "160px", backgroundColor: "#111827", border: "1px solid #374151", color: "#f3f4f6", padding: "8px 12px", borderRadius: "6px", fontSize: "13px", outline: "none" }}
          />
        </div>
      </div>
    </div>
  );
}
