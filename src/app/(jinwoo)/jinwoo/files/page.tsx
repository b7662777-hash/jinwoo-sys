"use client";

import React, { useState, useEffect } from "react";

export default function FilesPage() {
  const [workspace, setWorkspace] = useState("");
  const [currentPath, setCurrentPath] = useState("");
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState("");

  useEffect(() => {
    const ws = localStorage.getItem("jinwoo_active_workspace_path");
    if (ws) {
      setWorkspace(ws);
      setCurrentPath(ws);
      loadFiles(ws);
    } else {
      setLoading(false);
    }
  }, []);

  const loadFiles = async (dirPath: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/jinwoo/fs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "list", targetPath: dirPath })
      });
      const data = await res.json();
      if (data.files) {
        setFiles(data.files);
        setCurrentPath(dirPath);
        setSelectedFile(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRead = async (filePath: string) => {
    try {
      const res = await fetch("/api/jinwoo/fs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "read", targetPath: filePath })
      });
      const data = await res.json();
      if (data.content !== undefined) {
        setFileContent(data.content);
        setSelectedFile(filePath);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUp = () => {
    if (currentPath === workspace || !currentPath.startsWith(workspace)) return;
    const parts = currentPath.replace(/\\/g, "/").split("/");
    parts.pop();
    loadFiles(parts.join("/"));
  };

  if (!workspace) {
    return <div style={{ padding: "32px", color: "#9ca3af" }}>No active workspace selected. Please select one in Workspaces.</div>;
  }

  return (
    <div style={{ padding: "32px", color: "#f3f4f6", display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "600", marginBottom: "8px" }}>Workspace Explorer</h1>
        <p style={{ color: "#9ca3af", fontSize: "14px", fontFamily: "monospace" }}>{currentPath}</p>
      </div>

      <div style={{ display: "flex", gap: "24px", flex: 1, minHeight: 0 }}>
        {/* File Tree */}
        <div style={{ width: "350px", background: "#111827", border: "1px solid #1f2937", borderRadius: "12px", overflowY: "auto", padding: "16px" }}>
          {currentPath !== workspace && (
            <div 
              onClick={handleUp} 
              style={{ padding: "8px", cursor: "pointer", color: "#60a5fa", display: "flex", alignItems: "center", gap: "8px" }}>
              ← ..
            </div>
          )}
          
          {loading ? (
            <div style={{ color: "#9ca3af", padding: "8px" }}>Loading...</div>
          ) : (
            files.map((f, i) => (
              <div 
                key={i}
                onClick={() => f.isDirectory ? loadFiles(f.path) : handleRead(f.path)}
                style={{ 
                  padding: "8px", 
                  cursor: "pointer", 
                  color: f.isDirectory ? "#e5e7eb" : "#9ca3af",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  borderRadius: "6px",
                  background: selectedFile === f.path ? "#1f2937" : "transparent"
                }}>
                <span style={{ fontSize: "16px" }}>{f.isDirectory ? "📁" : "📄"}</span>
                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.name}</span>
              </div>
            ))
          )}
        </div>

        {/* File Content Viewer */}
        <div style={{ flex: 1, background: "#0b0f19", border: "1px solid #1f2937", borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {selectedFile ? (
            <>
              <div style={{ padding: "12px 16px", background: "#111827", borderBottom: "1px solid #1f2937", fontSize: "14px", color: "#e5e7eb", fontFamily: "monospace" }}>
                {selectedFile}
              </div>
              <pre style={{ margin: 0, padding: "16px", flex: 1, overflow: "auto", fontSize: "13px", color: "#d1d5db" }}>
                {fileContent}
              </pre>
            </>
          ) : (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280" }}>
              Select a file to view its contents
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
