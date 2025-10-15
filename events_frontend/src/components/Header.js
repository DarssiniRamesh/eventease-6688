/* Header: top bar with title, subtitle and primary action */
import React from 'react';

// PUBLIC_INTERFACE
export default function Header({ title, subtitle, onPrimaryAction }) {
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="title">{title}</h1>
        <p className="subtitle">{subtitle}</p>
      </div>
      <div className="header-actions">
        <button className="btn primary" onClick={onPrimaryAction}>
          + New Event
        </button>
      </div>
    </header>
  );
}
