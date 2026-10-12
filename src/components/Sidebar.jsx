import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Sidebar({ currentUser, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-mark">TL</span>
        <div><h1>Thornfield<br />Library</h1></div>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Dashboard</NavLink>
        <NavLink to="/books" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Book Management</NavLink>
        <NavLink to="/transactions" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Transactions</NavLink>
        <NavLink to="/users" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>User Accounts</NavLink>
      </nav>

      <div className="sidebar-status">
        <div className="login-status">
          <strong>{currentUser?.name}</strong>
          <span>{currentUser?.role}</span>
        </div>
        <button className="btn-small" type="button" onClick={handleLogout}>Sign out</button>
      </div>
    </aside>
  );
}
