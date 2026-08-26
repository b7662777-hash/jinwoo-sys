"use client";

import React from "react";
import { useJinwooWorkspace } from "@/app/(jinwoo)/jinwoo/context";

export function ApprovalGatePanel() {
  const { state, approveWorkflow } = useJinwooWorkspace();
  const tasks = state.plan?.tasks || [];
  
  if (tasks.length === 0) return null;

  const isApproved = state.isRunning || state.currentStatus === "APPROVED" || state.currentStatus === "RUNNING" || state.currentStatus === "COMPLETED";

  const uniqueRoles = Array.from(new Set(tasks.map((t: any) => t.role)));
  const uniqueModels = Array.from(new Set(tasks.map((t: any) => t.recommendedModel || t.model || "Default")));
  const hasDependencies = tasks.some((t: any) => t.dependsOn && t.dependsOn.length > 0);

  return (
    <div style={{ border: "1px solid #1f2937", borderRadius: "12px", background: "#0D111C", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #1f2937" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "24px", height: "24px", borderRadius: "6px", backgroundColor: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "14px" }}>🛡️</span>
          </div>
          <div>
            <div style={{ fontWeight: "600", fontSize: "15px", color: "#f3f4f6" }}>Workforce Approval Gate</div>
            <div style={{ fontSize: "12px", color: "#9ca3af" }}>Review task delegation and model assignments before execution</div>
          </div>
        </div>
        
        <span style={{ backgroundColor: "rgba(245, 158, 11, 0.1)", color: "#fbbf24", border: "1px solid rgba(245, 158, 11, 0.3)", padding: "2px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "600" }}>
          {isApproved ? "APPROVED" : "ACTION REQUIRED"}
        </span>
      </div>

      <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
        {[
          { label: "Tasks & Structure", desc: `${tasks.length} tasks (${hasDependencies ? "DAG Dependency Flow" : "Independent Parallel Tasks"})` },
          { label: "Assigned Roles", desc: uniqueRoles.join(", ") },
          { label: "Assigned Models", desc: uniqueModels.join(", ") },
          { label: "File Protection", desc: "Locking & conflict prevention enabled" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "18px", height: "18px", borderRadius: "50%", backgroundColor: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "11px", fontWeight: "bold" }}>✓</div>
            <div style={{ flex: 1, color: "#f3f4f6", fontSize: "13px", fontWeight: "500" }}>{item.label}</div>
            <div style={{ color: "#9ca3af", fontSize: "12px", maxWidth: "60%", textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: "16px 20px", borderTop: "1px solid #1f2937", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(0,0,0,0.2)" }}>
        <div style={{ fontSize: "12px", color: "#9ca3af" }}>
          Ready to deploy workforce against selected workspace.
        </div>

        <button 
          onClick={approveWorkflow}
          disabled={isApproved}
          style={{ 
            backgroundColor: isApproved ? "#374151" : "#10b981", 
            border: "none", 
            color: "white", 
            padding: "10px 24px", 
            borderRadius: "6px", 
            fontSize: "13px", 
            fontWeight: "600", 
            cursor: isApproved ? "default" : "pointer", 
            opacity: isApproved ? 0.6 : 1 
          }}
        >
          {isApproved ? "✓ Workflow Approved" : "Approve & Start Execution →"}
        </button>
      </div>
    </div>
  );
}
