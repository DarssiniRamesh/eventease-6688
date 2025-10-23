//
// Mock data module for Events API.
// Provides localStorage-backed CRUD to simulate a backend.
//
// PUBLIC INTERFACES are documented with "PUBLIC_INTERFACE" comments.
//

const STORAGE_KEY = 'eventease_mock_events_v1';
const ID_KEY = 'eventease_mock_next_id_v1';

// Seed data for first run
const seedEvents = [
  {
    id: 1,
    title: 'Frontend Guild: React Patterns 2025',
    description: 'Deep dive into hooks, state machines, and performance tips.',
    start_time: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    end_time: new Date(Date.now() + 26 * 3600 * 1000).toISOString(),
    location: 'Main Hall A',
    capacity: 120,
    status: 'published',
    tags: ['react', 'frontend', 'guild'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'API Design Workshop',
    description: 'Hands-on session on REST, OpenAPI, and pragmatic endpoints.',
    start_time: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(),
    end_time: new Date(Date.now() + 3 * 24 * 3600 * 1000 + 2 * 3600 * 1000).toISOString(),
    location: 'Room 204',
    capacity: 60,
    status: 'draft',
    tags: ['api', 'backend', 'workshop'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'DevOps Roundtable',
    description: 'Open discussion on CI/CD, infrastructure as code, and observability.',
    start_time: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(),
    end_time: new Date(Date.now() + 5 * 24 * 3600 * 1000 + 90 * 60 * 1000).toISOString(),
    location: 'Auditorium',
    capacity: 200,
    status: 'published',
    tags: ['devops', 'platform'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedEvents));
      localStorage.setItem(ID_KEY, String(4)); // next ID after seeds
      return [...seedEvents];
    }
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [...seedEvents];
  }
}

function writeStore(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function readNextId() {
  const raw = localStorage.getItem(ID_KEY);
  const val = raw ? parseInt(raw, 10) : NaN;
  if (!val || val < 1) {
    localStorage.setItem(ID_KEY, String(1));
    return 1;
  }
  return val;
}

function bumpNextId() {
  const next = readNextId() + 1;
  localStorage.setItem(ID_KEY, String(next));
  return next;
}

function matchesFilters(e, params = {}) {
  const { search, status, date } = params;
  let ok = true;
  if (search) {
    const q = String(search).toLowerCase();
    const hay = [
      e.title || '',
      e.description || '',
      e.location || '',
      ...(Array.isArray(e.tags) ? e.tags : []),
    ]
      .join(' ')
      .toLowerCase();
    ok = ok && hay.includes(q);
  }
  if (status) ok = ok && e.status === status;
  if (date) {
    const d = new Date(date);
    const st = e.start_time ? new Date(e.start_time) : null;
    ok = ok && !!st && st.toDateString() === d.toDateString();
  }
  return ok;
}

function normalizeCreate(payload) {
  const now = new Date().toISOString();
  return {
    id: readNextId(),
    title: payload.title || 'Untitled',
    description: payload.description ?? '',
    start_time: payload.start_time ?? now,
    end_time: payload.end_time ?? payload.start_time ?? now,
    location: payload.location ?? '',
    capacity: payload.capacity ?? null,
    status: payload.status === 'published' ? 'published' : 'draft',
    tags: Array.isArray(payload.tags) ? payload.tags : [],
    created_at: now,
    updated_at: now,
  };
}

function normalizeUpdate(existing, payload) {
  const now = new Date().toISOString();
  return {
    ...existing,
    title: payload.title ?? existing.title,
    description: payload.description ?? existing.description,
    start_time: payload.start_time ?? existing.start_time,
    end_time: payload.end_time ?? existing.end_time,
    location: payload.location ?? existing.location,
    capacity: payload.capacity ?? existing.capacity,
    status:
      payload.status === 'published' || payload.status === 'draft'
        ? payload.status
        : existing.status,
    tags: payload.tags ? (Array.isArray(payload.tags) ? payload.tags : existing.tags) : existing.tags,
    updated_at: now,
  };
}

// Simulate small latency for realism
function delay(ms = 120) {
  return new Promise((r) => setTimeout(r, ms));
}

// PUBLIC_INTERFACE
export async function getEvents(params = {}) {
  /** Returns a filtered list of events (simulating GET /events). */
  await delay();
  const items = readStore();
  return items.filter((e) => matchesFilters(e, params));
}

// PUBLIC_INTERFACE
export async function getEventById(id) {
  /** Returns a single event by ID (simulating GET /events/:id). */
  await delay();
  const items = readStore();
  return items.find((e) => String(e.id) === String(id)) || null;
}

// PUBLIC_INTERFACE
export async function createEvent(payload) {
  /** Creates an event (simulating POST /events). */
  await delay();
  const items = readStore();
  const item = normalizeCreate(payload || {});
  items.push(item);
  writeStore(items);
  bumpNextId();
  return item;
}

// PUBLIC_INTERFACE
export async function updateEvent(id, payload) {
  /** Updates an event (simulating PUT /events/:id). */
  await delay();
  const items = readStore();
  const idx = items.findIndex((e) => String(e.id) === String(id));
  if (idx === -1) throw new Error('Event not found');
  const updated = normalizeUpdate(items[idx], payload || {});
  items[idx] = updated;
  writeStore(items);
  return updated;
}

// PUBLIC_INTERFACE
export async function deleteEvent(id) {
  /** Deletes an event (simulating DELETE /events/:id). */
  await delay();
  const items = readStore();
  const idx = items.findIndex((e) => String(e.id) === String(id));
  if (idx === -1) throw new Error('Event not found');
  const next = [...items.slice(0, idx), ...items.slice(idx + 1)];
  writeStore(next);
  return true;
}

// PUBLIC_INTERFACE
export async function health() {
  /** Simulated health endpoint. Returns a simple ok payload. */
  await delay(60);
  return { status: 'ok', mode: 'mock' };
}

// PUBLIC_INTERFACE
export const MockEventsAPI = {
  list: getEvents,
  get: getEventById,
  create: createEvent,
  update: updateEvent,
  remove: deleteEvent,
  health,
};

export default MockEventsAPI;
