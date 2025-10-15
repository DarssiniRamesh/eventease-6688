/* EventForm: supports create and edit modes with validation */
import React, { useEffect, useState } from 'react';

const defaultEvent = {
  title: '',
  description: '',
  start_time: '',
  end_time: '',
  location: '',
  capacity: '',
  status: 'draft',
  tags: '',
};

// PUBLIC_INTERFACE
export default function EventForm({ mode = 'create', initialData, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(defaultEvent);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        start_time: initialData.start_time ? initialData.start_time.slice(0, 16) : '',
        end_time: initialData.end_time ? initialData.end_time.slice(0, 16) : '',
        location: initialData.location || '',
        capacity: initialData.capacity ?? '',
        status: initialData.status || 'draft',
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : '',
      });
    }
  }, [mode, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const toPayload = () => {
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      start_time: form.start_time ? new Date(form.start_time).toISOString() : null,
      end_time: form.end_time ? new Date(form.end_time).toISOString() : null,
      location: form.location.trim(),
      capacity: form.capacity ? Number(form.capacity) : null,
      status: form.status,
      tags: form.tags
        ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
    };
    return payload;
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.title) {
      setError('Title is required');
      return;
    }
    if (form.start_time && form.end_time) {
      const st = new Date(form.start_time).getTime();
      const et = new Date(form.end_time).getTime();
      if (et < st) {
        setError('End time must be after start time');
        return;
      }
    }
    try {
      await onSubmit(toPayload());
    } catch (err) {
      setError(err?.message || 'Failed to submit');
    }
  };

  return (
    <section className="card">
      <div className="card-header">
        <h2 className="card-title">{mode === 'edit' ? 'Edit Event' : 'Create Event'}</h2>
      </div>

      {error && <div className="notice error">{String(error)}</div>}

      <form className="form" onSubmit={handleSubmit}>
        <div className="grid two">
          <label className="field">
            <span className="label">Title</span>
            <input
              className="input"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter a clear, concise title"
              required
            />
          </label>

          <label className="field">
            <span className="label">Status</span>
            <select className="input" name="status" value={form.status} onChange={handleChange}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
        </div>

        <label className="field">
          <span className="label">Description</span>
          <textarea
            className="input"
            rows={4}
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the event details..."
          />
        </label>

        <div className="grid two">
          <label className="field">
            <span className="label">Start Time</span>
            <input
              className="input"
              type="datetime-local"
              name="start_time"
              value={form.start_time}
              onChange={handleChange}
            />
          </label>
          <label className="field">
            <span className="label">End Time</span>
            <input
              className="input"
              type="datetime-local"
              name="end_time"
              value={form.end_time}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="grid two">
          <label className="field">
            <span className="label">Location</span>
            <input
              className="input"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g., Main Hall A"
            />
          </label>
          <label className="field">
            <span className="label">Capacity</span>
            <input
              className="input"
              type="number"
              min="0"
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
              placeholder="e.g., 100"
            />
          </label>
        </div>

        <label className="field">
          <span className="label">Tags (comma-separated)</span>
          <input
            className="input"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="e.g., meetup, workshop"
          />
        </label>

        <div className="form-actions">
          <button className="btn ghost" type="button" onClick={onCancel}>Cancel</button>
          <button className="btn primary" disabled={loading} type="submit">
            {mode === 'edit' ? 'Save Changes' : 'Create Event'}
          </button>
        </div>
      </form>
    </section>
  );
}
