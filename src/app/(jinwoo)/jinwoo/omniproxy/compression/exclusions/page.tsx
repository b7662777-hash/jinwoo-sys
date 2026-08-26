"use client";

import React, { useState } from "react";

export default function CompressionExclusionsPage() {
  const [exclusions, setExclusions] = useState<string[]>([
    "system:security_policy",
    "model:antigravity/claude-opus-4-6-thinking",
    "endpoint:/v1/embeddings",
    "path:src/lib/crypto.ts",
    "path:data/*.sqlite"
  ]);

  const [newExclusion, setNewExclusion] = useState("");

  const handleAdd = () => {
    if (!newExclusion.trim()) return;
    setExclusions([...exclusions, newExclusion.trim()]);
    setNewExclusion("");
  };

  const handleRemove = (index: number) => {
    setExclusions(exclusions.filter((_, i) => i !== index));
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🚫</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Compression Exclusions</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Exempt critical security rules, sensitive files, and specific endpoints from prompt compression.
          </p>
        </div>
      </div>

      <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            value={newExclusion}
            onChange={(e) => setNewExclusion(e.target.value)}
            placeholder="e.g. path:src/auth/* or model:o3-mini or system:strict_rules"
            style={{ flex: 1, backgroundColor: "#030712", border: "1px solid #374151", color: "#f3f4f6", padding: "8px 12px", borderRadius: "6px", fontSize: "13px", outline: "none" }}
          />
          <button
            onClick={handleAdd}
            style={{ backgroundColor: "#2563eb", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
          >
            + Add Exclusion
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {exclusions.map((ex, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: "#111827",
                border: "1px solid #1f2937",
                borderRadius: "6px",
                padding: "8px 12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <code style={{ color: "#f3f4f6", fontSize: "12px" }}>{ex}</code>
              <button
                onClick={() => handleRemove(idx)}
                style={{ background: "transparent", border: "none", color: "#f87171", cursor: "pointer", fontSize: "12px" }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
