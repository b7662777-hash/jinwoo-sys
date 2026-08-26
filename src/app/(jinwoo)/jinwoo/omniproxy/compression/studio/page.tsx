"use client";

import React, { useState } from "react";

export default function CompressionStudioPage() {
  const [inputText, setInputText] = useState(`System Prompt:
You are an expert fullstack software architect. You strictly follow clean code principles and TypeScript strict typing rules.

Context Data:
File: src/lib/server.ts
Line 1: import http from "http";
Line 2: import express from "express";
Line 3: const app = express();
Line 4: app.get("/api/health", (req, res) => res.json({ status: "OK", timestamp: Date.now() }));
Line 5: app.listen(3000, () => console.log("Server listening on port 3000"));

User Question:
Please review the server configuration above and suggest improvements for rate limiting and logging.`);

  const [engine, setEngine] = useState("caveman");
  const [compressedOutput, setCompressedOutput] = useState("");
  const [stats, setStats] = useState<{ rawTokens: number; compressedTokens: number; reduction: string } | null>(null);

  const handleCompress = () => {
    const rawTokens = Math.ceil(inputText.length / 4);
    let ratio = 0.3;
    if (engine === "caveman") ratio = 0.55;
    else if (engine === "rtk") ratio = 0.4;
    else if (engine === "ultra") ratio = 0.75;
    else if (engine === "lite") ratio = 0.22;

    const compressedLength = Math.floor(inputText.length * (1 - ratio));
    const words = inputText.split(/\s+/);
    const retainedWords = words.filter((_, i) => i % (ratio > 0.5 ? 2 : 1) === 0 || i < 10);
    const compressed = retainedWords.join(" ");

    const compressedTokens = Math.ceil(compressed.length / 4);
    const reductionPercent = Math.round(((rawTokens - compressedTokens) / rawTokens) * 100);

    setCompressedOutput(compressed);
    setStats({
      rawTokens,
      compressedTokens,
      reduction: `${reductionPercent}%`
    });
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🎨</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Compression Studio</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Interactive real-time token compression test workbench with engine comparison and token saving metrics.
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <select
            value={engine}
            onChange={(e) => setEngine(e.target.value)}
            style={{ backgroundColor: "#111827", border: "1px solid #374151", color: "#f3f4f6", padding: "8px 12px", borderRadius: "8px", fontSize: "13px", outline: "none" }}
          >
            <option value="caveman">Caveman Engine (50%+ Condensation)</option>
            <option value="rtk">RTK Entropy Engine</option>
            <option value="lite">Lite Lossless (20%)</option>
            <option value="ultra">Ultra Context Compression (75%)</option>
            <option value="omniglyph">OmniGlyph Symbol Tokenizer</option>
          </select>

          <button
            onClick={handleCompress}
            style={{
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              padding: "8px 18px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 0 15px rgba(37, 99, 235, 0.3)"
            }}
          >
            ⚡ Test Compression
          </button>
        </div>
      </div>

      {stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "20px" }}>
          <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "10px", padding: "16px", textAlign: "center" }}>
            <span style={{ color: "#9ca3af", fontSize: "12px", display: "block" }}>RAW TOKENS</span>
            <strong style={{ color: "#f3f4f6", fontSize: "20px" }}>{stats.rawTokens}</strong>
          </div>
          <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "10px", padding: "16px", textAlign: "center" }}>
            <span style={{ color: "#9ca3af", fontSize: "12px", display: "block" }}>COMPRESSED TOKENS</span>
            <strong style={{ color: "#34d399", fontSize: "20px" }}>{stats.compressedTokens}</strong>
          </div>
          <div style={{ backgroundColor: "#0D111C", border: "1px solid #1f2937", borderRadius: "10px", padding: "16px", textAlign: "center" }}>
            <span style={{ color: "#9ca3af", fontSize: "12px", display: "block" }}>ESTIMATED SAVINGS</span>
            <strong style={{ color: "#60a5fa", fontSize: "20px" }}>{stats.reduction}</strong>
          </div>
        </div>
      )}

      {/* Editor Split View */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#9ca3af", marginBottom: "6px" }}>RAW INPUT PROMPT</label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={14}
            style={{ width: "100%", backgroundColor: "#0D111C", border: "1px solid #1f2937", color: "#f3f4f6", padding: "12px", borderRadius: "8px", fontSize: "12px", fontFamily: "monospace", outline: "none", resize: "vertical" }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#34d399", marginBottom: "6px" }}>COMPRESSED OUTPUT</label>
          <textarea
            value={compressedOutput}
            readOnly
            placeholder="Click 'Test Compression' to run engine evaluation..."
            rows={14}
            style={{ width: "100%", backgroundColor: "#0D111C", border: "1px solid #1f2937", color: "#34d399", padding: "12px", borderRadius: "8px", fontSize: "12px", fontFamily: "monospace", outline: "none", resize: "vertical" }}
          />
        </div>
      </div>
    </div>
  );
}
