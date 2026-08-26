"use client";

import React, { useState } from "react";
import { useJinwooWorkspace } from "@/app/(jinwoo)/jinwoo/context";
import { EnhancedRequestPanel } from "@/components/jinwoo/panels/EnhancedRequestPanel";
import { WorkflowDAGPanel } from "@/components/jinwoo/panels/WorkflowDAGPanel";
import { AgentAssignmentsPanel } from "@/components/jinwoo/panels/AgentAssignmentsPanel";
import { ResourceMonitorPanel } from "@/components/jinwoo/panels/ResourceMonitorPanel";
import { ApprovalGatePanel } from "@/components/jinwoo/panels/ApprovalGatePanel";
import { WorkflowStateTimeline } from "@/components/jinwoo/panels/WorkflowStateTimeline";
import { ExecutionMonitorPanel } from "@/components/jinwoo/panels/ExecutionMonitorPanel";
import Link from "next/link";

export default function LiveExecutionPage() {
  const workflow = useJinwooWorkspace();
  const { prompt, setPrompt, roleCount, setRoleCount, startWorkflow, state, workspaceName, workspacePath, createNewWorkflow } = workflow;

  const [editPrompt, setEditPrompt] = useState(false);

  const isPlanning = state.isPlanning;
  const isRunning = state.isRunning;
  const approvalRequired = state.approvalRequired;
  const isFailed = state.currentStatus === "PLANNING_FAILED" || state.currentStatus === "FAILED";
  const isCompleted = state.currentStatus === "COMPLETED";

  return (
      <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "24px", minHeight: "100%", color: "#f3f4f6" }}>
        
        {/* Header Block */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "20px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <span style={{ fontSize: "20px", color: "#a78bfa" }}>⚡</span>
              <h1 style={{ fontSize: "20px", fontWeight: "600", margin: 0 }}>Workflow: {state.workflowId || "None"}</h1>
              
              <span style={{ 
                backgroundColor: isFailed ? "rgba(239, 68, 68, 0.15)" : (isRunning ? "rgba(16, 185, 129, 0.15)" : (isPlanning ? "rgba(59, 130, 246, 0.15)" : (approvalRequired ? "rgba(245, 158, 11, 0.15)" : "rgba(107, 114, 128, 0.15)"))), 
                color: isFailed ? "#f87171" : (isRunning ? "#34d399" : (isPlanning ? "#60a5fa" : (approvalRequired ? "#fbbf24" : "#9ca3af"))), 
                border: `1px solid ${isFailed ? "rgba(239, 68, 68, 0.3)" : (isRunning ? "rgba(16, 185, 129, 0.3)" : (isPlanning ? "rgba(59, 130, 246, 0.3)" : (approvalRequired ? "rgba(245, 158, 11, 0.3)" : "rgba(107, 114, 128, 0.3)")))}`,
                padding: "2px 10px", 
                borderRadius: "12px", 
                fontSize: "12px", 
                fontWeight: "600" 
              }}>
                {state.currentStatus || (isPlanning ? "ANALYZING" : (approvalRequired ? "APPROVAL_REQUIRED" : (isRunning ? "RUNNING" : "DRAFT")))}
              </span>
            </div>
            
            <div style={{ display: "flex", gap: "16px", fontSize: "13px", color: "#9ca3af" }}>
              <span>Workspace: <strong style={{ color: "#d1d5db" }}>{workspaceName || "None"}</strong></span>
              <span>Path: <span style={{ fontFamily: "monospace", color: "#9ca3af" }}>{workspacePath || "Default"}</span></span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {/* Workforce size picker */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#030712", padding: "4px 8px", borderRadius: "6px", border: "1px solid #374151" }}>
              <span style={{ fontSize: "12px", color: "#9ca3af" }}>Roles:</span>
              <button 
                onClick={() => {
                  const cur = typeof roleCount === "number" ? roleCount : 3;
                  if (cur > 1) setRoleCount(cur - 1);
                }}
                disabled={isPlanning || isRunning}
                style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", fontSize: "12px" }}
              >
                -
              </button>
              <span style={{ fontSize: "12px", color: "#f3f4f6", fontWeight: "600", minWidth: "16px", textAlign: "center" }}>
                {typeof roleCount === "number" ? roleCount : "Auto"}
              </span>
              <button 
                onClick={() => {
                  const cur = typeof roleCount === "number" ? roleCount : 3;
                  if (cur < 8) setRoleCount(cur + 1);
                }}
                disabled={isPlanning || isRunning}
                style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", fontSize: "12px" }}
              >
                +
              </button>
            </div>

            <button 
              onClick={createNewWorkflow}
              style={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#d1d5db", padding: "8px 14px", borderRadius: "6px", fontSize: "13px", fontWeight: "500", cursor: "pointer" }}
            >
              + Reset Run
            </button>

            <button 
              onClick={() => startWorkflow(prompt, roleCount)}
              disabled={isPlanning || isRunning || !prompt.trim()}
              style={{ 
                backgroundColor: "#7c3aed", 
                border: "none", 
                color: "white", 
                padding: "8px 18px", 
                borderRadius: "6px", 
                fontSize: "13px", 
                fontWeight: "600", 
                cursor: "pointer", 
                opacity: (isPlanning || isRunning || !prompt.trim()) ? 0.5 : 1 
              }}
            >
              {isPlanning ? "Analyzing Plan..." : "Start Plan Analysis"}
            </button>
          </div>
        </div>

        {/* Error Notification Banner */}
        {state.error && (
          <div style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.4)", borderRadius: "8px", padding: "16px", color: "#fca5a5", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <strong style={{ color: "#ef4444" }}>Planning / Execution Error: </strong>
              <span>{state.error}</span>
            </div>
            <button 
              onClick={() => startWorkflow(prompt, roleCount)}
              style={{ backgroundColor: "#ef4444", border: "none", color: "white", padding: "4px 12px", borderRadius: "4px", fontSize: "12px", cursor: "pointer", fontWeight: "500" }}
            >
              Retry Planning
            </button>
          </div>
        )}

        {/* Prompt Input / Display */}
        <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "8px", padding: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#9ca3af" }}>User Objective / Prompt</span>
            <button 
              onClick={() => setEditPrompt(!editPrompt)}
              disabled={isPlanning || isRunning}
              style={{ background: "none", border: "none", color: "#60a5fa", fontSize: "12px", cursor: "pointer" }}
            >
              {editPrompt ? "Done Editing" : "Edit Prompt"}
            </button>
          </div>

          {editPrompt ? (
            <textarea 
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Enter your task instructions..."
              style={{ width: "100%", height: "80px", backgroundColor: "#030712", border: "1px solid #374151", borderRadius: "6px", color: "white", padding: "12px", fontSize: "14px", outline: "none" }}
            />
          ) : (
            <div style={{ fontSize: "14px", color: prompt ? "#f3f4f6" : "#6b7280", fontStyle: prompt ? "normal" : "italic" }}>
              {prompt || "No prompt provided. Enter an instruction above to begin."}
            </div>
          )}
        </div>

        {/* Main 2-Column Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px", flex: 1 }}>
          
          {/* Left Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* If plan exists, show enhanced request */}
            {state.plan && (
              <EnhancedRequestPanel />
            )}

            {/* Core Workflow Graph */}
            {(isPlanning || state.plan) && (
              <WorkflowDAGPanel />
            )}
            
            {/* Approval Gate */}
            {approvalRequired && (
              <ApprovalGatePanel />
            )}

            {/* Live Execution Panel */}
            {(isRunning || isCompleted || (state.messages && state.messages.length > 0)) && (
              <ExecutionMonitorPanel />
            )}
            
          </div>

          {/* Right Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
             <ResourceMonitorPanel />
             <AgentAssignmentsPanel />
             <WorkflowStateTimeline />
          </div>

        </div>
      </div>
  );
}
