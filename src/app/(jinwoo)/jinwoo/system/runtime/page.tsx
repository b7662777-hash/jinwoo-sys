"use client";

import React, { useState } from "react";

export default function SystemRuntimePage() {
  const [runtimeInfo, setRuntimeInfo] = useState({
    nodeVersion: "v20.x (Node.js)",
    platform: "Windows 64-bit (win32)",
    processId: "Active (Next.js Server)",
    memoryUsage: "142 MB RSS",
    dbEngine: "better-sqlite3 (data/jinwoo_state.sqlite)"
  });

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>⚙️</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>System Runtime Environment</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Host operating system, Node runtime, SQLite storage engine, and memory usage.
          </p>
        </div>
      </div>

      <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column", gap: "14px", fontSize: "13px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #1f2937", paddingBottom: "10px" }}>
          <span style={{ color: "#9ca3af" }}>Node.js Version:</span>
          <strong style={{ color: "#f3f4f6" }}>{runtimeInfo.nodeVersion}</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #1f2937", paddingBottom: "10px" }}>
          <span style={{ color: "#9ca3af" }}>Operating System:</span>
          <strong style={{ color: "#f3f4f6" }}>{runtimeInfo.platform}</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #1f2937", paddingBottom: "10px" }}>
          <span style={{ color: "#9ca3af" }}>Memory Footprint:</span>
          <strong style={{ color: "#34d399" }}>{runtimeInfo.memoryUsage}</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#9ca3af" }}>Persistence Engine:</span>
          <strong style={{ color: "#60a5fa" }}>{runtimeInfo.dbEngine}</strong>
        </div>
      </div>
    </div>
  );
}
