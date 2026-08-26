"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ConversationsLogsPage() {
  const [conversations, setConversations] = useState([
    { id: "conv_1", title: "Refactor OpenCodeAdapter and fix spawn quotes", turns: 6, updated: "Just now", agent: "Architect -> Developer" }
  ]);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>💬</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Conversations Archive</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Archived multi-turn agent transcripts and inter-role reasoning dialogues.
          </p>
        </div>

        <Link
          href="/jinwoo/logs"
          style={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#9ca3af", padding: "8px 14px", borderRadius: "8px", fontSize: "13px", textDecoration: "none" }}
        >
          ← Application Logs
        </Link>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {conversations.map((c) => (
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
              <strong style={{ color: "#f3f4f6", fontSize: "16px", display: "block" }}>{c.title}</strong>
              <span style={{ color: "#9ca3af", fontSize: "12px" }}>Participant: <strong style={{ color: "#60a5fa" }}>{c.agent}</strong></span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <span style={{ color: "#9ca3af", fontSize: "12px" }}>{c.turns} Turns • {c.updated}</span>
              <span style={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#34d399", padding: "4px 8px", borderRadius: "6px", fontSize: "11px" }}>Archived</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
