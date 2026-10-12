import React from 'react';
export default function StatBox({ number, label, warning = false }) {
  return (
    <div className={`stat-box ${warning ? 'warn' : ''}`}>
      <div className="stat-num">{number}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
