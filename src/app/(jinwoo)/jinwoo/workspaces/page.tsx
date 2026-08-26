"use client";

import React, { useEffect, useState, useRef } from "react";

export default function WorkspacesPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPath, setNewPath] = useState("");
  const [newName, setNewName] = useState("");
  const [browsing, setBrowsing] = useState(false);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);
  
  // Visual directory tree browser state
  const [explorerDir, setExplorerDir] = useState<string>("");
  const [explorerList, setExplorerList] = useState<{ name: string; path: string }[]>([]);
  const [explorerParent, setExplorerParent] = useState<string | null>(null);
  const [explorerLoading, setExplorerLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProjects();
    const active = localStorage.getItem("jinwoo_active_workspace");
    if (active) setActiveWorkspaceId(active);
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/jinwoo/projects");
      const data = await res.json();
      if (data.projects) {
        setProjects(data.projects);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWorkspace = async () => {
    if (!newPath.trim()) return;
    const finalName = newName.trim() || newPath.split(/[\\/]/).filter(Boolean).pop() || "My Workspace";
    try {
      const res = await fetch("/api/jinwoo/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: finalName, workspacePath: newPath.trim() })
      });
      const data = await res.json();
      if (data.error) {
        alert("Error: " + data.error);
        return;
      }
      setShowAddModal(false);
      setNewPath("");
      setNewName("");
      fetchProjects();
    } catch (err) {
      alert("Failed to add workspace.");
    }
  };

  const handleDeleteWorkspace = async (id: string) => {
    if (!confirm("Are you sure you want to remove this workspace from Jinwoo?")) return;
    try {
      const res = await fetch(`/api/jinwoo/projects?id=${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        if (activeWorkspaceId === id) {
          setActiveWorkspaceId(null);
          localStorage.removeItem("jinwoo_active_workspace");
          localStorage.removeItem("jinwoo_active_workspace_path");
          window.dispatchEvent(new Event("jinwoo_workspace_changed"));
        }
        fetchProjects();
      } else {
        alert(data.error || "Failed to remove workspace.");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete workspace.");
    }
  };

  const handleSetActive = (id: string, path: string) => {
    setActiveWorkspaceId(id);
    localStorage.setItem("jinwoo_active_workspace", id);
    localStorage.setItem("jinwoo_active_workspace_path", path);
    window.dispatchEvent(new Event("jinwoo_workspace_changed"));
  };

  const loadExplorer = async (dir: string = "") => {
    setExplorerLoading(true);
    try {
      const res = await fetch(`/api/jinwoo/fs/browse?dir=${encodeURIComponent(dir)}`);
      const data = await res.json();
      if (data.directories) {
        setExplorerList(data.directories);
        setExplorerDir(data.current || "");
        setExplorerParent(data.parent);
      }
    } catch (e) {
      console.error("Failed to load explorer:", e);
    } finally {
      setExplorerLoading(false);
    }
  };

  const handleBrowse = async () => {
    setBrowsing(true);
    try {
      // 1. Try Browser-native Directory Picker API
      if (typeof window !== "undefined" && "showDirectoryPicker" in window) {
        try {
          const dirHandle = await (window as any).showDirectoryPicker();
          if (dirHandle && dirHandle.name) {
            if (!newName) setNewName(dirHandle.name);
            setNewPath(`C:\\Projects\\${dirHandle.name}`);
            setBrowsing(false);
            return;
          }
        } catch (pickerErr: any) {
          if (pickerErr.name === "AbortError") {
            setBrowsing(false);
            return;
          }
        }
      }

      // 2. Try OS dialog API
      const res = await fetch("/api/jinwoo/dialog/folder", { method: "POST" });
      const data = await res.json();
      if (data.path) {
        setNewPath(data.path);
        if (!newName) {
          const folderName = data.path.split(/[\\/]/).filter(Boolean).pop();
          if (folderName) setNewName(folderName);
        }
        setBrowsing(false);
        return;
      }
    } catch (err) {
      console.error("Browse error:", err);
    } finally {
      setBrowsing(false);
    }

    loadExplorer(explorerDir || "C:\\");
  };

  return (
    <div style={{ padding: "32px", color: "#f3f4f6", minHeight: "100%", background: "#0b0f19" }}>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        {...({ webkitdirectory: "", directory: "" } as any)}
        onChange={(e) => {
          const files = e.target.files;
          if (files && files.length > 0) {
            const rel = (files[0] as any).webkitRelativePath || "";
            const root = rel.split("/")[0];
            if (root) {
              if (!newName) setNewName(root);
              setNewPath(`C:\\Projects\\${root}`);
            }
          }
        }}
      />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "600", marginBottom: "8px", letterSpacing: "-0.02em" }}>Workspaces</h1>
          <p style={{ color: "#9ca3af", fontSize: "14px" }}>Manage your local project environments across C:, D:, and R: drives.</p>
        </div>
        <button 
          onClick={() => {
            setShowAddModal(true);
            const initialPath = typeof window !== "undefined" && localStorage.getItem("jinwoo_current_workspace") ? localStorage.getItem("jinwoo_current_workspace")! : ".";
            loadExplorer(initialPath);
          }}
          style={{ 
            background: "#3b82f6", color: "#fff", padding: "8px 16px", borderRadius: "6px", 
            border: "none", cursor: "pointer", fontWeight: "600", fontSize: "14px",
            boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)"
          }}>
          + Add Local Workspace
        </button>
      </div>

      {loading ? (
        <div style={{ color: "#9ca3af" }}>Loading workspaces...</div>
      ) : projects.length === 0 ? (
        <div style={{ 
          padding: "64px 32px", border: "1px dashed #374151", borderRadius: "12px", 
          textAlign: "center", background: "#111827", color: "#9ca3af" 
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📁</div>
          <h2 style={{ fontSize: "18px", fontWeight: "500", marginBottom: "8px", color: "#e5e7eb" }}>No Workspaces Configured</h2>
          <p>Add a local folder path to begin using Jinwoo Sys.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "24px" }}>
          {projects.map((p) => {
            const isActive = activeWorkspaceId === p.id;
            return (
              <div key={p.id} style={{ 
                background: "#111827", 
                border: isActive ? "1px solid #3b82f6" : "1px solid #1f2937", 
                borderRadius: "12px", 
                padding: "20px",
                position: "relative",
                transition: "all 0.2s ease",
                boxShadow: isActive ? "0 0 20px rgba(59, 130, 246, 0.1)" : "none"
              }}>
                {isActive && (
                  <div style={{ position: "absolute", top: "20px", right: "20px" }}>
                    <span style={{ background: "rgba(59, 130, 246, 0.1)", color: "#60a5fa", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "500" }}>ACTIVE</span>
                  </div>
                )}
                <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#f9fafb", marginBottom: "8px" }}>{p.name}</h3>
                <div style={{ color: "#9ca3af", fontSize: "13px", fontFamily: "monospace", background: "#030712", padding: "8px", borderRadius: "6px", marginBottom: "16px", wordBreak: "break-all" }}>
                  {p.workspacePath}
                </div>
                
                <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                  {!isActive && (
                    <button 
                      onClick={() => handleSetActive(p.id, p.workspacePath)}
                      style={{ background: "#2563eb", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: "500", flex: 1 }}>
                      Set Active
                    </button>
                  )}
                  {isActive && (
                    <button style={{ background: "#1f2937", color: "#9ca3af", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "default", fontSize: "13px", fontWeight: "500", flex: 1 }}>
                      Currently Active
                    </button>
                  )}
                  <button 
                    onClick={() => handleDeleteWorkspace(p.id)}
                    style={{ background: "transparent", color: "#ef4444", border: "1px solid #374151", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: "500" }}>
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showAddModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#111827", padding: "28px", borderRadius: "12px", width: "560px", maxHeight: "90vh", overflowY: "auto", border: "1px solid #374151", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "20px", color: "#f3f4f6" }}>Add Local Workspace</h2>
            
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", fontWeight: "600", color: "#9ca3af" }}>WORKSPACE NAME</label>
              <input 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. My Project"
                style={{ width: "100%", background: "#030712", border: "1px solid #374151", color: "#fff", padding: "8px 12px", borderRadius: "6px", outline: "none", fontSize: "13px" }}
              />
            </div>
            
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", fontWeight: "600", color: "#9ca3af" }}>ABSOLUTE DIRECTORY PATH</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input 
                  value={newPath} 
                  onChange={(e) => setNewPath(e.target.value)}
                  placeholder="e.g. C:\Projects\MyWeb or D:\Code or R:\Jinwoo Sys"
                  style={{ flex: 1, background: "#030712", border: "1px solid #374151", color: "#60a5fa", padding: "8px 12px", borderRadius: "6px", outline: "none", fontFamily: "monospace", fontSize: "12px" }}
                />
                <button 
                  onClick={handleBrowse}
                  disabled={browsing}
                  style={{ 
                    background: browsing ? "#374151" : "#2563eb", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "6px", 
                    padding: "0 16px", 
                    cursor: browsing ? "not-allowed" : "pointer", 
                    fontWeight: "600", 
                    fontSize: "13px",
                    whiteSpace: "nowrap"
                  }}>
                  {browsing ? "Opening..." : "Browse..."}
                </button>
              </div>
            </div>

            {/* Quick Drive Switcher Tabs */}
            <div style={{ marginBottom: "14px", backgroundColor: "#0D111C", padding: "10px", borderRadius: "8px", border: "1px solid #1f2937" }}>
              <div style={{ color: "#6b7280", fontSize: "11px", fontWeight: "600", marginBottom: "6px" }}>DRIVES & QUICK PRESETS:</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {[
                  { label: "💽 C:\\ Drive", path: "C:\\" },
                  { label: "💽 D:\\ Drive", path: "D:\\" },
                  { label: "📁 Current Directory", path: "." }
                ].map((s) => (
                  <button
                    key={s.path}
                    type="button"
                    onClick={() => {
                      loadExplorer(s.path);
                      setNewPath(s.path);
                      if (!newName) {
                        const name = s.path.split("\\").filter(Boolean).pop();
                        if (name) setNewName(name);
                      }
                    }}
                    style={{
                      background: explorerDir.startsWith(s.path) ? "rgba(59, 130, 246, 0.2)" : "#1f2937",
                      border: `1px solid ${explorerDir.startsWith(s.path) ? "#3b82f6" : "#374151"}`,
                      color: "#60a5fa",
                      fontSize: "11px",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontFamily: "monospace"
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Directory Tree Explorer */}
            <div style={{ marginBottom: "20px", backgroundColor: "#0D111C", padding: "12px", borderRadius: "8px", border: "1px solid #1f2937" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ color: "#9ca3af", fontSize: "12px", fontWeight: "600" }}>📁 FOLDER EXPLORER</span>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    type="button"
                    onClick={() => loadExplorer("")}
                    style={{ background: "#1f2937", color: "#60a5fa", border: "1px solid #374151", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", cursor: "pointer" }}
                  >
                    💽 All Drives
                  </button>
                  {explorerParent !== null && (
                    <button
                      type="button"
                      onClick={() => loadExplorer(explorerParent || "")}
                      style={{ background: "#1f2937", color: "#a78bfa", border: "1px solid #374151", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", cursor: "pointer" }}
                    >
                      ⬆ Up
                    </button>
                  )}
                </div>
              </div>
              
              <div style={{ fontSize: "11px", color: "#6b7280", fontFamily: "monospace", marginBottom: "6px", wordBreak: "break-all" }}>
                Current: <strong style={{ color: "#34d399" }}>{explorerDir || "(Select a Drive)"}</strong>
              </div>

              {explorerLoading ? (
                <div style={{ padding: "16px", textAlign: "center", color: "#6b7280", fontSize: "12px" }}>Loading folders...</div>
              ) : (
                <div style={{ maxHeight: "150px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "4px" }}>
                  {explorerList.length === 0 ? (
                    <div style={{ padding: "12px", textAlign: "center", color: "#6b7280", fontSize: "12px" }}>No subdirectories found.</div>
                  ) : (
                    explorerList.map((d) => (
                      <div
                        key={d.path}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          backgroundColor: "#111827",
                          padding: "5px 8px",
                          borderRadius: "4px",
                          fontSize: "12px"
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => loadExplorer(d.path)}
                          style={{ background: "none", border: "none", color: "#f3f4f6", cursor: "pointer", textAlign: "left", flex: 1, padding: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                        >
                          📁 {d.name}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNewPath(d.path);
                            if (!newName) {
                              const name = d.name.replace(/[^a-zA-Z0-9_\-]/g, "");
                              if (name) setNewName(name);
                            }
                          }}
                          style={{
                            backgroundColor: "rgba(59, 130, 246, 0.15)",
                            color: "#60a5fa",
                            border: "1px solid rgba(59, 130, 246, 0.3)",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            fontSize: "11px",
                            fontWeight: "600",
                            cursor: "pointer"
                          }}
                        >
                          Select
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button onClick={() => setShowAddModal(false)} style={{ background: "transparent", color: "#9ca3af", border: "none", cursor: "pointer", padding: "8px 16px" }}>Cancel</button>
              <button onClick={handleAddWorkspace} style={{ background: "#3b82f6", color: "#fff", border: "none", cursor: "pointer", padding: "8px 18px", borderRadius: "6px", fontWeight: "600" }}>Add Workspace</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
