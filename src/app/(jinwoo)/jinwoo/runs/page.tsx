"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useJinwooWorkspace } from "@/app/(jinwoo)/jinwoo/context";

export default function RunsPage() {
  const tabs = ["Running", "Queued", "Completed", "Failed", "Cancelled"];
  const [activeTab, setActiveTab] = useState("Running");
  const { state } = useJinwooWorkspace();

  return (
    <div style={{ padding: '0 24px 24px 24px', color: '#f3f4f6' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Execution Runs</h1>
        <Link href="/jinwoo/runs/current" style={{ backgroundColor: "#7c3aed", border: "none", color: "white", padding: "8px 16px", borderRadius: "6px", fontSize: "14px", fontWeight: "500", cursor: "pointer", textDecoration: "none" }}>Current Run Monitor</Link>
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

      <div style={{ padding: '48px', textAlign: 'center', backgroundColor: '#111827', borderRadius: '12px', border: '1px dashed #374151' }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>▶️</div>
        <h2 style={{ fontSize: '18px', marginBottom: '8px', color: '#e5e7eb' }}>No {activeTab} Runs</h2>
        <p style={{ color: '#9ca3af', marginBottom: '24px' }}>There are currently no workflows in the {activeTab.toLowerCase()} state.</p>
        {activeTab === "Running" && (
           <Link href="/jinwoo/runs/current" style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#f3f4f6", padding: "8px 16px", borderRadius: "6px", fontSize: "14px", fontWeight: "500", textDecoration: "none" }}>View Current Active Run</Link>
        )}
      </div>
    </div>
  );
}
