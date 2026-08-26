"use client";

import React, { useState } from "react";

export default function CompressionCombosPage() {
  const [combos, setCombos] = useState([
    { id: "c1", name: "High-Reasoning Coding Stack", chain: ["RTK Deduplication", "Headroom 8k", "Caveman Light"], target: "Coding Agents (OpenCode, Hermes)" },
    { id: "c2", name: "Heavy Context Reader", chain: ["Session Dedup", "LLMLingua 40%", "OmniGlyph"], target: "Research & Documentation Squad" },
    { id: "c3", name: "Maximum Cost Saver", chain: ["Caveman Hardcore", "CCR 0.4", "OmniGlyph"], target: "Background QA Tasks" }
  ]);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🔀</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Compression Combos</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Chained multi-stage compression pipelines applied sequentially before upstream LLM dispatch.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "20px" }}>
        {combos.map((c) => (
          <div
            key={c.id}
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
            <strong style={{ color: "#f3f4f6", fontSize: "16px" }}>{c.name}</strong>

            <div style={{ backgroundColor: "#111827", padding: "10px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontSize: "11px", color: "#6b7280", fontWeight: "600" }}>PIPELINE CHAIN:</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {c.chain.map((step, idx) => (
                  <span key={idx} style={{ backgroundColor: "rgba(59, 130, 246, 0.15)", color: "#60a5fa", border: "1px solid rgba(59, 130, 246, 0.3)", padding: "2px 8px", borderRadius: "4px", fontSize: "11px" }}>
                    {idx + 1}. {step}
                  </span>
                ))}
              </div>
            </div>

            <span style={{ color: "#9ca3af", fontSize: "12px" }}>
              Applied To: <strong style={{ color: "#f3f4f6" }}>{c.target}</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
