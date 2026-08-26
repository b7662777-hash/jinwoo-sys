"use client";

import React from "react";
import { useJinwooWorkspace } from "@/app/(jinwoo)/jinwoo/context";

export function JinwooHeader() {
  const { state } = useJinwooWorkspace();
  
  let currentStep = 1; // Understand (Draft)
  if (state.isPlanning || state.plan) currentStep = 2; // Plan
  if (state.approvalRequired) currentStep = 3; // Approve
  if (state.isRunning) currentStep = 4; // Execute
  if (state.currentStatus === "COMPLETED") currentStep = 5; // Monitor/Done

  const steps = [
    { num: 1, label: "Understand" },
    { num: 2, label: "Plan" },
    { num: 3, label: "Approve" },
    { num: 4, label: "Execute" },
    { num: 5, label: "Monitor" }
  ];

  return (
    <div style={{
      height: "72px",
      backgroundColor: "#0A0D15",
      borderBottom: "1px solid #1f2937",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 24px",
      position: "relative"
    }}>
      {/* Stepper */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {steps.map((step, idx) => {
          const isActive = step.num === currentStep;
          const isPast = step.num < currentStep;
          
          return (
            <React.Fragment key={step.num}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 24px",
                borderRadius: "24px",
                backgroundColor: isActive ? "rgba(124, 58, 237, 0.15)" : "transparent",
                border: isActive ? "1px solid rgba(124, 58, 237, 0.5)" : "1px solid transparent",
                color: isActive ? "#fff" : (isPast ? "#d1d5db" : "#6b7280"),
                fontWeight: isActive ? "600" : "400",
                fontSize: "14px"
              }}>
                <span style={{ opacity: isActive ? 1 : 0.7 }}>{step.num}</span>
                <span>{step.label}</span>
              </div>
              {idx < steps.length - 1 && (
                <div style={{ color: "#374151" }}>›</div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Right icons */}
      <div style={{ position: "absolute", right: "24px", display: "flex", alignItems: "center", gap: "16px", color: "#9ca3af" }}>
        <div style={{ cursor: "pointer" }}>⋮⋮</div>
        <div style={{ cursor: "pointer" }}>🔔</div>
        <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold", fontSize: "12px" }}>
          JS
        </div>
      </div>
    </div>
  );
}
