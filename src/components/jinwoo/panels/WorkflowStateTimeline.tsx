"use client";

import React from "react";
import { useJinwooWorkspace } from "@/app/(jinwoo)/jinwoo/context";

export function WorkflowStateTimeline() {
  const { state } = useJinwooWorkspace();

  const statuses = [
    "DRAFT", "ANALYZING", "PLAN_READY", "APPROVAL_REQUIRED", "APPROVED", "QUEUED", "RUNNING", "COMPLETED"
  ];

  let current = state.currentStatus;
  if (!current) {
    if (state.isRunning) current = "RUNNING";
    else if (state.approvalRequired) current = "APPROVAL_REQUIRED";
    else if (state.isPlanning) current = "ANALYZING";
    else if (state.plan) current = "PLAN_READY";
    else current = "DRAFT";
  }

  const currentIndex = statuses.indexOf(current);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "24px", marginTop: "auto", paddingTop: "16px", borderTop: "1px solid #1f2937" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: "14px", fontWeight: "600", color: "#f3f4f6" }}>Workflow State</span>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "12px", color: "#9ca3af" }}>Current:</span>
          <span style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#34d399", padding: "2px 6px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold" }}>{current}</span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", flex: 1, paddingLeft: "24px", position: "relative" }}>
        {/* Line */}
        <div style={{ position: "absolute", left: "48px", right: "24px", top: "14px", height: "2px", backgroundColor: "#1f2937", zIndex: 0 }}></div>
        <div style={{ position: "absolute", left: "48px", top: "14px", height: "2px", backgroundColor: "#10b981", zIndex: 0, width: `${(Math.max(0, currentIndex) / (statuses.length - 1)) * 100}%`, transition: "width 0.3s" }}></div>

        {statuses.map((status, i) => {
          const isPast = i < currentIndex;
          const isActive = i === currentIndex;
          
          let circleColor = "#1f2937";
          if (isPast) circleColor = "#10b981";
          if (isActive) circleColor = "#3b82f6";

          return (
            <div key={status} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", position: "relative", zIndex: 1 }}>
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: circleColor, border: isActive ? "3px solid rgba(59, 130, 246, 0.3)" : "none", transition: "all 0.3s" }}></div>
              <div style={{ fontSize: "10px", color: isActive || isPast ? "#d1d5db" : "#6b7280", fontWeight: isActive ? "600" : "400" }}>{status}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
