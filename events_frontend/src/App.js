import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import './styles/theme.css';
import './index.css';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import EventList from './components/EventList';
import EventDetail from './components/EventDetail';
import EventForm from './components/EventForm';
import Modal from './components/Modal';
import useEvents from './hooks/useEvents';
import { loadJSON, saveJSON } from './utils/storage';

// PUBLIC_INTERFACE
function App() {
  /**
   * App composes the layout with a left sidebar, a sticky header, and a main content area.
   * Implements simple hash-based routing: #/list, #/create, #/edit/:id, #/view/:id
   * Provides Ocean Professional theming and passes CRUD handlers via useEvents hook.
   * Adds collapsible sidebar (persisted), and responsive mobile drawer behavior.
   */
  const [route, setRoute] = useState(window.location.hash.replace('#', '') || '/list');
  const [confirmState, setConfirmState] = useState({ open: false, id: null });

  // Theme management using data-theme on html element
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Sidebar UI state persistence
  const SIDEBAR_KEY = 'ee.sidebar.collapsed';
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => !!loadJSON(SIDEBAR_KEY, false));
  useEffect(() => {
    saveJSON(SIDEBAR_KEY, sidebarCollapsed);
  }, [sidebarCollapsed]);

  // Mobile drawer state
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close drawer on route change for better UX
  useEffect(() => {
    const onHashChange = () => {
      setRoute(window.location.hash.replace('#', '') || '/list');
      setMobileOpen(false);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Global ESC key to close mobile drawer
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const navigate = (path) => {
    window.location.hash = path;
  };

  const {
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
  } = useEvents();

  // Derive current view and id from route
  const { view, id } = useMemo(() => {
    const parts = route.split('/').filter(Boolean); // e.g., ['edit','123']
    const v = parts[0] ? `/${parts[0]}` : '/list';
    const identifier = parts[1] || null;
    return { view: v, id: identifier };
  }, [route]);

  const handleCreate = async (payload) => {
    const ok = await createEvent(payload);
    if (ok) navigate('/list');
  };

  const handleUpdate = async (payload) => {
    const ok = await updateEvent(id, payload);
    if (ok) navigate('/list');
  };

  const handleDelete = async (eventId) => {
    setConfirmState({ open: true, id: eventId });
  };

  const confirmDelete = async () => {
    if (confirmState.id) {
      await deleteEvent(confirmState.id);
      setConfirmState({ open: false, id: null });
      navigate('/list');
    }
  };

  const cancelDelete = () => setConfirmState({ open: false, id: null });

  const currentEvent = id ? getEventById(id) : null;

  // Handlers passed to children
  const toggleSidebarCollapsed = () => setSidebarCollapsed((c) => !c);
  const openMobile = () => setMobileOpen(true);
  const closeMobile = () => setMobileOpen(false);

  return (
    <div
      className={`app-root ${sidebarCollapsed ? 'is-collapsed' : 'is-expanded'} ${
        mobileOpen ? 'drawer-open' : ''
      }`}
    >
      <Sidebar
        id="app-sidebar"
        currentRoute={view}
        onNavigate={navigate}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={toggleSidebarCollapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={closeMobile}
      />

      {/* Main area is explicitly second in DOM to avoid any grid auto-placement quirks */}
      <div className="main-area">
        <Header
          title="EventEase"
          subtitle="Plan, publish, and manage events with ease"
          onPrimaryAction={() => navigate('/create')}
          // Hamburger toggles drawer on small screens
          onToggleMenu={openMobile}
          sidebarCollapsed={sidebarCollapsed}
          // Optionally expose collapse toggle via header on desktop
          onToggleSidebarCollapsed={toggleSidebarCollapsed}
        />
        <main className="content-area" tabIndex={-1}>
          {view === '/list' && (
            <EventList
              events={events}
              loading={loading}
              error={error}
              filters={filters}
              setFilters={setFilters}
              onRefresh={fetchEvents}
              onView={(eid) => navigate(`/view/${eid}`)}
              onEdit={(eid) => navigate(`/edit/${eid}`)}
              onDelete={handleDelete}
            />
          )}

          {view === '/view' && (
            <EventDetail
              event={currentEvent}
              loading={loading}
              error={error}
              onBack={() => navigate('/list')}
              onEdit={() => id && navigate(`/edit/${id}`)}
              onDelete={() => id && handleDelete(id)}
            />
          )}

          {view === '/create' && (
            <EventForm
              mode="create"
              onCancel={() => navigate('/list')}
              onSubmit={handleCreate}
            />
          )}

          {view === '/edit' && (
            <EventForm
              mode="edit"
              initialData={currentEvent}
              loading={loading}
              onCancel={() => navigate('/list')}
              onSubmit={handleUpdate}
            />
          )}
        </main>
        <footer className="footer">
          <span>© {new Date().getFullYear()} EventEase</span>
          <span className="dot">•</span>
          <span>Ocean Professional Theme</span>
        </footer>
      </div>

      {/* Backdrop for mobile drawer: fixed overlay on mobile, hidden on desktop */}
      <div
        className={`sidebar-backdrop ${mobileOpen ? 'show' : ''}`}
        aria-hidden={!mobileOpen}
        onClick={closeMobile}
      />

      <Modal
        open={confirmState.open}
        title="Delete event?"
        message="This action will permanently remove the event. You can’t undo this."
        confirmLabel="Delete"
        confirmColor="danger"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}

export default App;
