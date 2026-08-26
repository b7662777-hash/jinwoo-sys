"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function AnalyticsSearchPage() {
  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🔍</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Search Analytics</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Web search query latency, SearXNG cache hit rate, and scraped document size metrics.
          </p>
        </div>

        <Link
          href="/jinwoo/analytics"
          style={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#9ca3af", padding: "8px 14px", borderRadius: "8px", fontSize: "13px", textDecoration: "none" }}
        >
          ← Analytics Overview
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
        <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
          <span style={{ color: "#9ca3af", fontSize: "12px", display: "block" }}>TOTAL SEARCHES</span>
          <strong style={{ color: "#f3f4f6", fontSize: "24px" }}>18</strong>
        </div>
        <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
          <span style={{ color: "#9ca3af", fontSize: "12px", display: "block" }}>AVG QUERY TIME</span>
          <strong style={{ color: "#60a5fa", fontSize: "24px" }}>410ms</strong>
        </div>
        <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
          <span style={{ color: "#9ca3af", fontSize: "12px", display: "block" }}>SEARCH HIT RATE</span>
          <strong style={{ color: "#34d399", fontSize: "24px" }}>100%</strong>
        </div>
      </div>
    </div>
  );
}
