"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("ALL");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/jinwoo/events");
      const data = await res.json();
      if (data.events) {
        setLogs(data.events);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = logs.filter((l) => {
    const text = JSON.stringify(l).toLowerCase();
    const matchSearch = text.includes(search.toLowerCase());
    const matchLevel = levelFilter === "ALL" || (l.type && l.type.includes(levelFilter));
    return matchSearch && matchLevel;
  });

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>📋</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Application Logs</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Unified system and orchestration logs, worker state transitions, and tool execution history.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <Link
            href="/jinwoo/logs/proxy"
            style={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#60a5fa", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", textDecoration: "none" }}
          >
            🚦 Proxy Logs
          </Link>
          <Link
            href="/jinwoo/logs/timeline"
            style={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#a78bfa", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", textDecoration: "none" }}
          >
            ⏳ Timeline
          </Link>
          <button
            onClick={fetchLogs}
            style={{ backgroundColor: "#2563eb", color: "white", border: "none", padding: "6px 14px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter logs by keyword, agent ID, or event type..."
          style={{ flex: 1, backgroundColor: "#0D111C", border: "1px solid #1f2937", color: "#f3f4f6", padding: "8px 14px", borderRadius: "8px", fontSize: "13px", outline: "none" }}
        />
      </div>

      {/* Logs Table */}
      <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "12px" }}>
          <thead>
            <tr style={{ backgroundColor: "#111827", borderBottom: "1px solid #1f2937", color: "#9ca3af" }}>
              <th style={{ padding: "10px 14px" }}>TIMESTAMP</th>
              <th style={{ padding: "10px 14px" }}>EVENT / TYPE</th>
              <th style={{ padding: "10px 14px" }}>AGENT</th>
              <th style={{ padding: "10px 14px" }}>PAYLOAD</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: "32px", textAlign: "center", color: "#6b7280" }}>
                  No log records found matching query.
                </td>
              </tr>
            ) : (
              filtered.map((l, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #1f2937", color: "#f3f4f6" }}>
                  <td style={{ padding: "10px 14px", color: "#9ca3af", fontFamily: "monospace", whiteSpace: "nowrap" }}>
                    {new Date(l.timestamp || Date.now()).toLocaleTimeString()}
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{ backgroundColor: "#1f2937", color: "#60a5fa", padding: "2px 6px", borderRadius: "4px", fontSize: "11px", fontWeight: "600" }}>
                      {l.type || "INFO"}
                    </span>
                  </td>
                  <td style={{ padding: "10px 14px", color: "#a78bfa", fontWeight: "500" }}>
                    {l.agentId || "Orchestrator"}
                  </td>
                  <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: "11px", color: "#cbd5e1", maxWidth: "450px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {JSON.stringify(l.payload || l.message || l)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
