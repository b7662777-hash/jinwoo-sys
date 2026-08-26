"use client";

import React, { useState, useEffect, useRef } from "react";

export default function TerminalPage() {
  const [workspace, setWorkspace] = useState("");
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [running, setRunning] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ws = localStorage.getItem("jinwoo_active_workspace_path");
    if (ws) setWorkspace(ws);
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history]);

  const handleRun = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() || running) return;
    
    const cmd = command;
    setCommand("");
    setRunning(true);
    
    setHistory(prev => [...prev, { type: "input", content: `> ${cmd}` }]);
    
    try {
      const res = await fetch("/api/jinwoo/terminal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: cmd, cwd: workspace })
      });
      const data = await res.json();
      
      if (data.error) {
        setHistory(prev => [...prev, { type: "error", content: data.error }]);
      } else {
        if (data.stdout) setHistory(prev => [...prev, { type: "output", content: data.stdout }]);
        if (data.stderr) setHistory(prev => [...prev, { type: "error", content: data.stderr }]);
        setHistory(prev => [...prev, { type: "system", content: `Exited with ${data.exitCode} in ${data.duration}ms` }]);
      }
    } catch (err: any) {
      setHistory(prev => [...prev, { type: "error", content: "Failed to execute: " + err.message }]);
    } finally {
      setRunning(false);
    }
  };

  if (!workspace) {
    return <div style={{ padding: "32px", color: "#9ca3af" }}>No active workspace selected. Please select one in Workspaces.</div>;
  }

  return (
    <div style={{ padding: "32px", color: "#f3f4f6", display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "600", marginBottom: "8px" }}>Terminal</h1>
        <p style={{ color: "#9ca3af", fontSize: "14px", fontFamily: "monospace" }}>Executing in: {workspace}</p>
      </div>

      <div style={{ flex: 1, background: "#0b0f19", border: "1px solid #1f2937", borderRadius: "12px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px", fontFamily: "monospace", fontSize: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {history.map((h, i) => (
            <div key={i} style={{ 
              color: h.type === "error" ? "#ef4444" : h.type === "system" ? "#6b7280" : h.type === "input" ? "#60a5fa" : "#d1d5db",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all"
            }}>
              {h.content}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        
        <form onSubmit={handleRun} style={{ display: "flex", padding: "12px", background: "#111827", borderTop: "1px solid #1f2937" }}>
          <span style={{ color: "#60a5fa", padding: "8px 12px 8px 8px", fontFamily: "monospace" }}>&gt;</span>
          <input
            value={command}
            onChange={e => setCommand(e.target.value)}
            disabled={running}
            placeholder={running ? "Executing..." : "Enter command..."}
            style={{ flex: 1, background: "transparent", border: "none", color: "#fff", outline: "none", fontFamily: "monospace", fontSize: "14px" }}
            autoFocus
          />
        </form>
      </div>
    </div>
  );
}
