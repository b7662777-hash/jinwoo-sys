"use client";

import React from "react";
import { useJinwooWorkspace } from "@/app/(jinwoo)/jinwoo/context";

export function EnhancedRequestPanel() {
  const { state, prompt } = useJinwooWorkspace();
  const plan = state.plan?.enhancedRequest;

  if (!plan) return null;

  return (
    <div style={{ border: "1px solid #1f2937", borderRadius: "12px", background: "#0D111C", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px 20px", borderBottom: "1px solid #1f2937" }}>
        <div style={{ width: "24px", height: "24px", borderRadius: "6px", backgroundColor: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: "14px" }}>✨</span>
        </div>
        <div>
          <div style={{ fontWeight: "600", fontSize: "16px", color: "#f3f4f6" }}>Enhanced Request</div>
          <div style={{ fontSize: "12px", color: "#9ca3af" }}>AI-enhanced and structured from your original input</div>
        </div>
      </div>

      <div style={{ display: "flex", padding: "20px", gap: "24px" }}>
        
        {/* Original Request (Left) */}
        <div style={{ width: "220px", borderRight: "1px solid #1f2937", paddingRight: "24px" }}>
          <div style={{ color: "#9ca3af", fontSize: "13px", marginBottom: "12px" }}>Original Request</div>
          <div style={{ color: "#f3f4f6", fontSize: "14px", lineHeight: "1.5" }}>{prompt}</div>
        </div>

        {/* Enhanced Request details (Middle) */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px", paddingRight: "24px", borderRight: "1px solid #1f2937" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ color: "#a78bfa", fontSize: "14px", fontWeight: "500" }}>Enhanced Request (Editable)</div>
            <button style={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "white", padding: "4px 12px", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}>Edit</button>
          </div>
          
          <div>
            <div style={{ color: "#f3f4f6", fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>Objective</div>
            <div style={{ color: "#d1d5db", fontSize: "14px", lineHeight: "1.5" }}>{plan.objective}</div>
          </div>

          <div>
            <div style={{ color: "#f3f4f6", fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>Requirements</div>
            <ul style={{ margin: 0, paddingLeft: "20px", color: "#d1d5db", fontSize: "14px", lineHeight: "1.5" }}>
              {(plan.requirements || []).map((req: string, i: number) => <li key={i}>{req}</li>)}
            </ul>
          </div>
        </div>

        {/* Unresolved Questions & Affected Areas (Right) */}
        <div style={{ width: "240px", display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ backgroundColor: "rgba(124, 58, 237, 0.05)", border: "1px solid rgba(124, 58, 237, 0.2)", borderRadius: "8px", padding: "16px" }}>
            <div style={{ color: "#a78bfa", fontSize: "13px", fontWeight: "600", marginBottom: "8px" }}>Unresolved Questions</div>
            <ul style={{ margin: 0, paddingLeft: "16px", color: "#d1d5db", fontSize: "13px", lineHeight: "1.5" }}>
              {(plan.risks || ["No immediate risks identified."]).map((risk: string, i: number) => <li key={i}>{risk}</li>)}
            </ul>
          </div>

          <div>
            <div style={{ color: "#f3f4f6", fontSize: "13px", fontWeight: "600", marginBottom: "8px" }}>Affected Areas</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {["backend", "frontend", "database", "api"].map(area => (
                <span key={area} style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "#a78bfa", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "500" }}>{area}</span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
