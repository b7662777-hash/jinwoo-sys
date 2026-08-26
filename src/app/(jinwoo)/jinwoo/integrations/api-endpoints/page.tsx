"use client";

import React from "react";
import Link from "next/link";

export default function IntegrationsApiEndpointsPage() {
  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🌐</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>API Integration Endpoints</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Integration endpoints for connecting IDEs (Cursor, VS Code, Zed), CI/CD pipelines, and SDKs.
          </p>
        </div>

        <Link
          href="/jinwoo/omniproxy/endpoints"
          style={{ backgroundColor: "#2563eb", color: "white", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", textDecoration: "none" }}
        >
          View Full API Catalog →
        </Link>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", padding: "20px" }}>
          <strong style={{ color: "#f3f4f6", fontSize: "15px", display: "block", marginBottom: "6px" }}>OpenAI Compatible Endpoint</strong>
          <code style={{ color: "#34d399", fontSize: "13px" }}>http://127.0.0.1:20128/v1</code>
          <p style={{ color: "#9ca3af", fontSize: "13px", marginTop: "8px" }}>
            Point any OpenAI-compatible client (Cursor base URL, OpenCode, Aider) directly to this address.
          </p>
        </div>

        <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", padding: "20px" }}>
          <strong style={{ color: "#f3f4f6", fontSize: "15px", display: "block", marginBottom: "6px" }}>Anthropic Compatible Endpoint</strong>
          <code style={{ color: "#60a5fa", fontSize: "13px" }}>http://127.0.0.1:20128/v1/messages</code>
          <p style={{ color: "#9ca3af", fontSize: "13px", marginTop: "8px" }}>
            Supports Anthropic Claude native payload format and streaming event sequences.
          </p>
        </div>
      </div>
    </div>
  );
}
