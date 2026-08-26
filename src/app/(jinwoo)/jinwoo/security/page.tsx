"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function SecurityOverviewPage() {
  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🔒</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Security & Guardrails</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Autonomous agent guardrails, filesystem path containment, secret masking, and token authorization.
          </p>
        </div>

        <Link
          href="/jinwoo/security/access-tokens"
          style={{ backgroundColor: "#2563eb", color: "white", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", textDecoration: "none" }}
        >
          Manage Access Tokens →
        </Link>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <strong style={{ color: "#f3f4f6", fontSize: "15px" }}>Workspace Path Jail (Directory Guard)</strong>
            <span style={{ backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#34d399", padding: "2px 8px", borderRadius: "10px", fontSize: "11px", fontWeight: "600" }}>● ACTIVE</span>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "13px", margin: 0 }}>
            Restricts coding agents to the selected workspace directory and prevents unauthorized file edits outside the project boundary.
          </p>
        </div>

        <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <strong style={{ color: "#f3f4f6", fontSize: "15px" }}>Secret Masking & Header Sanitization</strong>
            <span style={{ backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#34d399", padding: "2px 8px", borderRadius: "10px", fontSize: "11px", fontWeight: "600" }}>● ACTIVE</span>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "13px", margin: 0 }}>
            Guarantees provider credentials, API keys, and authorization headers are never exposed to browser state or logs.
          </p>
        </div>
      </div>
    </div>
  );
}