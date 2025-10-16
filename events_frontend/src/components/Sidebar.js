/* Sidebar: left navigation with app identity and routes */
import React, { useEffect, useRef } from 'react';

function NavItem({ label, icon, active, onClick, collapsed }) {
  const title = collapsed ? label : undefined;
  return (
    <button
      className={`nav-item ${active ? 'active' : ''}`}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      title={title}
    >
      <span className="dot" aria-hidden="true" />
      <span className="nav-icon" aria-hidden="true">{icon}</span>
      {!collapsed && <span className="nav-label">{label}</span>}
    </button>
  );
}

// PUBLIC_INTERFACE
export default function Sidebar({
  id = 'app-sidebar',
  currentRoute,
  onNavigate,
  theme,
  onToggleTheme,
  collapsed = false,
  onToggleCollapsed,
  mobileOpen = false,
  onCloseMobile,
}) {
  // Manage focus trap basics for mobile drawer: focus first interactive when opened
  const asideRef = useRef(null);
  useEffect(() => {
    if (mobileOpen && asideRef.current) {
      const btn = asideRef.current.querySelector('button');
      btn?.focus();
    }
  }, [mobileOpen]);

  return (
    <aside
      id={id}
      ref={asideRef}
      className={`sidebar ${collapsed ? 'collapsed' : 'expanded'} ${mobileOpen ? 'open' : ''}`}
      role="navigation"
      aria-label="Primary"
    >
      <div className="brand">
        <div className="logo" aria-hidden="true">⏱️</div>
        {!collapsed && (
          <div className="brand-text">
            <div className="brand-title">EventEase</div>
            <div className="brand-sub">Ocean Professional</div>
          </div>
        )}
        {/* Inline toggle button for collapsing on desktop */}
        <button
          className="icon-btn side-collapse"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-controls={id}
          aria-expanded={!collapsed}
          onClick={onToggleCollapsed}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          <span aria-hidden="true">{collapsed ? '»' : '«'}</span>
        </button>

        {/* Close button visible only on mobile drawer */}
        <button
          className="icon-btn close-drawer"
          aria-label="Close menu"
          onClick={onCloseMobile}
          title="Close"
        >
          ✕
        </button>
      </div>

      <nav className="nav">
        <NavItem
          label="Events"
          icon="📄"
          active={currentRoute === '/list'}
          onClick={() => onNavigate('/list')}
          collapsed={collapsed}
        />
        <NavItem
          label="Create"
          icon="➕"
          active={currentRoute === '/create'}
          onClick={() => onNavigate('/create')}
          collapsed={collapsed}
        />
      </nav>

      <div className="sidebar-footer">
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          title={collapsed ? (theme === 'light' ? 'Dark mode' : 'Light mode') : undefined}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>
    </aside>
  );
}
