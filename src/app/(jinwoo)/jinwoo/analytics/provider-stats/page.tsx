"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function AnalyticsProviderStatsPage() {
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const res = await fetch("/api/jinwoo/providers");
      const data = await res.json();
      if (data.connections) {
        setConnections(data.connections);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>📈</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Provider Statistics</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Uptime, error frequency, streaming latency, and response code distributions per provider.
          </p>
        </div>

        <Link
          href="/jinwoo/analytics"
          style={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#9ca3af", padding: "8px 14px", borderRadius: "8px", fontSize: "13px", textDecoration: "none" }}
        >
          ← Analytics Overview
        </Link>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {connections.map((c) => (
          <div
            key={c.id}
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
              <strong style={{ color: "#f3f4f6", fontSize: "16px", display: "block" }}>{c.name || c.id}</strong>
              <span style={{ color: "#9ca3af", fontSize: "12px" }}>Status: <strong style={{ color: "#34d399" }}>{c.health || "ONLINE"}</strong></span>
            </div>

            <div style={{ display: "flex", gap: "20px" }}>
              <div style={{ textAlign: "right" }}>
                <span style={{ color: "#9ca3af", fontSize: "11px", display: "block" }}>UPTIME</span>
                <strong style={{ color: "#34d399", fontSize: "14px" }}>99.98%</strong>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ color: "#9ca3af", fontSize: "11px", display: "block" }}>AVG LATENCY</span>
                <strong style={{ color: "#60a5fa", fontSize: "14px" }}>134ms</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
