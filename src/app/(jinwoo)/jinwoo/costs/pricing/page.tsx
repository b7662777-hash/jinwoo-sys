"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function CostsPricingPage() {
  const [prices, setPrices] = useState([
    { model: "claude-opus-4-6-thinking", provider: "Antigravity", inputPrice: "$15.00 / 1M", outputPrice: "$75.00 / 1M", tier: "Flagship" },
    { model: "claude-sonnet-4-6", provider: "Antigravity", inputPrice: "$3.00 / 1M", outputPrice: "$15.00 / 1M", tier: "Production" },
    { model: "gemini-3.7-flash-high", provider: "Antigravity", inputPrice: "$0.10 / 1M", outputPrice: "$0.40 / 1M", tier: "High-Speed" },
    { model: "qwen2.5-coder:32b", provider: "Ollama Local", inputPrice: "$0.00 (Free)", outputPrice: "$0.00 (Free)", tier: "Local Engine" }
  ]);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🏷️</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Model Pricing Catalog</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Real-time input and output token pricing across all connected upstream providers.
          </p>
        </div>

        <Link
          href="/jinwoo/costs"
          style={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#9ca3af", padding: "8px 14px", borderRadius: "8px", fontSize: "13px", textDecoration: "none" }}
        >
          ← Cost Overview
        </Link>
      </div>

      <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
          <thead>
            <tr style={{ backgroundColor: "#111827", borderBottom: "1px solid #1f2937", color: "#9ca3af" }}>
              <th style={{ padding: "12px 16px" }}>MODEL</th>
              <th style={{ padding: "12px 16px" }}>PROVIDER</th>
              <th style={{ padding: "12px 16px" }}>INPUT PRICE</th>
              <th style={{ padding: "12px 16px" }}>OUTPUT PRICE</th>
              <th style={{ padding: "12px 16px" }}>TIER</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((p, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #1f2937", color: "#f3f4f6" }}>
                <td style={{ padding: "14px 16px", fontWeight: "600", fontFamily: "monospace" }}>{p.model}</td>
                <td style={{ padding: "14px 16px", color: "#a78bfa" }}>{p.provider}</td>
                <td style={{ padding: "14px 16px", color: "#60a5fa" }}>{p.inputPrice}</td>
                <td style={{ padding: "14px 16px", color: "#34d399" }}>{p.outputPrice}</td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{ backgroundColor: "#1f2937", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", color: "#e5e7eb" }}>
                    {p.tier}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
