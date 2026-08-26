"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function OpenClawRuntimePage() {
  const [detection, setDetection] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetection();
  }, []);

  const fetchDetection = async () => {
    try {
      const res = await fetch("/api/jinwoo/coding-agents");
      const data = await res.json();
      const openclaw = data.runtimes?.find((r: any) => r.id === "openclaw");
      setDetection(openclaw || { status: "NOT_INSTALLED", capabilities: {} });
    } catch (e) {
      console.error("Failed to load detection:", e);
    } finally {
      setLoading(false);
    }
  };

  const isReady = detection?.status === "READY";

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🦞</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>OpenClaw Worker Runtime</h1>
            <span style={{
              backgroundColor: isReady ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
              color: isReady ? "#34d399" : "#f87171",
              border: `1px solid ${isReady ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
              padding: "2px 8px",
              borderRadius: "10px",
              fontSize: "11px",
              fontWeight: "600"
            }}>
              ● {detection?.status || "NOT_INSTALLED"}
            </span>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            OpenClaw agentic coding worker adapter. Capability and messaging status are verified dynamically.
          </p>
        </div>

        <Link
          href="/jinwoo/coding-agents"
          style={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#9ca3af", padding: "8px 14px", borderRadius: "8px", fontSize: "13px", textDecoration: "none" }}
        >
          ← All Runtimes
        </Link>
      </div>

      {/* Detection State Card */}
      <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", padding: "24px", marginBottom: "24px" }}>
        <strong style={{ color: "#f3f4f6", fontSize: "16px", display: "block", marginBottom: "16px" }}>Adapter Detection Status</strong>

        {isReady ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
            <div style={{ color: "#34d399" }}>✓ OpenClaw executable detected: <code>{detection.executablePath}</code></div>
            <div>Version: <span style={{ color: "#f3f4f6" }}>{detection.version}</span></div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.25)", padding: "14px", borderRadius: "8px", color: "#fca5a5", fontSize: "13px" }}>
              ⚠️ <strong>OpenClaw runtime is not detected on this system.</strong>
              <div style={{ marginTop: "6px", color: "#e5e7eb" }}>
                To enable OpenClaw as an autonomous worker runtime, install the CLI:
              </div>
              <pre style={{ backgroundColor: "#030712", padding: "10px", borderRadius: "6px", color: "#34d399", fontSize: "12px", marginTop: "8px", margin: "8px 0 0 0" }}>
                npm install -g openclaw
              </pre>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div style={{ backgroundColor: "#111827", padding: "14px", borderRadius: "8px" }}>
                <strong style={{ color: "#9ca3af", fontSize: "12px", textTransform: "uppercase" }}>Agent Messaging</strong>
                <p style={{ color: "#ef4444", fontSize: "13px", margin: "6px 0 0 0", fontWeight: "bold" }}>● UNSUPPORTED (Runtime Offline)</p>
              </div>
              <div style={{ backgroundColor: "#111827", padding: "14px", borderRadius: "8px" }}>
                <strong style={{ color: "#9ca3af", fontSize: "12px", textTransform: "uppercase" }}>Session Injection</strong>
                <p style={{ color: "#ef4444", fontSize: "13px", margin: "6px 0 0 0", fontWeight: "bold" }}>● UNSUPPORTED (Runtime Offline)</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
