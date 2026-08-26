"use client";

import React, { useState } from "react";
import { AgentAssignmentsPanel } from "@/components/jinwoo/panels/AgentAssignmentsPanel";

export default function RolesPage() {
  const tabs = ["Roles", "Templates", "Assignments", "Recommendations", "Custom Roles"];
  const [activeTab, setActiveTab] = useState("Roles");

  return (
    <div style={{ padding: '0 24px 24px 24px', color: '#f3f4f6' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Role Management</h1>
        <button style={{ backgroundColor: "#7c3aed", border: "none", color: "white", padding: "8px 16px", borderRadius: "6px", fontSize: "14px", fontWeight: "500", cursor: "pointer" }}>+ Create Role</button>
      </div>

      <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #1f2937', marginBottom: '24px', overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ 
              background: 'none', border: 'none', padding: '8px 4px', cursor: 'pointer', 
              color: activeTab === tab ? '#a78bfa' : '#9ca3af', 
              borderBottom: activeTab === tab ? '2px solid #8b5cf6' : '2px solid transparent',
              fontWeight: activeTab === tab ? '600' : '400',
              fontSize: '14px',
              whiteSpace: 'nowrap'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Roles" || activeTab === "Assignments" ? (
         <AgentAssignmentsPanel />
      ) : (
        <div style={{ padding: '48px', textAlign: 'center', backgroundColor: '#111827', borderRadius: '12px', border: '1px dashed #374151' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '8px', color: '#e5e7eb' }}>{activeTab}</h2>
          <p style={{ color: '#9ca3af', marginBottom: '24px' }}>Advanced configurations for {activeTab.toLowerCase()} will be displayed here.</p>
        </div>
      )}
    </div>
  );
}
