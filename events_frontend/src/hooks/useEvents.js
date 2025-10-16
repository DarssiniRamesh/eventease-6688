import { useCallback, useEffect, useMemo, useState } from 'react';
import { EventsAPI } from '../api/client';

// PUBLIC_INTERFACE
export default function useEvents() {
  /**
   * Manages events list and CRUD operations with loading and error state.
   * Filters: search, status, date (yyyy-mm-dd)
   */
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ search: '', status: '', date: '' });

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;
      if (filters.date) params.date = filters.date;
      const data = await EventsAPI.list(params).catch((e) => {
        // Gracefully handle missing backend
        throw new Error(
          `Unable to load events. Ensure backend is running and CORS allows http://localhost:3000. ${e?.message || ''}`
        );
      });
      setEvents(Array.isArray(data) ? data : data?.items || []);
    } catch (err) {
      setError(err);
      setEvents([]); // keep consistent empty state
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const createEvent = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      await EventsAPI.create(payload);
      await fetchEvents();
      return true;
    } catch (err) {
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchEvents]);

  const updateEvent = useCallback(async (id, payload) => {
    setLoading(true);
    setError(null);
    try {
      await EventsAPI.update(id, payload);
      await fetchEvents();
      return true;
    } catch (err) {
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchEvents]);

  const deleteEvent = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await EventsAPI.remove(id);
      await fetchEvents();
      return true;
    } catch (err) {
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchEvents]);

  const getEventById = useCallback((id) => {
    return (events || []).find((e) => String(e.id) === String(id)) || null;
  }, [events]);

  return {
    events,
    loading,
    error,
    filters,
    setFilters,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventById,
  };
}
