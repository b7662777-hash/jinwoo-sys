"use client";

import React from "react";
import { useJinwooWorkspace } from "@/app/(jinwoo)/jinwoo/context";

export function ResourceMonitorPanel() {
  const { state } = useJinwooWorkspace();
  
  let totalTokens = 0;
  let providerReportedTokens = 0;
  let unknownTokensCount = 0;
  
  Object.values(state.agents).forEach((agent: any) => {
    if (agent.tokens) totalTokens += agent.tokens;
    if (agent.usageSource === "PROVIDER_REPORTED") providerReportedTokens += (agent.tokens || 0);
    else if (agent.usageSource === "UNKNOWN") unknownTokensCount++;
  });
  
  const tokenLimit = 50000;
  const tokenPercent = Math.min(100, Math.round((totalTokens / tokenLimit) * 100)) || 0;
  
  return (
    <div style={{ border: "1px solid #1f2937", borderRadius: "12px", background: "#0D111C", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", borderBottom: "1px solid #1f2937" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "16px" }}>📊</span>
          <div style={{ fontWeight: "600", fontSize: "15px", color: "#f3f4f6" }}>Resource Overview</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: state.isRunning ? "rgba(16, 185, 129, 0.1)" : "rgba(107, 114, 128, 0.1)", color: state.isRunning ? "#34d399" : "#9ca3af", padding: "2px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "600" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: state.isRunning ? "#34d399" : "#9ca3af" }}></span> {state.isRunning ? "Live" : "Idle"}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", padding: "16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ color: "#9ca3af", fontSize: "12px" }}>Gateway Transport</div>
          <div style={{ color: "#34d399", fontSize: "14px", fontWeight: "600" }}>OmniRoute Local</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ color: "#9ca3af", fontSize: "12px" }}>Usage Source</div>
          <div style={{ color: "#f3f4f6", fontSize: "14px", fontWeight: "500" }}>{providerReportedTokens > 0 ? "PROVIDER_REPORTED" : (unknownTokensCount > 0 ? "UNKNOWN" : "JINWOO_ESTIMATED")}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ color: "#9ca3af", fontSize: "12px" }}>Tokens Used</div>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <span style={{ color: "#f3f4f6", fontSize: "14px", fontWeight: "500" }}>{totalTokens.toLocaleString()}</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "8px" }}>
          <div style={{ color: "#9ca3af", fontSize: "12px" }}>Remaining Quota</div>
          <div style={{ color: "#f3f4f6", fontSize: "14px", fontWeight: "500" }}>UNKNOWN</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "8px" }}>
          <div style={{ color: "#9ca3af", fontSize: "12px" }}>Est. Cost (This Run)</div>
          <div style={{ color: "#f3f4f6", fontSize: "14px", fontWeight: "500" }}>$UNKNOWN</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "8px" }}>
          <div style={{ color: "#9ca3af", fontSize: "12px" }}>Active Agents</div>
          <div style={{ color: "#f3f4f6", fontSize: "14px", fontWeight: "500" }}>{state.activeAgents.length} <span style={{ color: "#6b7280", fontSize: "12px", fontWeight: "400" }}>Running</span></div>
        </div>
      </div>

      <div style={{ padding: "16px", borderTop: "1px solid #1f2937" }}>
        <button style={{ width: "100%", backgroundColor: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "#f3f4f6", padding: "8px", borderRadius: "6px", fontSize: "13px", fontWeight: "500", cursor: "pointer" }}>
          View Full Resource Monitor
        </button>
      </div>
    </div>
  );
}
