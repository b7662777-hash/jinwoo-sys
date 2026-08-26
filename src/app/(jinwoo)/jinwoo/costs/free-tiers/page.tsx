"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function CostsFreeTiersPage() {
  const [tiers, setTiers] = useState([
    { provider: "Gemini AI Studio (Google)", quota: "15 RPM / 1M TPM", cost: "$0.00", notes: "Generous free tier for 2.0 Flash / Pro models", status: "AVAILABLE" },
    { provider: "Groq Cloud", quota: "30 RPM / 14,400 RPD", cost: "$0.00", notes: "Ultra-fast free inference on Llama-3.3-70B", status: "AVAILABLE" },
    { provider: "Ollama (Self-Hosted)", quota: "Unlimited", cost: "$0.00", notes: "Zero-cost local hardware execution", status: "ONLINE" },
    { provider: "OpenRouter Free Models", quota: "20 RPM", cost: "$0.00", notes: "Free endpoints for open-weight models", status: "AVAILABLE" }
  ]);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🎁</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Free Tier Providers</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Zero-cost provider quotas, free rate limits, and zero-dollar model allocations.
          </p>
        </div>

        <Link
          href="/jinwoo/costs"
          style={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#9ca3af", padding: "8px 14px", borderRadius: "8px", fontSize: "13px", textDecoration: "none" }}
        >
          ← Cost Overview
        </Link>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {tiers.map((t, idx) => (
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
              <strong style={{ color: "#f3f4f6", fontSize: "16px", display: "block" }}>{t.provider}</strong>
              <span style={{ color: "#9ca3af", fontSize: "12px" }}>{t.notes}</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ textAlign: "right" }}>
                <span style={{ color: "#9ca3af", fontSize: "11px", display: "block" }}>FREE QUOTA</span>
                <strong style={{ color: "#34d399", fontSize: "14px" }}>{t.quota}</strong>
              </div>
              <span style={{ backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#34d399", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "2px 8px", borderRadius: "10px", fontSize: "11px", fontWeight: "600" }}>
                ● {t.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
