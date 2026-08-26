"use client";

import React, { useState, useEffect } from "react";

export default function GitPage() {
  const [workspace, setWorkspace] = useState("");
  const [branch, setBranch] = useState("");
  const [status, setStatus] = useState<any[]>([]);
  const [log, setLog] = useState("");
  const [diff, setDiff] = useState("");
  const [activeTab, setActiveTab] = useState<"status" | "log" | "diff">("status");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const ws = localStorage.getItem("jinwoo_active_workspace_path");
    if (ws) {
      setWorkspace(ws);
      loadGitData(ws);
    } else {
      setLoading(false);
    }
  }, []);

  const loadGitData = async (ws: string) => {
    setLoading(true);
    setError("");
    try {
      // Get branch name
      const branchRes = await fetch("/api/jinwoo/terminal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: "git rev-parse --abbrev-ref HEAD", cwd: ws })
      });
      const branchData = await branchRes.json();
      setBranch((branchData.stdout || "").trim());

      // Get status
      const statusRes = await fetch("/api/jinwoo/git", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "status", cwd: ws })
      });
      const statusData = await statusRes.json();
      if (statusData.error) {
        setError(statusData.error);
      } else {
        setStatus(statusData.changes || []);
      }

      // Get recent log
      const logRes = await fetch("/api/jinwoo/terminal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: "git log --oneline -20", cwd: ws })
      });
      const logData = await logRes.json();
      setLog(logData.stdout || "");

      // Get diff
      const diffRes = await fetch("/api/jinwoo/git", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "diff", cwd: ws })
      });
      const diffData = await diffRes.json();
      setDiff(diffData.diff || "");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!workspace) {
    return (
      <div style={{ padding: "32px", color: "#9ca3af" }}>
        No active workspace selected. Go to <strong>Workspaces</strong> to set one.
      </div>
    );
  }

  const tabs = [
    { id: "status" as const, label: "Status", count: status.length },
    { id: "log" as const, label: "Commits" },
    { id: "diff" as const, label: "Working Diff" },
  ];

  return (
    <div style={{ padding: "32px", color: "#f3f4f6", display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "600", marginBottom: "8px" }}>Git Repository</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ color: "#9ca3af", fontSize: "14px", fontFamily: "monospace" }}>{workspace}</span>
            {branch && (
              <span style={{ background: "rgba(139, 92, 246, 0.1)", color: "#a78bfa", padding: "4px 12px", borderRadius: "999px", fontSize: "13px", fontWeight: "500" }}>
                🌿 {branch}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => loadGitData(workspace)}
          style={{ background: "#374151", color: "#fff", padding: "8px 16px", borderRadius: "6px", border: "none", cursor: "pointer" }}>
          Refresh
        </button>
      </div>

      {error && (
        <div style={{ color: "#ef4444", background: "rgba(239, 68, 68, 0.1)", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px" }}>
          {error}
        </div>
      )}

      {/* Tab bar */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "16px", background: "#111827", padding: "4px", borderRadius: "8px", width: "fit-content" }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: "8px 16px", borderRadius: "6px", border: "none", cursor: "pointer",
              background: activeTab === t.id ? "#1f2937" : "transparent",
              color: activeTab === t.id ? "#f9fafb" : "#9ca3af",
              fontWeight: activeTab === t.id ? "600" : "400",
              fontSize: "14px",
              display: "flex", alignItems: "center", gap: "8px"
            }}>
            {t.label}
            {t.count !== undefined && (
              <span style={{ background: "rgba(59, 130, 246, 0.2)", color: "#60a5fa", padding: "2px 6px", borderRadius: "4px", fontSize: "12px" }}>{t.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, background: "#0b0f19", border: "1px solid #1f2937", borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {loading ? (
          <div style={{ padding: "32px", color: "#9ca3af" }}>Loading git data...</div>
        ) : activeTab === "status" ? (
          <div style={{ padding: "16px", overflowY: "auto", flex: 1 }}>
            {status.length === 0 ? (
              <div style={{ color: "#6b7280", textAlign: "center", padding: "32px" }}>Working tree clean — no changes.</div>
            ) : (
              status.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 0", borderBottom: "1px solid #1f2937", fontSize: "14px" }}>
                  <span style={{
                    color: c.status.includes("M") ? "#fbbf24" : c.status.includes("A") || c.status.includes("?") ? "#10b981" : c.status.includes("D") ? "#ef4444" : "#9ca3af",
                    fontFamily: "monospace", fontWeight: "bold", width: "24px", textAlign: "center"
                  }}>
                    {c.status.trim()}
                  </span>
                  <span style={{ color: "#e5e7eb" }}>{c.file}</span>
                </div>
              ))
            )}
          </div>
        ) : activeTab === "log" ? (
          <pre style={{ margin: 0, padding: "16px", flex: 1, overflow: "auto", fontSize: "13px", fontFamily: "monospace", color: "#d1d5db", whiteSpace: "pre-wrap" }}>
            {log || "No commits found."}
          </pre>
        ) : (
          <pre style={{ margin: 0, padding: "16px", flex: 1, overflow: "auto", fontSize: "13px", fontFamily: "monospace", color: "#d1d5db", whiteSpace: "pre-wrap" }}>
            {diff || "No uncommitted diff."}
          </pre>
        )}
      </div>
    </div>
  );
}
