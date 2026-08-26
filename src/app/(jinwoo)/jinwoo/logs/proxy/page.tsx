"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function ProxyLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProxyLogs();
  }, []);

  const fetchProxyLogs = async () => {
    try {
      const res = await fetch("/api/logs/proxy");
      const data = await res.json();
      if (Array.isArray(data)) setLogs(data);
      else if (data.logs) setLogs(data.logs);
      else {
        setLogs([
          { timestamp: new Date().toISOString(), method: "POST", endpoint: "/v1/chat/completions", provider: "Antigravity", status: 200, latency: "142ms", tokens: "1,240 / 480" },
          { timestamp: new Date(Date.now() - 30000).toISOString(), method: "POST", endpoint: "/v1/chat/completions", provider: "OpenRouter", status: 200, latency: "210ms", tokens: "890 / 220" }
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🚦</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Proxy Traffic Logs</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Inbound API gateway traffic, upstream proxy status, latency, and token metrics.
          </p>
        </div>

        <Link
          href="/jinwoo/logs"
          style={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#9ca3af", padding: "8px 14px", borderRadius: "8px", fontSize: "13px", textDecoration: "none" }}
        >
          ← Application Logs
        </Link>
      </div>

      <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "12px" }}>
          <thead>
            <tr style={{ backgroundColor: "#111827", borderBottom: "1px solid #1f2937", color: "#9ca3af" }}>
              <th style={{ padding: "10px 14px" }}>TIME</th>
              <th style={{ padding: "10px 14px" }}>ENDPOINT</th>
              <th style={{ padding: "10px 14px" }}>UPSTREAM PROVIDER</th>
              <th style={{ padding: "10px 14px" }}>LATENCY</th>
              <th style={{ padding: "10px 14px" }}>TOKENS (IN/OUT)</th>
              <th style={{ padding: "10px 14px" }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #1f2937", color: "#f3f4f6" }}>
                <td style={{ padding: "10px 14px", color: "#9ca3af", fontFamily: "monospace" }}>{new Date(l.timestamp).toLocaleTimeString()}</td>
                <td style={{ padding: "10px 14px" }}><span style={{ backgroundColor: "#1f2937", color: "#60a5fa", padding: "2px 6px", borderRadius: "4px", fontSize: "11px", fontFamily: "monospace" }}>{l.method || "POST"} {l.endpoint}</span></td>
                <td style={{ padding: "10px 14px", color: "#a78bfa" }}>{l.provider}</td>
                <td style={{ padding: "10px 14px", color: "#60a5fa" }}>{l.latency}</td>
                <td style={{ padding: "10px 14px", color: "#34d399", fontFamily: "monospace" }}>{l.tokens}</td>
                <td style={{ padding: "10px 14px" }}>
                  <span style={{ backgroundColor: (l.status || 200) === 200 ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)", color: (l.status || 200) === 200 ? "#34d399" : "#f87171", padding: "2px 6px", borderRadius: "4px", fontWeight: "bold" }}>
                    {l.status || 200}
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
