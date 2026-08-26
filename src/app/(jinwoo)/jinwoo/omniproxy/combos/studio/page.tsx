"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ComboStudioPage() {
  const [pipeline, setPipeline] = useState([
    { id: "p1", name: "Primary Inference Node", provider: "Antigravity", model: "claude-opus-4-6-thinking", latency: "140ms", status: "HEALTHY", type: "primary" },
    { id: "p2", name: "Secondary Failover", provider: "Antigravity", model: "claude-sonnet-4-6", latency: "80ms", status: "HEALTHY", type: "fallback" },
    { id: "p3", name: "Cloud Fallback Node", provider: "OpenRouter", model: "anthropic/claude-3.5-sonnet", latency: "210ms", status: "HEALTHY", type: "fallback" },
    { id: "p4", name: "Local Zero-Cost Offline Node", provider: "Ollama", model: "qwen2.5-coder:32b", latency: "45ms", status: "LOCAL", type: "fallback" }
  ]);

  const [simulating, setSimulating] = useState(false);
  const [simulationLog, setSimulationLog] = useState<string[]>([]);

  const handleSimulateRoute = () => {
    setSimulating(true);
    setSimulationLog(["[15:08:00] Inbound request received -> /v1/chat/completions (model: auto-combo)"]);

    setTimeout(() => {
      setSimulationLog(prev => [...prev, "[15:08:01] Route evaluation: Primary Node (Antigravity/claude-opus) active"]);
    }, 400);

    setTimeout(() => {
      setSimulationLog(prev => [...prev, "[15:08:02] Token streaming active (TTFT: 128ms) -> Status: 200 OK"]);
      setSimulating(false);
    }, 900);
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🎨</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Combo Studio</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Visual DAG routing pipeline editor for multi-provider cascades and failover strategies.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <Link
            href="/jinwoo/omniproxy/combos"
            style={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              color: "#9ca3af",
              padding: "8px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              textDecoration: "none"
            }}
          >
            ← Back to Combos
          </Link>
          <button
            onClick={handleSimulateRoute}
            disabled={simulating}
            style={{
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: simulating ? "not-allowed" : "pointer"
            }}
          >
            {simulating ? "Simulating..." : "▶ Test Route Execution"}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
        {/* Visual Pipeline Graph */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {pipeline.map((node, idx) => (
            <React.Fragment key={node.id}>
              <div
                style={{
                  backgroundColor: "#0D111C",
                  border: `1px solid ${node.type === "primary" ? "rgba(59, 130, 246, 0.5)" : "#1f2937"}`,
                  borderRadius: "12px",
                  padding: "18px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: node.type === "primary" ? "0 0 15px rgba(59, 130, 246, 0.1)" : "none"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    backgroundColor: node.type === "primary" ? "#2563eb" : "#374151",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "12px"
                  }}>
                    {idx + 1}
                  </div>
                  <div>
                    <strong style={{ color: "#f3f4f6", fontSize: "14px", display: "block" }}>{node.name}</strong>
                    <span style={{ color: "#a78bfa", fontSize: "12px", fontFamily: "monospace" }}>{node.provider} / {node.model}</span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "11px", color: "#9ca3af" }}>⚡ {node.latency}</span>
                  <span style={{
                    backgroundColor: "rgba(16, 185, 129, 0.15)",
                    color: "#34d399",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    padding: "2px 8px",
                    borderRadius: "10px",
                    fontSize: "11px",
                    fontWeight: "600"
                  }}>
                    ● {node.status}
                  </span>
                </div>
              </div>

              {idx < pipeline.length - 1 && (
                <div style={{ display: "flex", justifyContent: "center", color: "#4b5563", fontSize: "16px" }}>
                  ↓
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Live Simulation / Trace Panel */}
        <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Routing Trace Console</h3>

          <div style={{ backgroundColor: "#030712", border: "1px solid #1f2937", borderRadius: "8px", padding: "12px", minHeight: "220px", fontFamily: "monospace", fontSize: "11px", display: "flex", flexDirection: "column", gap: "6px" }}>
            {simulationLog.length === 0 ? (
              <span style={{ color: "#6b7280" }}>Click &quot;Test Route Execution&quot; to test failover routing...</span>
            ) : (
              simulationLog.map((log, i) => (
                <span key={i} style={{ color: log.includes("200 OK") ? "#34d399" : "#93c5fd" }}>
                  {log}
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
