"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function JinwooSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem("jinwoo_sidebar_collapsed");
    if (saved === "true") setCollapsed(true);
    try {
      const savedGroups = localStorage.getItem("jinwoo_sidebar_collapsed_groups");
      if (savedGroups) setCollapsedGroups(JSON.parse(savedGroups));
    } catch {}
  }, []);

  const toggleCollapse = () => {
    setCollapsed(prev => {
       const next = !prev;
       localStorage.setItem("jinwoo_sidebar_collapsed", String(next));
       return next;
    });
  };

  const toggleGroup = (title: string) => {
    setCollapsedGroups(prev => {
      const next = { ...prev, [title]: !prev[title] };
      localStorage.setItem("jinwoo_sidebar_collapsed_groups", JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggleCollapse();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navGroups = [
    {
      title: "WORKSPACE",
      items: [
        { label: "Dashboard", href: "/jinwoo", icon: "🏠" },
        { label: "Workspaces", href: "/jinwoo/workspaces", icon: "📁" },
        { label: "Files", href: "/jinwoo/files", icon: "📄" },
        { label: "Changes", href: "/jinwoo/changes", icon: "🔄" },
        { label: "Search", href: "/jinwoo/search", icon: "🔍" },
        { label: "Activity", href: "/jinwoo/activity", icon: "📊" },
      ],
    },
    {
      title: "AI WORKFORCE",
      items: [
        { label: "Agents", href: "/jinwoo/agents", icon: "🤖" },
        { label: "Roles", href: "/jinwoo/roles", icon: "👤" },
        { label: "Role Templates", href: "/jinwoo/role-templates", icon: "📑" },
        { label: "Workforce", href: "/jinwoo/workforce", icon: "👥" },
        { label: "Models", href: "/jinwoo/models", icon: "🧠" },
        { label: "Providers", href: "/jinwoo/providers", icon: "🔌" },
        { label: "Connections", href: "/jinwoo/connections", icon: "🔗" },
        { label: "Local Models", href: "/jinwoo/local-models", icon: "💻" },
        { label: "Health", href: "/jinwoo/health", icon: "❤️" },
      ],
    },
    {
      title: "ORCHESTRATION",
      items: [
        { label: "Workflows", href: "/jinwoo/workflows", icon: "⚡" },
        { label: "Communication Bus", href: "/jinwoo/communication", icon: "💬" },
        { label: "Runs", href: "/jinwoo/runs", icon: "▶️" },
        { label: "Tasks", href: "/jinwoo/tasks", icon: "📋" },
      ],
    },
    {
      title: "DEVELOPMENT",
      items: [
        { label: "Terminal", href: "/jinwoo/terminal", icon: "📟" },
        { label: "Git", href: "/jinwoo/git", icon: "🌿" },
        { label: "Coding Agents", href: "/jinwoo/coding-agents", icon: "🛠️" },
        { label: "OpenCode", href: "/jinwoo/coding-agents/opencode", icon: "⚡" },
        { label: "Hermes", href: "/jinwoo/coding-agents/hermes", icon: "🦅" },
        { label: "Codex", href: "/jinwoo/coding-agents/codex", icon: "📜" },
        { label: "OpenClaw", href: "/jinwoo/coding-agents/openclaw", icon: "🦞" },
      ],
    },
    {
      title: "OMNIPROXY",
      items: [
        { label: "Endpoints", href: "/jinwoo/omniproxy/endpoints", icon: "🌐" },
        { label: "API Keys", href: "/jinwoo/omniproxy/api-keys", icon: "🔑" },
        { label: "Providers", href: "/jinwoo/omniproxy/providers", icon: "🔌" },
        { label: "Embedded Services", href: "/jinwoo/omniproxy/services", icon: "📦" },
        { label: "Combos", href: "/jinwoo/omniproxy/combos", icon: "🔀" },
        { label: "Combo Studio", href: "/jinwoo/omniproxy/combos/studio", icon: "🎨" },
        { label: "Provider Quota", href: "/jinwoo/omniproxy/provider-quota", icon: "⚖️" },
        { label: "Quota Sharing", href: "/jinwoo/omniproxy/quota-sharing", icon: "🤝" },
      ],
    },
    {
      title: "COMPRESSION CONTEXT",
      items: [
        { label: "Settings", href: "/jinwoo/omniproxy/compression/settings", icon: "⚙️" },
        { label: "Combos", href: "/jinwoo/omniproxy/compression/combos", icon: "🔀" },
        { label: "Caveman", href: "/jinwoo/omniproxy/compression/caveman", icon: "🪨" },
        { label: "RTK", href: "/jinwoo/omniproxy/compression/rtk", icon: "⚡" },
        { label: "Headroom", href: "/jinwoo/omniproxy/compression/headroom", icon: "📏" },
        { label: "Session Dedup", href: "/jinwoo/omniproxy/compression/session-dedup", icon: "🔁" },
        { label: "CCR", href: "/jinwoo/omniproxy/compression/ccr", icon: "📉" },
        { label: "LLMLingua", href: "/jinwoo/omniproxy/compression/llmlingua", icon: "✂️" },
        { label: "Lite", href: "/jinwoo/omniproxy/compression/lite", icon: "🪶" },
        { label: "Aggressive", href: "/jinwoo/omniproxy/compression/aggressive", icon: "🔥" },
        { label: "Ultra", href: "/jinwoo/omniproxy/compression/ultra", icon: "💥" },
        { label: "OmniGlyph", href: "/jinwoo/omniproxy/compression/omniglyph", icon: "💎" },
        { label: "Compression Studio", href: "/jinwoo/omniproxy/compression/studio", icon: "🎨" },
        { label: "Exclusions", href: "/jinwoo/omniproxy/compression/exclusions", icon: "🚫" },
      ],
    },
    {
      title: "TOOLS",
      items: [
        { label: "CLI Code", href: "/jinwoo/tools/cli-code", icon: "💻" },
        { label: "CLI Agents", href: "/jinwoo/tools/cli-agents", icon: "🤖" },
        { label: "ACP Agents", href: "/jinwoo/tools/acp-agents", icon: "🔌" },
        { label: "Cloud Agents", href: "/jinwoo/tools/cloud-agents", icon: "☁️" },
        { label: "Conductor", href: "/jinwoo/tools/conductor", icon: "🎼" },
        { label: "Agent Bridge", href: "/jinwoo/tools/agent-bridge", icon: "🌉" },
        { label: "Traffic Inspector", href: "/jinwoo/tools/traffic-inspector", icon: "🚦" },
        { label: "Discovery", href: "/jinwoo/tools/discovery", icon: "🔭" },
      ],
    },
    {
      title: "INTEGRATIONS",
      items: [
        { label: "API Endpoints", href: "/jinwoo/integrations/api-endpoints", icon: "🌐" },
        { label: "Webhooks", href: "/jinwoo/integrations/webhooks", icon: "🪝" },
        { label: "Proxy", href: "/jinwoo/integrations/proxy", icon: "🛡️" },
      ],
    },
    {
      title: "OBSERVABILITY",
      items: [
        { label: "Monitor", href: "/jinwoo/monitor", icon: "📺" },
        { label: "Events", href: "/jinwoo/events", icon: "📝" },
        { label: "Tokens", href: "/jinwoo/tokens", icon: "🪙" },
        { label: "Costs", href: "/jinwoo/costs", icon: "💰" },
        { label: "Provider Health", href: "/jinwoo/provider-health", icon: "⚕️" },
        { label: "Usage", href: "/jinwoo/usage", icon: "📈" },
        { label: "Quotas", href: "/jinwoo/quotas", icon: "⚖️" },
      ],
    },
    {
      title: "ANALYTICS",
      items: [
        { label: "Overview", href: "/jinwoo/analytics", icon: "📊" },
        { label: "Combo Health", href: "/jinwoo/analytics/combo-health", icon: "🔀" },
        { label: "Utilization", href: "/jinwoo/analytics/utilization", icon: "📉" },
        { label: "Cache", href: "/jinwoo/analytics/cache", icon: "⚡" },
        { label: "Compression", href: "/jinwoo/analytics/compression", icon: "🗜️" },
        { label: "Search Analytics", href: "/jinwoo/analytics/search", icon: "🔍" },
        { label: "Evals", href: "/jinwoo/analytics/evals", icon: "🧪" },
        { label: "Provider Stats", href: "/jinwoo/analytics/provider-stats", icon: "📈" },
      ],
    },
    {
      title: "COSTS & PRICING",
      items: [
        { label: "Cost Overview", href: "/jinwoo/costs", icon: "💰" },
        { label: "Pricing", href: "/jinwoo/costs/pricing", icon: "🏷️" },
        { label: "Budget", href: "/jinwoo/costs/budget", icon: "💵" },
        { label: "Free Tiers", href: "/jinwoo/costs/free-tiers", icon: "🎁" },
        { label: "Free Provider Rankings", href: "/jinwoo/costs/free-provider-rankings", icon: "🏆" },
      ],
    },
    {
      title: "LOGS",
      items: [
        { label: "Application Logs", href: "/jinwoo/logs", icon: "📋" },
        { label: "Proxy Logs", href: "/jinwoo/logs/proxy", icon: "🚦" },
        { label: "Console Logs", href: "/jinwoo/logs/console", icon: "📟" },
        { label: "Timeline", href: "/jinwoo/logs/timeline", icon: "⏳" },
        { label: "Conversations", href: "/jinwoo/logs/conversations", icon: "💬" },
      ],
    },
    {
      title: "AUDIT",
      items: [
        { label: "Audit Log", href: "/jinwoo/audit", icon: "📜" },
        { label: "MCP Audit", href: "/jinwoo/audit/mcp", icon: "🛡️" },
        { label: "A2A Audit", href: "/jinwoo/audit/a2a", icon: "🤖" },
      ],
    },
    {
      title: "SECURITY",
      items: [
        { label: "Policies", href: "/jinwoo/policies", icon: "🛡️" },
        { label: "Security", href: "/jinwoo/security", icon: "🔒" },
        { label: "Access Tokens", href: "/jinwoo/security/access-tokens", icon: "🔑" },
      ],
    },
    {
      title: "SYSTEM",
      items: [
        { label: "Health", href: "/jinwoo/system/health", icon: "❤️" },
        { label: "Runtime", href: "/jinwoo/system/runtime", icon: "⚙️" },
        { label: "Connection Resilience", href: "/jinwoo/system/resilience", icon: "🛡️" },
        { label: "Storage", href: "/jinwoo/storage", icon: "💾" },
        { label: "Database", href: "/jinwoo/database", icon: "🗄️" },
        { label: "Backups", href: "/jinwoo/backups", icon: "📦" },
        { label: "Settings", href: "/jinwoo/settings", icon: "⚙️" },
        { label: "Appearance", href: "/jinwoo/settings/appearance", icon: "🎨" },
        { label: "AI Settings", href: "/jinwoo/settings/ai", icon: "🧠" },
        { label: "Modality Bridge", href: "/jinwoo/settings/modality-bridge", icon: "🌉" },
        { label: "Global Routing", href: "/jinwoo/settings/routing", icon: "🌐" },
        { label: "Resilience", href: "/jinwoo/settings/resilience", icon: "🔄" },
        { label: "Advanced", href: "/jinwoo/settings/advanced", icon: "🔧" },
        { label: "Security Settings", href: "/jinwoo/settings/security", icon: "🔒" },
        { label: "Feature Flags", href: "/jinwoo/settings/feature-flags", icon: "🚩" },
        { label: "Cache", href: "/jinwoo/settings/cache", icon: "⚡" },
        { label: "Sidebar Settings", href: "/jinwoo/settings/sidebar", icon: "📐" },
      ],
    },
  ];

  return (
    <div
      style={{
        width: collapsed ? "68px" : "268px",
        minWidth: collapsed ? "68px" : "268px",
        backgroundColor: "#030712",
        borderRight: "1px solid #1f2937",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.2s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        height: "100%",
        position: "relative",
        userSelect: "none"
      }}
    >
      {/* Sidebar Header */}
      <div style={{ padding: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #1f2937" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", overflow: "hidden" }}>
          <div style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: "18px",
            flexShrink: 0,
            boxShadow: "0 0 12px rgba(59, 130, 246, 0.3)"
          }}>
            J
          </div>
          {!collapsed && (
            <div>
              <span style={{ color: "#f9fafb", fontWeight: "bold", fontSize: "15px", whiteSpace: "nowrap", display: "block" }}>
                Jinwoo Sys
              </span>
              <span style={{ color: "#6b7280", fontSize: "11px", display: "block" }}>
                Multi-AI OS
              </span>
            </div>
          )}
        </div>
        
        {!collapsed && (
          <button 
            title="Collapse Sidebar (Ctrl+B)" 
            onClick={toggleCollapse} 
            style={{ 
              background: "#111827", 
              border: "1px solid #374151", 
              color: "#9ca3af", 
              cursor: "pointer", 
              borderRadius: "6px",
              padding: "4px 8px",
              fontSize: "11px"
            }}>
            ◀
          </button>
        )}
      </div>
      
      {collapsed && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "12px", marginBottom: "6px" }}>
          <button 
            title="Expand Sidebar (Ctrl+B)" 
            onClick={toggleCollapse} 
            style={{ 
              background: "#111827", 
              border: "1px solid #374151", 
              color: "#9ca3af", 
              cursor: "pointer", 
              borderRadius: "6px",
              padding: "4px 8px",
              fontSize: "11px"
            }}>
            ▶
          </button>
        </div>
      )}

      {/* Nav Items Container */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "12px 8px" }}>
        {navGroups.map((group, i) => {
          const isGroupCollapsed = !!collapsedGroups[group.title];
          return (
            <div key={i} style={{ marginBottom: "16px" }}>
              {!collapsed && (
                <div 
                  onClick={() => toggleGroup(group.title)}
                  style={{ 
                    padding: "4px 10px", 
                    marginBottom: "4px", 
                    fontSize: "11px", 
                    fontWeight: "700", 
                    color: "#6b7280",
                    letterSpacing: "0.06em",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    borderRadius: "4px"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#9ca3af"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#6b7280"; }}
                >
                  <span>{group.title}</span>
                  <span style={{ fontSize: "9px" }}>{isGroupCollapsed ? "▼" : "▲"}</span>
                </div>
              )}

              {(!isGroupCollapsed || collapsed) && (
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  {group.items.map((item, j) => {
                    const active = item.href === "/jinwoo" ? pathname === "/jinwoo" : (pathname === item.href || (pathname.startsWith(item.href + "/") && item.href !== "/jinwoo/costs" && item.href !== "/jinwoo/logs" && item.href !== "/jinwoo/audit" && item.href !== "/jinwoo/settings" && item.href !== "/jinwoo/coding-agents" && item.href !== "/jinwoo/omniproxy" && item.href !== "/jinwoo/tools" && item.href !== "/jinwoo/integrations" && item.href !== "/jinwoo/analytics"));
                    return (
                      <Link key={j} href={item.href} prefetch={true} style={{ textDecoration: "none" }}>
                        <div
                          title={collapsed ? item.label : undefined}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: collapsed ? "8px" : "6px 10px",
                            borderRadius: "6px",
                            backgroundColor: active ? "rgba(59, 130, 246, 0.15)" : "transparent",
                            color: active ? "#60a5fa" : "#9ca3af",
                            border: active ? "1px solid rgba(59, 130, 246, 0.3)" : "1px solid transparent",
                            transition: "background 0.1s ease, color 0.1s ease",
                            justifyContent: collapsed ? "center" : "flex-start",
                            fontSize: "13px"
                          }}
                          onMouseEnter={(e) => {
                            if (!active) {
                              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                              e.currentTarget.style.color = "#e5e7eb";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!active) {
                              e.currentTarget.style.backgroundColor = "transparent";
                              e.currentTarget.style.color = "#9ca3af";
                            }
                          }}
                        >
                          <span style={{ fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", width: "20px", flexShrink: 0 }}>
                            {item.icon}
                          </span>
                          {!collapsed && (
                            <span style={{ marginLeft: "10px", fontWeight: active ? "600" : "400", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {item.label}
                            </span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Footer System & Profile Quick Bar */}
      <div style={{ padding: "12px 14px", borderTop: "1px solid #1f2937", display: "flex", flexDirection: "column", gap: "8px", backgroundColor: "#020617" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", color: "#9ca3af" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "14px" }}>🌐</span>
            {!collapsed && (
              <div style={{ fontSize: "11px" }}>
                <div>OmniProxy: <strong style={{ color: "#10b981" }}>ONLINE</strong></div>
                <div style={{ color: "#6b7280", fontSize: "10px" }}>Port 20128</div>
              </div>
            )}
          </div>

          {!collapsed && (
            <Link
              href="/jinwoo/settings"
              title="System Settings"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "28px",
                height: "28px",
                borderRadius: "6px",
                backgroundColor: "#111827",
                border: "1px solid #374151",
                color: "#9ca3af",
                textDecoration: "none",
                fontSize: "14px",
                transition: "all 0.15s ease"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = "#1f2937";
                e.currentTarget.style.color = "#60a5fa";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = "#111827";
                e.currentTarget.style.color = "#9ca3af";
              }}
            >
              ⚙️
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
