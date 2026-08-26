"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function AnalyticsCachePage() {
  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>⚡</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Cache Analytics</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Prompt prefix cache hit rates, token reuse statistics, and latency acceleration.
          </p>
        </div>

        <Link
          href="/jinwoo/analytics"
          style={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#9ca3af", padding: "8px 14px", borderRadius: "8px", fontSize: "13px", textDecoration: "none" }}
        >
          ← Analytics Overview
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
        <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
          <span style={{ color: "#9ca3af", fontSize: "12px", display: "block" }}>CACHE HIT RATIO</span>
          <strong style={{ color: "#34d399", fontSize: "24px" }}>34.2%</strong>
        </div>
        <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
          <span style={{ color: "#9ca3af", fontSize: "12px", display: "block" }}>SAVED TOKENS</span>
          <strong style={{ color: "#60a5fa", fontSize: "24px" }}>28,940</strong>
        </div>
        <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
          <span style={{ color: "#9ca3af", fontSize: "12px", display: "block" }}>LATENCY GAIN</span>
          <strong style={{ color: "#a78bfa", fontSize: "24px" }}>2.4x Faster</strong>
        </div>
      </div>
    </div>
  );
}
