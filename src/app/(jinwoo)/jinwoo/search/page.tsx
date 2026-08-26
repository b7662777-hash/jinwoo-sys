"use client";

import React, { useState, useEffect } from "react";

export default function SearchPage() {
  const [workspace, setWorkspace] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const ws = localStorage.getItem("jinwoo_active_workspace_path");
    if (ws) setWorkspace(ws);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !workspace || searching) return;
    
    setSearching(true);
    try {
      // Use findstr for Windows
      const res = await fetch("/api/jinwoo/terminal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: `findstr /s /i /n "${query}" *.*`, cwd: workspace })
      });
      const data = await res.json();
      setResults(data.stdout || data.stderr || "No matches found.");
    } catch (err: any) {
      setResults("Error: " + err.message);
    } finally {
      setSearching(false);
    }
  };

  if (!workspace) return <div style={{ padding: "32px", color: "#9ca3af" }}>No active workspace selected.</div>;

  return (
    <div style={{ padding: "32px", color: "#f3f4f6", display: "flex", flexDirection: "column", height: "100%" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "600", marginBottom: "8px" }}>Global Workspace Search</h1>
      <p style={{ color: "#9ca3af", fontSize: "14px", fontFamily: "monospace", marginBottom: "24px" }}>Searching in: {workspace}</p>

      <form onSubmit={handleSearch} style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        <input 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search text..."
          style={{ flex: 1, background: "#111827", border: "1px solid #374151", color: "#fff", padding: "12px 16px", borderRadius: "8px", fontSize: "15px", outline: "none" }}
        />
        <button 
          disabled={searching}
          style={{ background: "#3b82f6", color: "#fff", padding: "0 24px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "600" }}>
          {searching ? "Searching..." : "Search"}
        </button>
      </form>

      <div style={{ flex: 1, background: "#0b0f19", border: "1px solid #1f2937", borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "12px 16px", background: "#111827", borderBottom: "1px solid #1f2937", fontSize: "14px", color: "#e5e7eb", fontWeight: "600" }}>
          Search Results
        </div>
        <pre style={{ margin: 0, padding: "16px", flex: 1, overflow: "auto", fontSize: "13px", fontFamily: "monospace", color: "#d1d5db", whiteSpace: "pre-wrap" }}>
          {results}
        </pre>
      </div>
    </div>
  );
}
