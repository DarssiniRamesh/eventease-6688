/* Sidebar: left navigation with app identity and routes */
import React from 'react';

function NavItem({ label, active, onClick }) {
  return (
    <button
      className={`nav-item ${active ? 'active' : ''}`}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
    >
      <span className="dot" />
      <span>{label}</span>
    </button>
  );
}

// PUBLIC_INTERFACE
export default function Sidebar({ currentRoute, onNavigate, theme, onToggleTheme }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo">⏱️</div>
        <div className="brand-text">
          <div className="brand-title">EventEase</div>
          <div className="brand-sub">Ocean Professional</div>
        </div>
      </div>

      <nav className="nav">
        <NavItem
          label="Events"
          active={currentRoute === '/list'}
          onClick={() => onNavigate('/list')}
        />
        <NavItem
          label="Create"
          active={currentRoute === '/create'}
          onClick={() => onNavigate('/create')}
        />
      </nav>

      <div className="sidebar-footer">
        <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>
    </aside>
  );
}
