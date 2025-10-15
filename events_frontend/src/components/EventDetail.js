/* EventDetail: shows single event information */
import React from 'react';

// PUBLIC_INTERFACE
export default function EventDetail({ event, loading, error, onBack, onEdit, onDelete }) {
  if (loading && !event) {
    return <div className="notice">Loading event…</div>;
  }
  if (error && !event) {
    return (
      <section className="card">
        <div className="card-header">
          <h2 className="card-title">Event</h2>
        </div>
        <div className="notice error">{String(error)}</div>
        <button className="btn" onClick={onBack}>Back</button>
      </section>
    );
  }
  if (!event) {
    return (
      <section className="card">
        <div className="card-header">
          <h2 className="card-title">Event not found</h2>
        </div>
        <button className="btn" onClick={onBack}>Back</button>
      </section>
    );
  }

  return (
    <section className="card">
      <div className="card-header">
        <div className="badge-row">
          <span className={`badge ${event.status === 'published' ? 'success' : ''}`}>
            {event.status || 'draft'}
          </span>
          {Array.isArray(event.tags) && event.tags.length > 0 && (
            <div className="tags">
              {event.tags.map((t) => (
                <span className="tag" key={t}>{t}</span>
              ))}
            </div>
          )}
        </div>
        <h2 className="card-title">{event.title}</h2>
      </div>

      <div className="detail">
        <div className="detail-row">
          <span className="detail-label">When</span>
          <span className="detail-value">
            {event.start_time ? new Date(event.start_time).toLocaleString() : 'TBD'}
            {event.end_time ? ` - ${new Date(event.end_time).toLocaleString()}` : ''}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Location</span>
          <span className="detail-value">{event.location || 'TBD'}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Capacity</span>
          <span className="detail-value">{event.capacity ?? '—'}</span>
        </div>
        {event.description && (
          <div className="detail-row">
            <span className="detail-label">Description</span>
            <span className="detail-value">{event.description}</span>
          </div>
        )}
      </div>

      <div className="form-actions">
        <button className="btn ghost" onClick={onBack}>Back</button>
        <button className="btn" onClick={onEdit}>Edit</button>
        <button className="btn danger" onClick={onDelete}>Delete</button>
      </div>
    </section>
  );
}
