"use client";

import React, { useState } from "react";

export default function EmbeddedServicesPage() {
  const [services, setServices] = useState([
    { id: "ollama", name: "Ollama Local Engine", type: "Local Inference", endpoint: "http://127.0.0.1:11434", status: "ONLINE", description: "Local model runner for Llama, Mistral, Qwen, DeepSeek without external API dependencies." },
    { id: "searxng", name: "SearXNG / Web Search Service", type: "Search", endpoint: "Internal Route", status: "READY", description: "Multi-engine metasearch aggregator for real-time web search and information retrieval." },
    { id: "web_fetch", name: "Headless Web Fetcher", type: "Web Scraper", endpoint: "Internal Proxy", status: "READY", description: "High-speed URL markdown converter and web scraper with CORS proxy bypass." },
    { id: "modality_bridge", name: "Modality Audio/Vision Bridge", type: "Media Translator", endpoint: "/v1/audio", status: "ONLINE", description: "Automatic conversion between speech-to-text, vision parsing, and multimodal tokens." }
  ]);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>📦</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Embedded Services</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Built-in local engines, search providers, web scrapers, and modality converters managed by OmniProxy.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "20px" }}>
        {services.map((s) => (
          <div
            key={s.id}
            style={{
              backgroundColor: "#0D111C",
              border: "1px solid #1f2937",
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong style={{ color: "#f3f4f6", fontSize: "16px", display: "block" }}>{s.name}</strong>
                <span style={{ fontSize: "11px", color: "#a78bfa" }}>{s.type}</span>
              </div>
              <span style={{
                backgroundColor: "rgba(16, 185, 129, 0.15)",
                color: "#34d399",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                padding: "2px 8px",
                borderRadius: "10px",
                fontSize: "11px",
                fontWeight: "600"
              }}>
                ● {s.status}
              </span>
            </div>

            <p style={{ color: "#9ca3af", fontSize: "13px", margin: 0, lineHeight: "1.4" }}>
              {s.description}
            </p>

            <div style={{ backgroundColor: "#111827", padding: "8px 12px", borderRadius: "6px", fontSize: "11px", fontFamily: "monospace", color: "#60a5fa" }}>
              Endpoint: {s.endpoint}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
