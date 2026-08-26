"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function JinwooCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const commands = [
    // Workspace
    { name: "Open Dashboard", category: "Workspace", url: "/jinwoo" },
    { name: "Manage Workspaces", category: "Workspace", url: "/jinwoo/workspaces" },
    { name: "Browse Files", category: "Workspace", url: "/jinwoo/files" },
    { name: "View File Changes", category: "Workspace", url: "/jinwoo/changes" },
    { name: "Search Codebase", category: "Workspace", url: "/jinwoo/search" },
    { name: "Activity Feed", category: "Workspace", url: "/jinwoo/activity" },

    // Workforce
    { name: "Configure Workforce", category: "AI Workforce", url: "/jinwoo/workforce" },
    { name: "Role Templates", category: "AI Workforce", url: "/jinwoo/role-templates" },
    { name: "Open Models Catalog", category: "AI Workforce", url: "/jinwoo/models" },
    { name: "Provider Connections", category: "AI Workforce", url: "/jinwoo/providers" },
    { name: "Local Models (Ollama)", category: "AI Workforce", url: "/jinwoo/local-models" },
    { name: "Provider Health", category: "AI Workforce", url: "/jinwoo/health" },

    // Development & Coding Agents
    { name: "Coding Agents Dashboard", category: "Development", url: "/jinwoo/coding-agents" },
    { name: "OpenCode Runtime Console", category: "Development", url: "/jinwoo/coding-agents/opencode" },
    { name: "Hermes Agent Server", category: "Development", url: "/jinwoo/coding-agents/hermes" },
    { name: "Codex CLI Adapter", category: "Development", url: "/jinwoo/coding-agents/codex" },
    { name: "Interactive Terminal", category: "Development", url: "/jinwoo/terminal" },
    { name: "Git Version Control", category: "Development", url: "/jinwoo/git" },

    // OmniProxy
    { name: "OmniProxy Endpoints", category: "OmniProxy", url: "/jinwoo/omniproxy/endpoints" },
    { name: "OmniProxy API Keys", category: "OmniProxy", url: "/jinwoo/omniproxy/api-keys" },
    { name: "Intelligent Combos", category: "OmniProxy", url: "/jinwoo/omniproxy/combos" },
    { name: "Combo Studio (DAG Editor)", category: "OmniProxy", url: "/jinwoo/omniproxy/combos/studio" },
    { name: "Provider Quota Tracking", category: "OmniProxy", url: "/jinwoo/omniproxy/provider-quota" },
    { name: "Quota Sharing Pools", category: "OmniProxy", url: "/jinwoo/omniproxy/quota-sharing" },

    // Compression Context
    { name: "Compression Settings", category: "Compression", url: "/jinwoo/omniproxy/compression/settings" },
    { name: "Compression Studio Playground", category: "Compression", url: "/jinwoo/omniproxy/compression/studio" },
    { name: "Caveman Compression Engine", category: "Compression", url: "/jinwoo/omniproxy/compression/caveman" },
    { name: "RTK Entropy Deduplication", category: "Compression", url: "/jinwoo/omniproxy/compression/rtk" },
    { name: "Dynamic Headroom Reserve", category: "Compression", url: "/jinwoo/omniproxy/compression/headroom" },
    { name: "Session Prompt Deduplication", category: "Compression", url: "/jinwoo/omniproxy/compression/session-dedup" },
    { name: "OmniGlyph Symbol Mapping", category: "Compression", url: "/jinwoo/omniproxy/compression/omniglyph" },

    // Tools & Observability
    { name: "Traffic Inspector", category: "Tools", url: "/jinwoo/tools/traffic-inspector" },
    { name: "CLI Code Tools", category: "Tools", url: "/jinwoo/tools/cli-code" },
    { name: "Agent Bridge", category: "Tools", url: "/jinwoo/tools/agent-bridge" },
    { name: "Analytics Overview", category: "Observability", url: "/jinwoo/analytics" },
    { name: "Token Usage", category: "Observability", url: "/jinwoo/tokens" },
    { name: "Cost Overview", category: "Observability", url: "/jinwoo/costs" },
    { name: "Model Pricing Catalog", category: "Observability", url: "/jinwoo/costs/pricing" },
    { name: "Application Logs", category: "Observability", url: "/jinwoo/logs" },
    { name: "Security Policies", category: "Security", url: "/jinwoo/policies" },
    { name: "System Settings", category: "System", url: "/jinwoo/settings" }
  ];

  const filtered = commands.filter((c) => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (url: string) => {
    setIsOpen(false);
    setSearch("");
    router.push(url);
  };

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(4px)",
        zIndex: 9999,
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        paddingTop: "12vh"
      }}
      onClick={() => setIsOpen(false)}
    >
      <div 
        style={{
          width: "100%", maxWidth: "600px",
          backgroundColor: "#111827",
          border: "1px solid #374151",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: "16px", borderBottom: "1px solid #1f2937", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ color: "#9ca3af", fontSize: "16px" }}>🔍</span>
          <input
            autoFocus
            type="text"
            placeholder="Type a command or search modules (e.g. OpenCode, Combos, Pricing)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              backgroundColor: "transparent",
              border: "none",
              outline: "none",
              color: "#f3f4f6",
              fontSize: "14px"
            }}
          />
          <kbd style={{ backgroundColor: "#1f2937", color: "#9ca3af", padding: "2px 6px", borderRadius: "4px", fontSize: "11px", border: "1px solid #374151" }}>ESC</kbd>
        </div>

        <div style={{ maxHeight: "360px", overflowY: "auto", padding: "8px" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: "24px", textAlign: "center", color: "#6b7280", fontSize: "13px" }}>
              No matching commands or pages found.
            </div>
          ) : (
            filtered.map((c, i) => (
              <div
                key={i}
                onClick={() => handleSelect(c.url)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  color: "#f3f4f6",
                  fontSize: "13px"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.15)";
                  e.currentTarget.style.color = "#60a5fa";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#f3f4f6";
                }}
              >
                <span>{c.name}</span>
                <span style={{ fontSize: "11px", color: "#6b7280", backgroundColor: "#1f2937", padding: "2px 8px", borderRadius: "4px" }}>
                  {c.category}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
