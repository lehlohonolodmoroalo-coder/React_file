import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Toast from './Toast';

export default function Layout({ currentUser, onLogout, toast }) {
  return (
    <div className="app">
      <Sidebar currentUser={currentUser} onLogout={onLogout} />
      <main className="content"><Outlet /></main>
      <Toast message={toast} />
    </div>
  );
}
