"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function CodexRuntimePage() {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const handleTest = async () => {
    setTesting(true);
    try {
      const res = await fetch("/api/jinwoo/coding-agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "test_runtime", agentId: "codex" })
      });
      const data = await res.json();
      setTestResult(data);
    } catch (e: any) {
      setTestResult({ success: false, message: e.message });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>📜</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Codex CLI Runtime</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Codex CLI integration adapter for code generation and refactoring pipelines.
          </p>
        </div>

        <Link
          href="/jinwoo/coding-agents"
          style={{
            backgroundColor: "#1f2937",
            border: "1px solid #374151",
            color: "#9ca3af",
            padding: "8px 14px",
            borderRadius: "6px",
            fontSize: "13px",
            textDecoration: "none"
          }}
        >
          ← All Agents
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
        {/* Runtime Status Card */}
        <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "16px", fontWeight: "bold", color: "#f3f4f6" }}>Runtime Status</span>
            <span style={{ backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#34d399", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "600" }}>● READY</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", backgroundColor: "#111827", padding: "16px", borderRadius: "8px", fontSize: "13px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#9ca3af" }}>Adapter Type</span>
              <strong style={{ color: "#f3f4f6" }}>Codex CLI Wrapper</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#9ca3af" }}>Provider Gateway</span>
              <strong style={{ color: "#60a5fa" }}>OmniRoute (127.0.0.1:20128)</strong>
            </div>
          </div>

          {/* Action Controls */}
          <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
            <button
              onClick={handleTest}
              disabled={testing}
              style={{
                flex: 1,
                backgroundColor: "#2563eb",
                color: "white",
                border: "none",
                padding: "10px 16px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: testing ? "not-allowed" : "pointer"
              }}
            >
              {testing ? "Running Health Check..." : "🧪 Run Codex Health Check"}
            </button>
          </div>

          {testResult && (
            <div style={{
              fontSize: "12px",
              padding: "10px",
              borderRadius: "6px",
              backgroundColor: testResult.success ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
              border: `1px solid ${testResult.success ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
              color: testResult.success ? "#34d399" : "#f87171"
            }}>
              <strong>{testResult.success ? "✓ Test Passed:" : "✕ Error:"}</strong> {testResult.message}
            </div>
          )}
        </div>

        {/* Capabilities Side Card */}
        <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#f3f4f6", margin: 0 }}>Capabilities</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#60a5fa" }}>✓ CLI Execution Bridge</div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#34d399" }}>✓ Batch Code Refactoring</div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#a78bfa" }}>✓ Automated Syntax Verification</div>
          </div>
        </div>
      </div>
    </div>
  );
}
