"use client";

import React, { useState, useEffect, useRef } from "react";
import { useJinwooWorkspace } from "@/app/(jinwoo)/jinwoo/context";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function JinwooTopbar() {
  const { state } = useJinwooWorkspace();
  const router = useRouter();

  const [providerCount, setProviderCount] = useState<number>(0);
  const [authStatus, setAuthStatus] = useState<{ authenticated: boolean; user?: string }>({ authenticated: true, user: "Admin (Local)" });
  
  // Dropdown states
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const wsMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Fetch provider status
    fetch("/api/jinwoo/providers")
      .then(res => res.json())
      .then(data => {
        if (data.connections) {
          const healthy = data.connections.filter((c: any) => c.health === "HEALTHY");
          setProviderCount(healthy.length);
        }
      })
      .catch(() => {});

    // 2. Fetch auth status
    fetch("/api/auth/status")
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.authenticated === "boolean") {
          setAuthStatus({
            authenticated: data.authenticated,
            user: data.authenticated ? "Admin (Authenticated)" : "Local Operator"
          });
        }
      })
      .catch(() => {});

    // 3. Fetch recent notifications / events
    fetch("/api/jinwoo/events")
      .then(res => res.json())
      .then(data => {
        if (data.events) {
          setNotifications(data.events.slice(0, 5));
        }
      })
      .catch(() => {});

    // Click outside listener
    const handleClickOutside = (e: MouseEvent) => {
      if (wsMenuRef.current && !wsMenuRef.current.contains(e.target as Node)) {
        setShowWorkspaceMenu(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setShowNotificationMenu(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpenCommandPalette = () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }));
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    router.push("/auth/login");
  };

  return (
    <div style={{
      height: "56px",
      borderBottom: "1px solid #1f2937",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      backgroundColor: "rgba(10, 13, 21, 0.9)",
      backdropFilter: "blur(12px)",
      color: "#d1d5db",
      userSelect: "none"
    }}>
      {/* Left side: Workspace & Run Context */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", position: "relative" }}>
        
        {/* Workspace Dropdown */}
        <div ref={wsMenuRef} style={{ position: "relative" }}>
          <div 
            onClick={() => setShowWorkspaceMenu(prev => !prev)}
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "8px", 
              cursor: "pointer", 
              padding: "6px 12px", 
              borderRadius: "6px", 
              backgroundColor: "rgba(255,255,255,0.03)", 
              border: "1px solid rgba(255,255,255,0.08)",
              transition: "background 0.15s ease"
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.07)"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)"}
          >
            <span style={{ fontSize: "14px" }}>📁</span>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#f3f4f6", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {state.workspaceName || "Select Workspace"}
            </span>
            <span style={{ fontSize: "10px", color: "#9ca3af" }}>▼</span>
          </div>

          {showWorkspaceMenu && (
            <div style={{ position: "absolute", top: "42px", left: "0", background: "#111827", border: "1px solid #374151", borderRadius: "10px", width: "280px", zIndex: 1000, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.8)", padding: "12px" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#6b7280", marginBottom: "4px", letterSpacing: "0.05em" }}>CURRENT ACTIVE WORKSPACE</div>
              <div style={{ padding: "8px", backgroundColor: "#030712", borderRadius: "6px", border: "1px solid #1f2937", marginBottom: "10px" }}>
                <div style={{ color: "#f3f4f6", fontSize: "13px", fontWeight: "600" }}>{state.workspaceName || "None Selected"}</div>
                {state.workspacePath && (
                  <div style={{ color: "#9ca3af", fontSize: "11px", fontFamily: "monospace", wordBreak: "break-all", marginTop: "2px" }}>
                    {state.workspacePath}
                  </div>
                )}
              </div>
              
              <Link 
                href="/jinwoo/workspaces" 
                onClick={() => setShowWorkspaceMenu(false)}
                style={{ display: "block", textAlign: "center", padding: "8px 12px", backgroundColor: "#2563eb", color: "white", textDecoration: "none", fontSize: "12px", fontWeight: "600", borderRadius: "6px" }}
              >
                + Switch or Add Workspace
              </Link>
            </div>
          )}
        </div>

        <div style={{ width: "1px", height: "16px", backgroundColor: "#374151" }}></div>

        {/* Workflow Status */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "14px", color: "#a78bfa" }}>⚡</span>
          <span suppressHydrationWarning style={{ fontSize: "12px", color: "#9ca3af" }}>
            Workflow: <span style={{ color: "#d1d5db", fontWeight: "600" }}>{state.workflowId}</span>
          </span>
          {state.isRunning && (
            <span style={{ display: "flex", alignItems: "center", gap: "4px", backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#34d399", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "2px 8px", borderRadius: "10px", fontSize: "11px", fontWeight: "600" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#34d399" }}></span> LIVE
            </span>
          )}
        </div>
      </div>

      {/* Center: Command Palette Trigger */}
      <div style={{ flex: 1, maxWidth: "420px", margin: "0 24px" }}>
        <div 
          onClick={handleOpenCommandPalette}
          style={{ 
            position: "relative", 
            cursor: "pointer",
            backgroundColor: "rgba(0,0,0,0.35)", 
            border: "1px solid #374151", 
            borderRadius: "8px", 
            padding: "6px 12px 6px 36px", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between",
            transition: "border-color 0.15s ease"
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "#60a5fa"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "#374151"}
        >
          <span style={{ position: "absolute", left: "12px", fontSize: "14px", color: "#6b7280" }}>🔍</span>
          <span style={{ color: "#9ca3af", fontSize: "12px" }}>Search workspace, tools, models...</span>
          <kbd style={{ backgroundColor: "#111827", color: "#9ca3af", padding: "1px 6px", borderRadius: "4px", fontSize: "10px", border: "1px solid #374151" }}>Ctrl+K</kbd>
        </div>
      </div>

      {/* Right side: Telemetry, Notifications, Settings, Profile */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        
        {/* Provider Status */}
        <Link href="/jinwoo/providers" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#9ca3af", fontSize: "12px", cursor: "pointer" }}>
            <span>Providers:</span>
            <span style={{ color: "#34d399", fontWeight: "600" }}>{providerCount} Connected</span>
          </div>
        </Link>

        <div style={{ width: "1px", height: "16px", backgroundColor: "#374151" }}></div>

        {/* Notifications Dropdown */}
        <div ref={notifMenuRef} style={{ position: "relative" }}>
          <button 
            title="Notifications"
            onClick={() => setShowNotificationMenu(prev => !prev)}
            style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", fontSize: "16px", padding: "4px", display: "flex", alignItems: "center" }}
          >
            🔔
          </button>

          {showNotificationMenu && (
            <div style={{ position: "absolute", top: "40px", right: "0", background: "#111827", border: "1px solid #374151", borderRadius: "10px", width: "300px", zIndex: 1000, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.8)", padding: "12px" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#6b7280", marginBottom: "8px", letterSpacing: "0.05em" }}>LIVE SYSTEM EVENTS</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: "12px", textAlign: "center", color: "#6b7280", fontSize: "12px" }}>No recent alerts.</div>
                ) : (
                  notifications.map((n, i) => (
                    <div key={i} style={{ backgroundColor: "#030712", padding: "8px", borderRadius: "6px", border: "1px solid #1f2937", fontSize: "11px" }}>
                      <div style={{ color: "#60a5fa", fontWeight: "600" }}>{n.type || "INFO"}</div>
                      <div style={{ color: "#cbd5e1", marginTop: "2px" }}>{n.agentId || "System"}: {JSON.stringify(n.payload || "").substring(0, 60)}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Settings Button */}
        <Link href="/jinwoo/settings" style={{ textDecoration: "none" }}>
          <button 
            title="Settings"
            style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", fontSize: "16px", padding: "4px", display: "flex", alignItems: "center" }}
          >
            ⚙️
          </button>
        </Link>
        
        {/* Profile Avatar & Menu */}
        <div ref={profileMenuRef} style={{ position: "relative" }}>
          <div 
            onClick={() => setShowProfileMenu(prev => !prev)}
            style={{ 
              width: "32px", 
              height: "32px", 
              borderRadius: "50%", 
              background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              color: "white", 
              fontSize: "12px", 
              fontWeight: "bold", 
              cursor: "pointer",
              boxShadow: "0 0 10px rgba(59, 130, 246, 0.3)"
            }}
          >
            JS
          </div>

          {showProfileMenu && (
            <div style={{ position: "absolute", top: "42px", right: "0", background: "#111827", border: "1px solid #374151", borderRadius: "12px", width: "260px", zIndex: 1000, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.8)", padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold", fontSize: "14px" }}>
                  JS
                </div>
                <div>
                  <strong style={{ color: "#f3f4f6", fontSize: "14px", display: "block" }}>Jinwoo Operator</strong>
                  <span style={{ color: "#34d399", fontSize: "11px" }}>● {authStatus.user}</span>
                </div>
              </div>

              <div style={{ backgroundColor: "#030712", padding: "8px 10px", borderRadius: "6px", border: "1px solid #1f2937", marginBottom: "12px", fontSize: "11px" }}>
                <div style={{ color: "#9ca3af" }}>Gateway Role: <strong style={{ color: "#f3f4f6" }}>Administrator</strong></div>
                <div style={{ color: "#9ca3af", marginTop: "2px" }}>Binding: <strong style={{ color: "#60a5fa" }}>127.0.0.1:20128</strong></div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <Link
                  href="/jinwoo/settings"
                  onClick={() => setShowProfileMenu(false)}
                  style={{ display: "block", padding: "6px 10px", color: "#cbd5e1", textDecoration: "none", fontSize: "12px", borderRadius: "6px" }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  ⚙️ System Settings
                </Link>
                <Link
                  href="/jinwoo/omniproxy/api-keys"
                  onClick={() => setShowProfileMenu(false)}
                  style={{ display: "block", padding: "6px 10px", color: "#cbd5e1", textDecoration: "none", fontSize: "12px", borderRadius: "6px" }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  🔑 API Keys & Auth Tokens
                </Link>
                
                <hr style={{ border: "none", borderTop: "1px solid #1f2937", margin: "6px 0" }} />
                
                <button
                  onClick={handleLogout}
                  style={{ width: "100%", textAlign: "left", background: "none", border: "none", padding: "6px 10px", color: "#f87171", cursor: "pointer", fontSize: "12px", borderRadius: "6px" }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  🚪 Sign Out / Re-Authenticate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
