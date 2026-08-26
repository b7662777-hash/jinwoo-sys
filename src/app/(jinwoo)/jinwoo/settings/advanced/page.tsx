"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function AdvancedSettingsPage() {
  const [debugLogs, setDebugLogs] = useState(false);
  const [experimentalTls, setExperimentalTls] = useState(true);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🔧</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Advanced System Configuration</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Low-level socket pooling, TLS fingerprint emulation, and diagnostic logging.
          </p>
        </div>

        <Link
          href="/jinwoo/settings"
          style={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#9ca3af", padding: "8px 14px", borderRadius: "8px", fontSize: "13px", textDecoration: "none" }}
        >
          ← All Settings
        </Link>
      </div>

      <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <strong style={{ color: "#f3f4f6", fontSize: "14px", display: "block" }}>Verbose Diagnostic Debug Logging</strong>
            <span style={{ color: "#9ca3af", fontSize: "12px" }}>Streams detailed socket payload dumps to stdout.</span>
          </div>
          <input
            type="checkbox"
            checked={debugLogs}
            onChange={(e) => setDebugLogs(e.target.checked)}
            style={{ width: "18px", height: "18px", accentColor: "#3b82f6", cursor: "pointer" }}
          />
        </div>

        <div style={{ borderTop: "1px solid #1f2937", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <strong style={{ color: "#f3f4f6", fontSize: "14px", display: "block" }}>Browser TLS Fingerprint Spoofing (uTLS)</strong>
            <span style={{ color: "#9ca3af", fontSize: "12px" }}>Bypasses Cloudflare anti-bot checks on upstream web endpoints.</span>
          </div>
          <input
            type="checkbox"
            checked={experimentalTls}
            onChange={(e) => setExperimentalTls(e.target.checked)}
            style={{ width: "18px", height: "18px", accentColor: "#3b82f6", cursor: "pointer" }}
          />
        </div>
      </div>
    </div>
  );
}
