"use client";

import React, { useEffect, useState } from "react";
import { useJinwooWorkspace } from "./context";
import { ResourceMonitorPanel } from "@/components/jinwoo/panels/ResourceMonitorPanel";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardCommandCenter() {
  const workflow = useJinwooWorkspace();
  const { prompt, setPrompt, roleCount, setRoleCount, workspaceName, workspacePath, createNewWorkflow } = workflow;
  const router = useRouter();

  const [connectedCount, setConnectedCount] = useState<number | string>("...");
  const [modelCount, setModelCount] = useState<number | string>("...");

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/jinwoo/providers");
        const data = await res.json();
        if (data.connections) {
          const healthy = data.connections.filter((c: any) => c.health === "HEALTHY");
          setConnectedCount(healthy.length);
        }
        if (data.models) {
          setModelCount(data.models.length);
        }
      } catch (e) {
        setConnectedCount("0");
        setModelCount("0");
      }
    }
    loadStats();
  }, []);

  const activeAgents = workflow.state.activeAgents?.length || 0;
  const runningTasks = workflow.state.plan?.tasks?.filter((t: any) => t.status === 'RUNNING').length || 0;
  const completedTasks = workflow.state.plan?.tasks?.filter((t: any) => t.status === 'COMPLETED').length || 0;
  
  const handleStartWorkflow = () => {
    if (!prompt.trim()) return;
    router.push('/jinwoo/runs/current');
  };

  return (
      <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "24px", minHeight: "100%", color: "#f3f4f6" }}>
        
        {/* Hero Section */}
        <div style={{ padding: "24px", borderRadius: "12px", background: "linear-gradient(135deg, rgba(30,27,75,0.8) 0%, rgba(10,13,21,1) 100%)", border: "1px solid rgba(124, 58, 237, 0.3)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
           <div>
             <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "8px", color: "white" }}>JINWOO SYS</h1>
             <p style={{ color: "#a78bfa", fontSize: "15px", margin: 0 }}>Local-First Multi-AI Workforce & Orchestration OS</p>
           </div>
           <div style={{ display: "flex", gap: "12px" }}>
             <button 
               onClick={createNewWorkflow}
               style={{ backgroundColor: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.15)", color: "white", padding: "8px 16px", borderRadius: "6px", fontSize: "13px", fontWeight: "500", cursor: "pointer" }}
             >
               + New Workflow Run
             </button>
             <Link 
               href="/jinwoo/workspaces"
               style={{ backgroundColor: "rgba(124, 58, 237, 0.2)", border: "1px solid rgba(124, 58, 237, 0.4)", color: "#c4b5fd", padding: "8px 16px", borderRadius: "6px", fontSize: "13px", fontWeight: "500", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}
             >
               📁 {workspaceName || "Select Workspace"}
             </Link>
           </div>
        </div>

        {/* Start New Workflow */}
        <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "8px", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "600", margin: 0 }}>Start a New AI Workflow</h2>
            
            {/* Workforce Size Controller */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "13px", color: "#9ca3af" }}>Workforce Size:</span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  onClick={() => setRoleCount("auto")}
                  style={{
                    backgroundColor: roleCount === "auto" ? "#7c3aed" : "#1f2937",
                    border: "1px solid #374151",
                    color: "white",
                    padding: "4px 12px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "500",
                    cursor: "pointer"
                  }}
                >
                  Auto Recommend
                </button>

                <div style={{ display: "flex", alignItems: "center", background: "#030712", border: "1px solid #374151", borderRadius: "6px", overflow: "hidden" }}>
                  <button 
                    onClick={() => {
                      const cur = typeof roleCount === "number" ? roleCount : 3;
                      if (cur > 1) setRoleCount(cur - 1);
                    }}
                    style={{ padding: "4px 8px", background: "transparent", border: "none", color: "#9ca3af", cursor: "pointer", fontSize: "13px" }}
                  >
                    -
                  </button>
                  <span style={{ padding: "4px 8px", color: "#f3f4f6", fontSize: "12px", minWidth: "24px", textAlign: "center", fontWeight: "600" }}>
                    {typeof roleCount === "number" ? roleCount : "Auto"}
                  </span>
                  <button 
                    onClick={() => {
                      const cur = typeof roleCount === "number" ? roleCount : 3;
                      if (cur < 8) setRoleCount(cur + 1);
                    }}
                    style={{ padding: "4px 8px", background: "transparent", border: "none", color: "#9ca3af", cursor: "pointer", fontSize: "13px" }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          <textarea 
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="e.g. Add simple authentication to this project with JWT refresh tokens..."
            style={{ width: "100%", height: "90px", backgroundColor: "#030712", border: "1px solid #374151", borderRadius: "6px", color: "white", padding: "16px", fontSize: "14px", resize: "none", marginBottom: "16px", outline: "none" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>
              Active Workspace: <span style={{ color: "#9ca3af", fontFamily: "monospace" }}>{workspacePath || "None (will use default directory)"}</span>
            </div>
            <button 
              onClick={handleStartWorkflow}
              disabled={!prompt.trim()}
              style={{ backgroundColor: "#7c3aed", border: "none", color: "white", padding: "10px 24px", borderRadius: "6px", fontSize: "14px", fontWeight: "600", cursor: "pointer", opacity: prompt.trim() ? 1 : 0.5 }}
            >
              Analyze & Build Plan →
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
           <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", padding: "20px", borderRadius: "8px" }}>
             <div style={{ color: "#9ca3af", fontSize: "12px", marginBottom: "8px" }}>Selected Workspace</div>
             <div style={{ fontSize: "15px", fontWeight: "600", color: "#f3f4f6", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
               {workspaceName || "No Workspace Selected"}
             </div>
           </div>
           <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", padding: "20px", borderRadius: "8px" }}>
             <div style={{ color: "#9ca3af", fontSize: "12px", marginBottom: "8px" }}>Active Agents</div>
             <div style={{ fontSize: "16px", fontWeight: "600" }}>{activeAgents} <span style={{ color: "#34d399", fontSize: "12px" }}>Running</span></div>
           </div>
           <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", padding: "20px", borderRadius: "8px" }}>
             <div style={{ color: "#9ca3af", fontSize: "12px", marginBottom: "8px" }}>Tasks Progress</div>
             <div style={{ fontSize: "16px", fontWeight: "600" }}>{runningTasks} <span style={{ color: "#3b82f6", fontSize: "12px" }}>Active</span> / {completedTasks} <span style={{ color: "#34d399", fontSize: "12px" }}>Done</span></div>
           </div>
           <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", padding: "20px", borderRadius: "8px" }}>
             <div style={{ color: "#9ca3af", fontSize: "12px", marginBottom: "8px" }}>Connected Providers / Models</div>
             <div style={{ fontSize: "16px", fontWeight: "600", color: "#34d399" }}>{connectedCount} <span style={{ color: "#9ca3af", fontSize: "13px", fontWeight: "400" }}>providers</span> / {modelCount} <span style={{ color: "#9ca3af", fontSize: "13px", fontWeight: "400" }}>models</span></div>
           </div>
        </div>

        {/* Bottom Section */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
           <ResourceMonitorPanel />
           
           <div style={{ backgroundColor: "#111827", border: "1px solid #1f2937", padding: "20px", borderRadius: "8px", display: "flex", flexDirection: "column" }}>
             <h3 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "16px", color: "#f3f4f6" }}>Active Workflow State</h3>
             <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "12px", padding: "24px" }}>
               <div style={{ fontSize: "14px", color: "#9ca3af" }}>
                 Status: <span style={{ color: "#a78bfa", fontWeight: "600" }}>{workflow.state.currentStatus || "DRAFT"}</span>
               </div>
               <Link 
                 href="/jinwoo/runs/current"
                 style={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#60a5fa", padding: "8px 16px", borderRadius: "6px", fontSize: "13px", textDecoration: "none" }}
               >
                 Open Execution View →
               </Link>
             </div>
           </div>
        </div>
      </div>
  );
}
