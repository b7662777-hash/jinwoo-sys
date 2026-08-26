"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface RoleTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  roles: { role: string; codingAgent: string; recommendedModel: string; priority: string }[];
}

export default function RoleTemplatesPage() {
  const router = useRouter();
  const [appliedTemplate, setAppliedTemplate] = useState<string | null>(null);

  const templates: RoleTemplate[] = [
    {
      id: "fullstack_squad",
      name: "Fullstack Engineering Squad",
      category: "Development",
      description: "Complete 4-agent engineering team for building production applications end-to-end.",
      roles: [
        { role: "Architect", codingAgent: "hermes", recommendedModel: "claude-opus-4-6-thinking", priority: "High" },
        { role: "Frontend Developer", codingAgent: "opencode", recommendedModel: "claude-sonnet-4-6", priority: "High" },
        { role: "Backend Developer", codingAgent: "opencode", recommendedModel: "claude-sonnet-4-6", priority: "High" },
        { role: "QA & Verification", codingAgent: "hermes", recommendedModel: "gemini-3.7-flash-high", priority: "Normal" }
      ]
    },
    {
      id: "security_audit",
      name: "Security & Penetration Audit Duo",
      category: "Security",
      description: "Dedicated security team for vulnerability assessment, code auditing, and compliance checks.",
      roles: [
        { role: "Security Architect", codingAgent: "hermes", recommendedModel: "claude-opus-4-6-thinking", priority: "High" },
        { role: "Vulnerability Tester", codingAgent: "opencode", recommendedModel: "claude-sonnet-4-6", priority: "High" }
      ]
    },
    {
      id: "rapid_prototyper",
      name: "Solo Rapid Prototyper",
      category: "Prototyping",
      description: "High-speed developer agent optimized for fast turnaround, MVPs, and iterative coding.",
      roles: [
        { role: "Fullstack Developer", codingAgent: "opencode", recommendedModel: "claude-sonnet-4-6", priority: "High" }
      ]
    },
    {
      id: "research_docs",
      name: "Research & Documentation Squad",
      category: "Documentation",
      description: "Specialized in codebase exploration, architecture documentation, and technical writing.",
      roles: [
        { role: "Lead Researcher", codingAgent: "hermes", recommendedModel: "gemini-3.7-flash-high", priority: "Normal" },
        { role: "Technical Writer", codingAgent: "hermes", recommendedModel: "claude-sonnet-4-6", priority: "Normal" }
      ]
    },
    {
      id: "devops_infra",
      name: "DevOps & Infrastructure",
      category: "Operations",
      description: "Focuses on Dockerfiles, CI/CD pipelines, environment configuration, and deployment scripts.",
      roles: [
        { role: "Cloud Architect", codingAgent: "hermes", recommendedModel: "claude-opus-4-6-thinking", priority: "High" },
        { role: "SRE / DevOps Engineer", codingAgent: "opencode", recommendedModel: "claude-sonnet-4-6", priority: "Normal" }
      ]
    }
  ];

  const handleApplyTemplate = async (tmpl: RoleTemplate) => {
    try {
      for (const r of tmpl.roles) {
        await fetch("/api/jinwoo/workforce", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: r.role.toLowerCase().replace(/[^a-z0-9]/g, "_"),
            codingAgent: r.codingAgent,
            provider: "antigravity",
            model: `antigravity/${r.recommendedModel}`
          })
        });
      }
      setAppliedTemplate(tmpl.id);
      setTimeout(() => {
        router.push("/jinwoo/workforce");
      }, 1000);
    } catch (e) {
      console.error("Apply template failed:", e);
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>📑</span>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#f3f4f6", margin: 0 }}>Role Templates</h1>
          </div>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "6px" }}>
            Pre-configured workforce architectures for common development, security, and research workflows.
          </p>
        </div>

        <Link
          href="/jinwoo/workforce"
          style={{
            backgroundColor: "#1f2937",
            border: "1px solid #374151",
            color: "#a78bfa",
            padding: "8px 16px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "600",
            textDecoration: "none"
          }}
        >
          👥 View Active Workforce
        </Link>
      </div>

      {/* Templates Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "20px" }}>
        {templates.map((tmpl) => (
          <div
            key={tmpl.id}
            style={{
              backgroundColor: "#0D111C",
              border: `1px solid ${appliedTemplate === tmpl.id ? "#10b981" : "#1f2937"}`,
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              boxShadow: appliedTemplate === tmpl.id ? "0 0 20px rgba(16, 185, 129, 0.2)" : "none"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#f3f4f6", margin: "0 0 4px 0" }}>{tmpl.name}</h3>
                <span style={{ fontSize: "11px", color: "#60a5fa", backgroundColor: "rgba(59, 130, 246, 0.1)", padding: "2px 8px", borderRadius: "10px" }}>
                  {tmpl.category}
                </span>
              </div>
              <span style={{ color: "#9ca3af", fontSize: "12px", fontWeight: "600" }}>{tmpl.roles.length} Roles</span>
            </div>

            <p style={{ color: "#9ca3af", fontSize: "13px", margin: 0, lineHeight: "1.4" }}>
              {tmpl.description}
            </p>

            {/* Role List Breakdown */}
            <div style={{ backgroundColor: "#111827", borderRadius: "8px", padding: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
              {tmpl.roles.map((r, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px" }}>
                  <span style={{ color: "#f3f4f6", fontWeight: "500" }}>{r.role}</span>
                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <span style={{ color: "#a78bfa", fontSize: "11px", fontFamily: "monospace" }}>{r.codingAgent}</span>
                    <span style={{ color: "#6b7280", fontSize: "10px" }}>({r.recommendedModel.split("-")[0]})</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "auto", paddingTop: "10px" }}>
              <button
                onClick={() => handleApplyTemplate(tmpl)}
                disabled={appliedTemplate === tmpl.id}
                style={{
                  width: "100%",
                  backgroundColor: appliedTemplate === tmpl.id ? "#10b981" : "#2563eb",
                  color: "white",
                  border: "none",
                  padding: "8px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
              >
                {appliedTemplate === tmpl.id ? "✓ Applied to Workforce!" : "Apply Template to Workforce"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
