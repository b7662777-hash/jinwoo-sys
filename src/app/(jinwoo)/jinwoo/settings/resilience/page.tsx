"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ResilienceSettingsPage() {
  const [retries, setRetries] = useState("3");

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🔄</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Gateway Resilience</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Automatic upstream retries, exponential backoff, and circuit breaker recovery intervals.
          </p>
        </div>

        <Link
          href="/jinwoo/settings"
          style={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#9ca3af", padding: "8px 14px", borderRadius: "8px", fontSize: "13px", textDecoration: "none" }}
        >
          ← All Settings
        </Link>
      </div>

      <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", padding: "24px" }}>
        <label style={{ fontSize: "13px", color: "#f3f4f6", fontWeight: "600", display: "block", marginBottom: "6px" }}>Max Automatic Retry Attempts</label>
        <input
          type="number"
          value={retries}
          onChange={(e) => setRetries(e.target.value)}
          style={{ width: "100%", maxWidth: "160px", backgroundColor: "#111827", border: "1px solid #374151", color: "#f3f4f6", padding: "8px 12px", borderRadius: "6px", fontSize: "13px", outline: "none" }}
        />
      </div>
    </div>
  );
}
