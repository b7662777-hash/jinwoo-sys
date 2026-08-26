import React from 'react';

export default function Page() {
  return (
    <div style={{ padding: '32px', color: '#f3f4f6', minHeight: '100%', background: '#0b0f19' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Agent Activity</h1>
      <div style={{ 
        padding: '64px 32px', 
        border: '1px dashed #374151', 
        borderRadius: '12px',
        textAlign: 'center',
        background: '#111827',
        color: '#9ca3af'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚧</div>
        <h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px', color: '#e5e7eb' }}>Module Under Construction</h2>
        <p>The Agent Activity module is currently being integrated into Jinwoo Sys.</p>
      </div>
    </div>
  );
}
