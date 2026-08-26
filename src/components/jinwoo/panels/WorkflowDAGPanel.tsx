"use client";

import React, { useMemo } from "react";
import { useJinwooWorkspace } from "@/app/(jinwoo)/jinwoo/context";

export function WorkflowDAGPanel() {
  const { state } = useJinwooWorkspace();
  const tasks = state.plan?.tasks || [];
  const deps = state.plan?.dependencies || [];

  // Active agents array for live status
  const activeAgents = state.activeAgents || [];

  // Group tasks by layer for DAG rendering
  const layers = useMemo(() => {
    const taskMap = new Map();
    tasks.forEach(t => taskMap.set(t.id, { ...t, layer: 0, dependsOn: [] }));
    deps.forEach(d => {
      if (taskMap.has(d.taskId)) {
        taskMap.get(d.taskId).dependsOn.push(d.dependsOnTaskId);
      }
    });

    let changed = true;
    while (changed) {
      changed = false;
      for (const [id, task] of taskMap.entries()) {
        let maxDepLayer = -1;
        for (const depId of task.dependsOn) {
          const depTask = taskMap.get(depId);
          if (depTask && depTask.layer > maxDepLayer) {
            maxDepLayer = depTask.layer;
          }
        }
        if (task.layer <= maxDepLayer) {
          task.layer = maxDepLayer + 1;
          changed = true;
        }
      }
    }

    const maxLayer = Math.max(0, ...Array.from(taskMap.values()).map(t => t.layer));
    const grouped = [];
    for (let i = 0; i <= maxLayer; i++) {
      grouped.push(Array.from(taskMap.values()).filter(t => t.layer === i));
    }
    return grouped;
  }, [tasks, deps]);

  if (!tasks.length) return null;

  return (
    <div style={{ border: "1px solid #1f2937", borderRadius: "12px", background: "#0D111C", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #1f2937" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "24px", height: "24px", borderRadius: "6px", backgroundColor: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "14px" }}>🔄</span>
          </div>
          <div>
            <div style={{ fontWeight: "600", fontSize: "16px", color: "#f3f4f6" }}>Workflow Plan</div>
            <div style={{ fontSize: "12px", color: "#9ca3af" }}>AI-generated execution plan with dependencies</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <select style={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "white", padding: "4px 12px", borderRadius: "4px", fontSize: "12px" }}>
            <option>View: Graph</option>
          </select>
          <button style={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "white", padding: "4px 12px", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}>+ Add Task</button>
        </div>
      </div>

      {/* Graph Area */}
      <div style={{ padding: "32px", overflowX: "auto", display: "flex", gap: "48px", alignItems: "center", position: "relative", minHeight: "300px", background: "radial-gradient(circle at center, #111827 0%, #0D111C 100%)" }}>
        {layers.map((layer, layerIdx) => (
          <div key={layerIdx} style={{ display: "flex", flexDirection: "column", gap: "24px", position: "relative" }}>
            {layer.map((task, taskIdx) => {
              
              // Determine live status
              const agentState = state.agents && state.agents[task.role];
              const isActive = activeAgents.includes(task.role);
              
              let statusColor = "#4b5563"; // default (Ready)
              let statusText = "Ready";
              
              if (agentState) {
                if (agentState.status === "WORKING" || agentState.status === "THINKING") {
                  statusColor = "#3b82f6";
                  statusText = "In Progress";
                } else if (agentState.status === "COMPLETED") {
                  statusColor = "#10b981";
                  statusText = "Completed";
                } else if (agentState.status === "FAILED") {
                  statusColor = "#ef4444";
                  statusText = "Failed";
                }
              }

              return (
                <div key={task.id} style={{
                  width: "200px",
                  border: `1px solid ${statusColor}`,
                  borderRadius: "8px",
                  background: "rgba(17, 24, 39, 0.8)",
                  padding: "16px",
                  boxShadow: `0 4px 12px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(255,255,255,0.05)`,
                  position: "relative",
                  zIndex: 2
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                    <div style={{ width: "20px", height: "20px", borderRadius: "4px", background: statusColor, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "11px", fontWeight: "bold" }}>
                      {task.id.split('_').pop() || (taskIdx+1)}
                    </div>
                    <div style={{ fontWeight: "600", fontSize: "14px", color: "#f3f4f6", textTransform: "capitalize" }}>{task.role}</div>
                  </div>
                  <div style={{ fontSize: "12px", color: "#9ca3af", lineHeight: "1.4", marginBottom: "8px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {task.objective}
                  </div>
                  <div style={{ fontSize: "11px", color: "#6b7280", marginBottom: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ color: "#34d399", fontSize: "10px" }}>OmniRoute</span>
                    <span>➔</span>
                    <span style={{ color: "#60a5fa", fontSize: "10px" }}>{task.recommendedProvider || task.provider || "Provider"}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", color: "#6b7280" }}>
                    <span style={{ color: "#a78bfa", fontFamily: "monospace", fontSize: "10px", backgroundColor: "rgba(167, 139, 250, 0.1)", padding: "1px 6px", borderRadius: "3px", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {task.recommendedModel || task.model || "Default"}
                    </span>
                    <span>{statusText}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        {/* We would draw lines here for a real DAG, but flex gap layout approximates it visually well enough for this iteration. */}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px 20px", borderTop: "1px solid #1f2937", backgroundColor: "#111827" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#9ca3af" }}><span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }}></span> Completed</div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#9ca3af" }}><span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3b82f6" }}></span> In Progress</div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#9ca3af" }}><span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4b5563" }}></span> Ready</div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#9ca3af" }}><span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444" }}></span> Blocked</div>
      </div>
    </div>
  );
}
