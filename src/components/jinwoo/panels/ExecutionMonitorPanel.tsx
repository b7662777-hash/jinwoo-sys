"use client";

import React, { useEffect, useRef } from "react";
import { useJinwooWorkspace } from "@/app/(jinwoo)/jinwoo/context";

export function ExecutionMonitorPanel() {
  const { state } = useJinwooWorkspace();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.messages]);

  if (!state.isRunning && state.currentStatus !== "COMPLETED") return null;

  return (
    <div style={{ border: "1px solid #1f2937", borderRadius: "12px", background: "#0D111C", overflow: "hidden", display: "flex", flexDirection: "column", height: "400px", marginTop: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px 20px", borderBottom: "1px solid #1f2937" }}>
        <div style={{ width: "24px", height: "24px", borderRadius: "6px", backgroundColor: "#10b981", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: "14px" }}>▶</span>
        </div>
        <div>
          <div style={{ fontWeight: "600", fontSize: "16px", color: "#f3f4f6" }}>Live Execution & AI Communication</div>
          <div style={{ fontSize: "12px", color: "#9ca3af" }}>Real-time agent activity, workspace changes, and inter-agent messages</div>
        </div>
      </div>

      <div ref={scrollRef} style={{ padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px", flex: 1, backgroundColor: "#0b0f19" }}>
        {state.messages.map((msg: any) => {
          
          if (msg.type === "handoff") {
            return (
              <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "16px 0" }}>
                <div style={{ padding: "8px 16px", borderRadius: "24px", backgroundColor: "rgba(124, 58, 237, 0.15)", border: "1px solid rgba(124, 58, 237, 0.3)", color: "#a78bfa", fontSize: "12px", fontWeight: "600" }}>
                  {msg.agentId.toUpperCase()} → {msg.metadata?.to?.toUpperCase()}
                </div>
                <div style={{ color: "#d1d5db", fontSize: "13px", marginTop: "8px", fontStyle: "italic", textAlign: "center", maxWidth: "80%" }}>
                  "{msg.content.replace(/^HANDED OFF TO [^:]+:\s*/, '')}"
                </div>
              </div>
            );
          }

          if (msg.type === "file_change") {
            return (
              <div key={msg.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 12px", backgroundColor: "rgba(59, 130, 246, 0.05)", borderLeft: "3px solid #3b82f6", borderRadius: "0 8px 8px 0" }}>
                <span style={{ fontSize: "14px" }}>📄</span>
                <span style={{ color: "#9ca3af", fontSize: "12px", fontWeight: "600" }}>{msg.agentId}</span>
                <span style={{ color: "#d1d5db", fontSize: "13px" }}>{msg.content}</span>
              </div>
            );
          }

          if (msg.type === "tool_call") {
             return (
              <div key={msg.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 12px", backgroundColor: "rgba(107, 114, 128, 0.1)", borderRadius: "8px" }}>
                <span style={{ fontSize: "14px" }}>🔧</span>
                <span style={{ color: "#9ca3af", fontSize: "12px", fontWeight: "600" }}>{msg.agentId}</span>
                <span style={{ color: "#9ca3af", fontSize: "13px", fontFamily: "monospace" }}>{msg.content}</span>
              </div>
            );
          }

          if (msg.type === "system") {
            return (
              <div key={msg.id} style={{ display: "flex", justifyContent: "center", padding: "12px" }}>
                <span style={{ backgroundColor: "#1f2937", color: "#d1d5db", padding: "4px 12px", borderRadius: "16px", fontSize: "11px" }}>{msg.content}</span>
              </div>
            );
          }

          // text / model_stream / agent_message
          const agentInfo = state.agents[msg.agentId];
          return (
            <div key={msg.id} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ color: "#a78bfa", fontSize: "11px", fontWeight: "600", textTransform: "capitalize" }}>{msg.agentId}</span>
                {agentInfo && agentInfo.provider !== "Unknown" && (
                  <span style={{ fontSize: "10px", color: "#9ca3af", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: "1px 6px", borderRadius: "3px" }}>
                    <span style={{ color: "#34d399" }}>OmniRoute</span> ➔ <span style={{ color: "#60a5fa" }}>{agentInfo.provider}</span> ({agentInfo.model})
                  </span>
                )}
                {msg.metadata?.reason && (
                  <span style={{ color: "#34d399", fontSize: "10px", backgroundColor: "rgba(52,211,153,0.1)", padding: "1px 6px", borderRadius: "4px" }}>
                    {msg.metadata.reason}
                  </span>
                )}
              </div>
              <div style={{ color: "#f3f4f6", fontSize: "13px", lineHeight: "1.5", padding: "12px", backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "0 8px 8px 8px", maxWidth: "85%" }}>
                {msg.content}
              </div>
            </div>
          );
        })}
        {state.messages.length === 0 && (
          <div style={{ color: "#6b7280", textAlign: "center", marginTop: "40px", fontSize: "13px" }}>Awaiting execution events...</div>
        )}
      </div>
    </div>
  );
}
