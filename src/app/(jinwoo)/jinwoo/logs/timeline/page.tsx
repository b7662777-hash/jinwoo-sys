"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function TimelineLogsPage() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/jinwoo/events");
        const data = await res.json();
        if (data.events) setEvents(data.events);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>⏳</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Execution Timeline</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Chronological multi-agent workflow execution milestones and file mutation timelines.
          </p>
        </div>

        <Link
          href="/jinwoo/logs"
          style={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#9ca3af", padding: "8px 14px", borderRadius: "8px", fontSize: "13px", textDecoration: "none" }}
        >
          ← Application Logs
        </Link>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {events.length === 0 ? (
          <div style={{ padding: "32px", textAlign: "center", color: "#6b7280", backgroundColor: "#0D111C", borderRadius: "12px", border: "1px solid #1f2937" }}>
            No timeline events recorded yet. Run a workflow to view execution milestones.
          </div>
        ) : (
          events.map((e, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: "#0D111C",
                border: "1px solid #1f2937",
                borderRadius: "10px",
                padding: "16px 20px",
                display: "flex",
                gap: "16px",
                alignItems: "flex-start"
              }}
            >
              <div style={{ backgroundColor: "#111827", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", color: "#9ca3af", fontFamily: "monospace", whiteSpace: "nowrap" }}>
                {new Date(e.timestamp || Date.now()).toLocaleTimeString()}
              </div>

              <div>
                <strong style={{ color: "#f3f4f6", fontSize: "14px", display: "block" }}>{e.type}</strong>
                <span style={{ color: "#a78bfa", fontSize: "12px" }}>Agent: {e.agentId || "System"}</span>
                <p style={{ color: "#9ca3af", fontSize: "12px", margin: "4px 0 0 0", fontFamily: "monospace" }}>
                  {JSON.stringify(e.payload || {})}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
