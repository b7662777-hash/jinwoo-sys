"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function AnalyticsCompressionPage() {
  const [engines, setEngines] = useState([
    { name: "Caveman Engine", savedTokens: "14,280 tokens", avgReduction: "51.4%" },
    { name: "RTK Deduplication", savedTokens: "8,920 tokens", avgReduction: "38.2%" },
    { name: "OmniGlyph Symbol Mapping", savedTokens: "4,110 tokens", avgReduction: "18.6%" }
  ]);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🗜️</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Compression Analytics</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Cumulative token volume reduction across active compression engines.
          </p>
        </div>

        <Link
          href="/jinwoo/analytics"
          style={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#9ca3af", padding: "8px 14px", borderRadius: "8px", fontSize: "13px", textDecoration: "none" }}
        >
          ← Analytics Overview
        </Link>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {engines.map((e, idx) => (
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
              <strong style={{ color: "#f3f4f6", fontSize: "16px", display: "block" }}>{e.name}</strong>
              <span style={{ color: "#9ca3af", fontSize: "12px" }}>Saved Volume: <strong style={{ color: "#34d399" }}>{e.savedTokens}</strong></span>
            </div>

            <div style={{ textAlign: "right" }}>
              <span style={{ color: "#9ca3af", fontSize: "11px", display: "block" }}>AVG REDUCTION</span>
              <strong style={{ color: "#60a5fa", fontSize: "16px" }}>{e.avgReduction}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
