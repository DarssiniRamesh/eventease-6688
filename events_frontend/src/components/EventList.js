/* EventList: lists events with filters: status/date/search */
import React, { useEffect, useMemo, useState } from 'react';

function Empty({ onRefresh }) {
  return (
    <div className="empty">
      <div className="empty-icon">🗓️</div>
      <div className="empty-title">No events found</div>
      <p className="empty-sub">Try adjusting filters or create a new event.</p>
      <button className="btn" onClick={onRefresh}>Refresh</button>
    </div>
  );
}

// PUBLIC_INTERFACE
export default function EventList({
  events,
  loading,
  error,
  filters,
  setFilters,
  onRefresh,
  onView,
  onEdit,
  onDelete,
}) {
  const [localSearch, setLocalSearch] = useState(filters.search || '');
  const [localStatus, setLocalStatus] = useState(filters.status || '');
  const [localDate, setLocalDate] = useState(filters.date || '');

  useEffect(() => {
    setLocalSearch(filters.search || '');
    setLocalStatus(filters.status || '');
    setLocalDate(filters.date || '');
  }, [filters]);

  const filtered = useMemo(() => {
    let list = events || [];
    if (localSearch) {
      const q = localSearch.toLowerCase();
      list = list.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q) ||
          e.location?.toLowerCase().includes(q)
      );
    }
    if (localStatus) list = list.filter((e) => e.status === localStatus);
    if (localDate) {
      const d = new Date(localDate);
      list = list.filter((e) => {
        const st = e.start_time ? new Date(e.start_time) : null;
        return st && st.toDateString() === d.toDateString();
      });
    }
    return list;
  }, [events, localSearch, localStatus, localDate]);

  const applyFilters = () => {
    setFilters({ search: localSearch, status: localStatus, date: localDate });
  };

  return (
    <section className="card">
      <div className="card-header">
        <h2 className="card-title">Events</h2>
        <div className="filters">
          <input
            className="input"
            placeholder="Search..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
          <select
            className="input"
            value={localStatus}
            onChange={(e) => setLocalStatus(e.target.value)}
          >
            <option value="">All statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <input
            className="input"
            type="date"
            value={localDate}
            onChange={(e) => setLocalDate(e.target.value)}
          />
          <button className="btn" onClick={applyFilters}>Apply</button>
          <button className="btn ghost" onClick={onRefresh}>Refresh</button>
          <a className="btn ghost" href={(process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001') + '/health'} target="_blank" rel="noreferrer">Open Health</a>
        </div>
      </div>

      {loading && <div className="notice">Loading events…</div>}
      {error && <div className="notice error">{String(error)}</div>}

      {!loading && (!filtered || filtered.length === 0) ? (
        <Empty onRefresh={onRefresh} />
      ) : (
        <div className="list">
          {filtered.map((e) => (
            <div className="list-item" key={e.id}>
              <div className="list-item-main">
                <div className="badge-row">
                  <span className={`badge ${e.status === 'published' ? 'success' : ''}`}>
                    {e.status || 'draft'}
                  </span>
                  {Array.isArray(e.tags) && e.tags.length > 0 && (
                    <div className="tags">
                      {e.tags.map((t) => (
                        <span className="tag" key={t}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
                <h3 className="item-title">{e.title}</h3>
                <p className="item-sub">
                  {e.location ? `${e.location} • ` : ''}{' '}
                  {e.start_time ? new Date(e.start_time).toLocaleString() : 'TBD'}
                  {e.end_time ? ` - ${new Date(e.end_time).toLocaleString()}` : ''}
                </p>
                {e.description && <p className="item-desc">{e.description}</p>}
              </div>
              <div className="list-item-actions">
                <button className="btn ghost" onClick={() => onView(e.id)}>View</button>
                <button className="btn" onClick={() => onEdit(e.id)}>Edit</button>
                <button className="btn danger" onClick={() => onDelete(e.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
