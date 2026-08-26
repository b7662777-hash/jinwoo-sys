import React from 'react';

export default function BudgetsPage() {
  return (
    <div style={{ padding: '32px', color: '#f3f4f6' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Budgets</h1>
      <div style={{ 
        padding: '32px', 
        border: '1px dashed #374151', 
        borderRadius: '8px',
        textAlign: 'center',
        color: '#9ca3af'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚧</div>
        <h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>Coming Soon</h2>
        <p>The Budgets module is currently under active development.</p>
      </div>
    </div>
  );
}
