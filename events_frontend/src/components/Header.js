/* Header: top bar with title, subtitle and primary action */
import React from 'react';

// PUBLIC_INTERFACE
export default function Header({
  title,
  subtitle,
  onPrimaryAction,
  onToggleMenu,
  sidebarCollapsed,
  onToggleSidebarCollapsed,
}) {
  return (
    <header className="header">
      <div className="header-left">
        {/* Hamburger: visible on small screens via CSS */}
        <button
          className="icon-btn hamburger"
          aria-label="Open menu"
          aria-controls="app-sidebar"
          aria-expanded="false"
          onClick={onToggleMenu}
        >
          <span aria-hidden="true">☰</span>
        </button>

        <h1 className="title">{title}</h1>
        <p className="subtitle">{subtitle}</p>
      </div>
      <div className="header-actions">
        {/* Optional collapse toggle for desktop accessibility */}
        <button
          className="icon-btn collapse-toggle"
          aria-label="Toggle sidebar collapse"
          aria-controls="app-sidebar"
          aria-expanded={!sidebarCollapsed}
          onClick={onToggleSidebarCollapsed}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span aria-hidden="true">{sidebarCollapsed ? '»' : '«'}</span>
        </button>

        <button className="btn primary" onClick={onPrimaryAction}>
          + New Event
        </button>
      </div>
    </header>
  );
}
