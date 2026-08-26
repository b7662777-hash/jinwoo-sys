"use client";

import React, { useState } from "react";

export default function QuotaSharingPage() {
  const [pools, setPools] = useState([
    { id: "tier1_squad", name: "High-Priority Coding Squad", providers: ["Antigravity", "OpenRouter"], maxTpm: "200,000 TPM", maxRpm: "1,500 RPM", sharedBetween: "Architect, Developer, Security" },
    { id: "tier2_background", name: "Background & Research Pool", providers: ["Ollama Local", "Gemini Flash"], maxTpm: "Unlimited", maxRpm: "3,000 RPM", sharedBetween: "QA, Researcher, Tech Writer" }
  ]);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🤝</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Quota Sharing Pools</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Distribute and balance rate limits across autonomous agents to prevent individual worker throttling.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: "20px" }}>
        {pools.map((p) => (
          <div
            key={p.id}
            style={{
              backgroundColor: "#0D111C",
              border: "1px solid #1f2937",
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "14px"
            }}
          >
            <strong style={{ color: "#f3f4f6", fontSize: "16px" }}>{p.name}</strong>

            <div style={{ backgroundColor: "#111827", padding: "12px", borderRadius: "8px", fontSize: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#9ca3af" }}>Upstream Providers:</span>
                <span style={{ color: "#60a5fa" }}>{p.providers.join(", ")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#9ca3af" }}>Max Bandwidth:</span>
                <span style={{ color: "#34d399", fontWeight: "500" }}>{p.maxTpm}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#9ca3af" }}>Shared Across:</span>
                <span style={{ color: "#a78bfa" }}>{p.sharedBetween}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
