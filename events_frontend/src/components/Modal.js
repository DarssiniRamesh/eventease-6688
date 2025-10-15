/* Modal: confirmation dialog with overlay and keyboard handling */
import React, { useEffect } from 'react';

// PUBLIC_INTERFACE
export default function Modal({ open, title, message, confirmLabel = 'Confirm', confirmColor = 'primary', onConfirm, onCancel }) {
  useEffect(() => {
    const onKey = (e) => {
      if (!open) return;
      if (e.key === 'Escape') onCancel?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="modal-root" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-backdrop" onClick={onCancel} />
      <div className="modal">
        <h3 id="modal-title" className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button className="btn ghost" onClick={onCancel}>Cancel</button>
          <button className={`btn ${confirmColor === 'danger' ? 'danger' : 'primary'}`} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
