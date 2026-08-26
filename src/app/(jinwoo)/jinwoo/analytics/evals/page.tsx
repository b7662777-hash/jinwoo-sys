"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function AnalyticsEvalsPage() {
  const [benchmarks, setBenchmarks] = useState([
    { model: "claude-opus-4-6-thinking", codingScore: "94.8%", reasoningScore: "96.2%", toolAccuracy: "99.1%" },
    { model: "claude-sonnet-4-6", codingScore: "91.2%", reasoningScore: "92.0%", toolAccuracy: "98.4%" },
    { model: "gemini-3.7-flash-high", codingScore: "88.6%", reasoningScore: "89.4%", toolAccuracy: "96.5%" }
  ]);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🧪</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Model Evals & Benchmarks</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Live performance evaluation benchmarks on code generation, reasoning depth, and tool calling reliability.
          </p>
        </div>

        <Link
          href="/jinwoo/analytics"
          style={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#9ca3af", padding: "8px 14px", borderRadius: "8px", fontSize: "13px", textDecoration: "none" }}
        >
          ← Analytics Overview
        </Link>
      </div>

      <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
          <thead>
            <tr style={{ backgroundColor: "#111827", borderBottom: "1px solid #1f2937", color: "#9ca3af" }}>
              <th style={{ padding: "12px 16px" }}>MODEL</th>
              <th style={{ padding: "12px 16px" }}>CODING ACCURACY</th>
              <th style={{ padding: "12px 16px" }}>REASONING DEPTH</th>
              <th style={{ padding: "12px 16px" }}>TOOL CALLING</th>
            </tr>
          </thead>
          <tbody>
            {benchmarks.map((b, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #1f2937", color: "#f3f4f6" }}>
                <td style={{ padding: "14px 16px", fontWeight: "600", fontFamily: "monospace" }}>{b.model}</td>
                <td style={{ padding: "14px 16px", color: "#34d399" }}>{b.codingScore}</td>
                <td style={{ padding: "14px 16px", color: "#60a5fa" }}>{b.reasoningScore}</td>
                <td style={{ padding: "14px 16px", color: "#a78bfa" }}>{b.toolAccuracy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
