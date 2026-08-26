"use client";

import React, { useState, useEffect } from "react";

export default function ChangesPage() {
  const [workspace, setWorkspace] = useState("");
  const [changes, setChanges] = useState<any[]>([]);
  const [diff, setDiff] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const ws = localStorage.getItem("jinwoo_active_workspace_path");
    if (ws) {
      setWorkspace(ws);
      loadGit(ws);
    } else {
      setLoading(false);
    }
  }, []);

  const loadGit = async (ws: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/jinwoo/git", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "status", cwd: ws })
      });
      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setChanges(data.changes || []);
        
        // Also fetch diff
        const diffRes = await fetch("/api/jinwoo/git", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "diff", cwd: ws })
        });
        const diffData = await diffRes.json();
        setDiff(diffData.diff || "");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!workspace) return <div style={{ padding: "32px", color: "#9ca3af" }}>No active workspace selected.</div>;

  return (
    <div style={{ padding: "32px", color: "#f3f4f6", display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "600", marginBottom: "8px" }}>Source Control Changes</h1>
          <p style={{ color: "#9ca3af", fontSize: "14px", fontFamily: "monospace" }}>{workspace}</p>
        </div>
        <button 
          onClick={() => loadGit(workspace)}
          style={{ background: "#374151", color: "#fff", padding: "8px 16px", borderRadius: "6px", border: "none", cursor: "pointer" }}>
          Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ color: "#9ca3af" }}>Loading git status...</div>
      ) : error ? (
        <div style={{ color: "#ef4444", background: "rgba(239, 68, 68, 0.1)", padding: "16px", borderRadius: "8px" }}>
          {error}
        </div>
      ) : (
        <div style={{ display: "flex", gap: "24px", flex: 1, minHeight: 0 }}>
          <div style={{ width: "300px", background: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "16px", overflowY: "auto" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#9ca3af", marginBottom: "16px", textTransform: "uppercase" }}>Changed Files ({changes.length})</h3>
            {changes.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px", fontSize: "13px" }}>
                <span style={{ color: c.status.includes("M") ? "#fbbf24" : c.status.includes("A") || c.status.includes("?") ? "#10b981" : "#ef4444", fontFamily: "monospace", fontWeight: "bold" }}>
                  {c.status}
                </span>
                <span style={{ color: "#e5e7eb", wordBreak: "break-all" }}>{c.file}</span>
              </div>
            ))}
            {changes.length === 0 && <div style={{ color: "#6b7280", fontSize: "13px" }}>No changes detected.</div>}
          </div>
          
          <div style={{ flex: 1, background: "#0b0f19", border: "1px solid #1f2937", borderRadius: "12px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
             <div style={{ padding: "12px 16px", background: "#111827", borderBottom: "1px solid #1f2937", fontSize: "14px", color: "#e5e7eb", fontWeight: "600" }}>
               Working Tree Diff
             </div>
             <pre style={{ margin: 0, padding: "16px", flex: 1, overflow: "auto", fontSize: "13px", fontFamily: "monospace", color: "#d1d5db", whiteSpace: "pre-wrap" }}>
               {diff || "No diff output."}
             </pre>
          </div>
        </div>
      )}
    </div>
  );
}
