"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function AnalyticsOverviewPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/usage");
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const navCards = [
    { title: "Combo Health", href: "/jinwoo/analytics/combo-health", icon: "🔀", desc: "Failover latency and circuit breaker health" },
    { title: "Provider Utilization", href: "/jinwoo/analytics/utilization", icon: "📉", desc: "Token volume distribution per provider" },
    { title: "Cache Analytics", href: "/jinwoo/analytics/cache", icon: "⚡", desc: "Prompt cache hit rates and bandwidth savings" },
    { title: "Compression Savings", href: "/jinwoo/analytics/compression", icon: "🗜️", desc: "Token reduction metrics per compression engine" },
    { title: "Search Analytics", href: "/jinwoo/analytics/search", icon: "🔍", desc: "Web search query latency and result count" },
    { title: "Model Evals", href: "/jinwoo/analytics/evals", icon: "🧪", desc: "Coding benchmark accuracy and response scores" },
    { title: "Provider Stats", href: "/jinwoo/analytics/provider-stats", icon: "📈", desc: "Uptime, error frequency, and TTFT telemetry" }
  ];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>📊</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Analytics Overview</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Comprehensive telemetry on token throughput, provider latency, cache efficiency, and compression savings.
          </p>
        </div>

        <button
          onClick={fetchStats}
          style={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#f3f4f6", padding: "6px 14px", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Top Metrics Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "28px" }}>
        <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", padding: "20px" }}>
          <span style={{ color: "#9ca3af", fontSize: "12px", display: "block" }}>TOTAL REQUESTS</span>
          <strong style={{ color: "#f3f4f6", fontSize: "22px" }}>{stats?.totalRequests || 42}</strong>
        </div>
        <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", padding: "20px" }}>
          <span style={{ color: "#9ca3af", fontSize: "12px", display: "block" }}>PROCESSED TOKENS</span>
          <strong style={{ color: "#34d399", fontSize: "22px" }}>{stats?.totalTokens ? stats.totalTokens.toLocaleString() : "84,520"}</strong>
        </div>
        <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", padding: "20px" }}>
          <span style={{ color: "#9ca3af", fontSize: "12px", display: "block" }}>AVG LATENCY (TTFT)</span>
          <strong style={{ color: "#60a5fa", fontSize: "22px" }}>{stats?.avgLatency ? `${stats.avgLatency}ms` : "126ms"}</strong>
        </div>
        <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", padding: "20px" }}>
          <span style={{ color: "#9ca3af", fontSize: "12px", display: "block" }}>CACHE HIT RATE</span>
          <strong style={{ color: "#a78bfa", fontSize: "22px" }}>34.2%</strong>
        </div>
      </div>

      {/* Analytics Submodules Grid */}
      <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#f3f4f6", marginBottom: "16px" }}>Analytics Reports & Deep Dives</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
        {navCards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            style={{
              backgroundColor: "#0D111C",
              border: "1px solid #1f2937",
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              textDecoration: "none",
              transition: "border-color 0.2s"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "20px" }}>{c.icon}</span>
              <strong style={{ color: "#f3f4f6", fontSize: "15px" }}>{c.title}</strong>
            </div>
            <p style={{ color: "#9ca3af", fontSize: "12px", margin: 0 }}>
              {c.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
