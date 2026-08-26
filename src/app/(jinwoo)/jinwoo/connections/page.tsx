"use client";

import React, { useEffect, useState } from "react";

export default function ConnectionsPage() {
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    fetch('/api/jinwoo/providers')
      .then(res => res.json())
      .then(data => setProviders(data.providers || []));
  }, []);

  return (
    <div style={{ padding: '32px', color: '#f3f4f6' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Model Connections</h1>
        <button style={{ backgroundColor: "#7c3aed", border: "none", color: "white", padding: "8px 16px", borderRadius: "6px", fontSize: "14px", fontWeight: "500", cursor: "pointer" }}>+ Add Connection</button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {providers.map((p: any) => (
          <div key={p.id} style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '8px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'capitalize' }}>{p.provider}</div>
              <span style={{ 
                backgroundColor: p.health === 'HEALTHY' ? "rgba(16, 185, 129, 0.1)" : (p.health === 'NOT_CONFIGURED' ? "rgba(107, 114, 128, 0.1)" : "rgba(239, 68, 68, 0.1)"), 
                color: p.health === 'HEALTHY' ? "#34d399" : (p.health === 'NOT_CONFIGURED' ? "#9ca3af" : "#f87171"), 
                padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold" 
              }}>
                {p.health}
              </span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#9ca3af', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Available Models:</span>
                <span style={{ color: '#f3f4f6' }}>{p.models?.length || 0}</span>
              </div>
              {p.reason && (
                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '8px', padding: '8px', backgroundColor: 'rgba(239, 68, 68, 0.05)', borderRadius: '4px' }}>
                  <span style={{ color: '#f87171', fontSize: '11px', fontWeight: 'bold' }}>REASON:</span>
                  <span style={{ color: '#fca5a5' }}>{p.reason}</span>
                </div>
              )}
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
               <button 
                 onClick={async () => {
                   const res = await fetch(`/api/jinwoo/providers/${p.id}/test`, { method: 'POST' });
                   const data = await res.json();
                   alert(`Test Result: ${data.status}\n${data.error ? 'Error: ' + data.error : 'Latency: ' + data.latencyMs + 'ms'}`);
                 }}
                 style={{ flex: 1, backgroundColor: 'transparent', border: '1px solid #374151', color: '#d1d5db', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}
               >
                 Test Connection
               </button>
               <button style={{ flex: 1, backgroundColor: 'transparent', border: '1px solid #374151', color: '#d1d5db', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}>Configure</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
