"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function AnalyticsComboHealthPage() {
  const [combos, setCombos] = useState<any[]>([
    { name: "Claude Opus -> Sonnet Cascade", successRate: "99.4%", avgFailoverMs: "84ms", circuitBreakerState: "CLOSED (HEALTHY)" },
    { name: "Fast Coding Duo", successRate: "100%", avgFailoverMs: "42ms", circuitBreakerState: "CLOSED (HEALTHY)" }
  ]);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🔀</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Combo Health Telemetry</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Failover execution success rate, circuit breaker trip states, and latency penalty tracking.
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
        {combos.map((c, idx) => (
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
              <strong style={{ color: "#f3f4f6", fontSize: "16px", display: "block" }}>{c.name}</strong>
              <span style={{ color: "#9ca3af", fontSize: "12px" }}>Failover Latency: <strong style={{ color: "#60a5fa" }}>{c.avgFailoverMs}</strong></span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ textAlign: "right" }}>
                <span style={{ color: "#9ca3af", fontSize: "11px", display: "block" }}>SUCCESS RATE</span>
                <strong style={{ color: "#34d399", fontSize: "15px" }}>{c.successRate}</strong>
              </div>
              <span style={{ backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#34d399", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "600" }}>
                ● {c.circuitBreakerState}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
