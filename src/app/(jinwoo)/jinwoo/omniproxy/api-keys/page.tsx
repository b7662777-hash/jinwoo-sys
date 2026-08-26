"use client";

import React, { useState, useEffect } from "react";

export default function OmniProxyApiKeysPage() {
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const res = await fetch("/api/keys");
      const data = await res.json();
      if (Array.isArray(data)) setKeys(data);
      else if (data.keys) setKeys(data.keys);
    } catch (e) {
      console.error("Failed to load API keys:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKey = async () => {
    if (!keyName.trim()) return;
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: keyName.trim() })
      });
      const data = await res.json();
      if (data.key || data.apiKey || data.token) {
        setNewlyCreatedKey(data.key || data.apiKey || data.token);
      }
      setKeyName("");
      fetchKeys();
    } catch (e) {
      console.error("Failed to create key:", e);
    }
  };

  const handleDeleteKey = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this API key?")) return;
    try {
      await fetch(`/api/keys?id=${id}`, { method: "DELETE" });
      fetchKeys();
    } catch (e) {
      console.error("Failed to delete key:", e);
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🔑</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>OmniProxy API Keys</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Manage client bearer tokens and authentication keys for accessing OmniProxy gateway endpoints.
          </p>
        </div>

        <button
          onClick={() => { setShowCreateModal(true); setNewlyCreatedKey(null); }}
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 0 15px rgba(37, 99, 235, 0.3)"
          }}
        >
          + Create New API Key
        </button>
      </div>

      {loading ? (
        <div style={{ color: "#9ca3af" }}>Loading API keys...</div>
      ) : keys.length === 0 ? (
        <div style={{ padding: "64px 32px", border: "1px dashed #374151", borderRadius: "12px", textAlign: "center", backgroundColor: "#0D111C" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔑</div>
          <h3 style={{ fontSize: "16px", color: "#f3f4f6", marginBottom: "6px" }}>No API Keys Generated</h3>
          <p style={{ color: "#9ca3af", fontSize: "13px", margin: 0 }}>Create an API key to securely connect external coding assistants, tools, and scripts.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {keys.map((k) => (
            <div
              key={k.id}
              style={{
                backgroundColor: "#0D111C",
                border: "1px solid #1f2937",
                borderRadius: "10px",
                padding: "16px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                <strong style={{ color: "#f3f4f6", fontSize: "14px", display: "block" }}>{k.name || "Default Key"}</strong>
                <span style={{ color: "#6b7280", fontSize: "12px", fontFamily: "monospace" }}>
                  {k.key ? `${k.key.substring(0, 10)}...` : k.id}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{ color: "#9ca3af", fontSize: "12px" }}>
                  Created: {new Date(k.createdAt || Date.now()).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleDeleteKey(k.id)}
                  style={{
                    backgroundColor: "transparent",
                    color: "#f87171",
                    border: "1px solid #374151",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    cursor: "pointer"
                  }}
                >
                  Revoke
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showCreateModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ backgroundColor: "#111827", border: "1px solid #374151", padding: "28px", borderRadius: "12px", width: "480px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#f3f4f6", marginBottom: "16px" }}>Create New API Key</h3>

            {newlyCreatedKey ? (
              <div>
                <p style={{ color: "#34d399", fontSize: "13px", marginBottom: "8px" }}>✓ Key generated successfully! Copy it now as it won&apos;t be shown again:</p>
                <div style={{ backgroundColor: "#030712", padding: "10px", borderRadius: "6px", border: "1px solid #374151", fontFamily: "monospace", fontSize: "12px", color: "#60a5fa", wordBreak: "break-all", marginBottom: "16px" }}>
                  {newlyCreatedKey}
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button onClick={() => setShowCreateModal(false)} style={{ backgroundColor: "#2563eb", color: "white", border: "none", padding: "6px 16px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}>Done</button>
                </div>
              </div>
            ) : (
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#9ca3af", marginBottom: "6px" }}>KEY NAME / DESCRIPTION</label>
                <input
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  placeholder="e.g. Cursor IDE, OpenCode, CI Bot"
                  style={{ width: "100%", backgroundColor: "#030712", border: "1px solid #374151", color: "#f3f4f6", padding: "8px 12px", borderRadius: "6px", fontSize: "13px", outline: "none", marginBottom: "20px" }}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                  <button onClick={() => setShowCreateModal(false)} style={{ backgroundColor: "transparent", color: "#9ca3af", border: "none", padding: "6px 12px", cursor: "pointer", fontSize: "13px" }}>Cancel</button>
                  <button onClick={handleCreateKey} style={{ backgroundColor: "#2563eb", color: "white", border: "none", padding: "6px 16px", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>Generate Key</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
