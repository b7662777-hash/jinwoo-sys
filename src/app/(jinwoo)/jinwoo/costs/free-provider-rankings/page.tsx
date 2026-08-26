"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function CostsFreeProviderRankingsPage() {
  const [rankings, setRankings] = useState([
    { rank: 1, provider: "Gemini 2.0 Flash (AI Studio)", speed: "1,200 tok/s", quality: "9.2/10", freeCap: "15 RPM", score: "98/100" },
    { rank: 2, provider: "Groq Llama-3.3-70B", speed: "280 tok/s", quality: "8.9/10", freeCap: "30 RPM", score: "95/100" },
    { rank: 3, provider: "Ollama Qwen2.5-Coder 32B", speed: "45 tok/s (Local)", quality: "9.0/10", freeCap: "Unlimited", score: "92/100" }
  ]);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🏆</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Free Provider Rankings</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Community & benchmark-ranked free AI providers for coding agents, fallback tiers, and background tasks.
          </p>
        </div>

        <Link
          href="/jinwoo/costs"
          style={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#9ca3af", padding: "8px 14px", borderRadius: "8px", fontSize: "13px", textDecoration: "none" }}
        >
          ← Cost Overview
        </Link>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {rankings.map((r) => (
          <div
            key={r.rank}
            style={{
              backgroundColor: "#0D111C",
              border: "1px solid #1f2937",
              borderRadius: "12px",
              padding: "18px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <span style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                backgroundColor: r.rank === 1 ? "#f59e0b" : "#374151",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "13px"
              }}>
                #{r.rank}
              </span>
              <div>
                <strong style={{ color: "#f3f4f6", fontSize: "15px", display: "block" }}>{r.provider}</strong>
                <span style={{ color: "#9ca3af", fontSize: "12px" }}>Speed: {r.speed} • Quality: {r.quality}</span>
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <span style={{ color: "#9ca3af", fontSize: "11px", display: "block" }}>OVERALL SCORE</span>
              <strong style={{ color: "#34d399", fontSize: "16px" }}>{r.score}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
