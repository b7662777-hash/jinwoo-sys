"use client";

import React, { useState } from "react";

export default function IntegrationsWebhooksPage() {
  const [webhooks, setWebhooks] = useState([
    { id: "wh1", name: "Workflow Completed Webhook", url: "https://api.mycompany.com/jinwoo-events", events: ["workflow.completed", "workflow.failed"], status: "ACTIVE" }
  ]);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🪝</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Outgoing Webhooks</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Receive real-time HTTP POST notifications when orchestration workflows, tasks, or security alerts trigger.
          </p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {webhooks.map((w) => (
          <div
            key={w.id}
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
              <strong style={{ color: "#f3f4f6", fontSize: "15px", display: "block" }}>{w.name}</strong>
              <code style={{ color: "#60a5fa", fontSize: "12px" }}>{w.url}</code>
            </div>

            <span style={{
              backgroundColor: "rgba(16, 185, 129, 0.15)",
              color: "#34d399",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              padding: "2px 8px",
              borderRadius: "10px",
              fontSize: "11px",
              fontWeight: "600"
            }}>
              ● {w.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
