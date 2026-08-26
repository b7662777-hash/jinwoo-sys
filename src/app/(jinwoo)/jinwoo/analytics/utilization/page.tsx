"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function AnalyticsUtilizationPage() {
  const [providers, setProviders] = useState([
    { name: "Antigravity Gateway", percentage: 68, tokens: "57,473 tokens", requests: 31 },
    { name: "OpenRouter", percentage: 22, tokens: "18,594 tokens", requests: 8 },
    { name: "Ollama Local Engine", percentage: 10, tokens: "8,453 tokens", requests: 3 }
  ]);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>📉</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Provider Utilization</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Token volume breakdown and request load distribution across connected providers.
          </p>
        </div>

        <Link
          href="/jinwoo/analytics"
          style={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#9ca3af", padding: "8px 14px", borderRadius: "8px", fontSize: "13px", textDecoration: "none" }}
        >
          ← Analytics Overview
        </Link>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {providers.map((p, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: "#0D111C",
              border: "1px solid #1f2937",
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "10px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong style={{ color: "#f3f4f6", fontSize: "15px" }}>{p.name}</strong>
              <span style={{ color: "#60a5fa", fontWeight: "600", fontSize: "14px" }}>{p.percentage}%</span>
            </div>

            {/* Progress bar */}
            <div style={{ height: "8px", backgroundColor: "#111827", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ width: `${p.percentage}%`, height: "100%", backgroundColor: "#3b82f6", borderRadius: "4px" }} />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#9ca3af" }}>
              <span>Volume: {p.tokens}</span>
              <span>{p.requests} Requests</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
