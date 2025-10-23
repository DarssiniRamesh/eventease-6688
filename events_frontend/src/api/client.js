/**
 * Resolve backend base URL from env with sensible local default.
 * If REACT_APP_API_BASE_URL is not set, default to http://localhost:3001.
 * This avoids hardcoding environment-specific hostnames.
 * Note: value sourced from events_frontend/.env during build/runtime in CRA.
 */
const BASE_URL =
  (process.env.REACT_APP_API_BASE_URL && process.env.REACT_APP_API_BASE_URL.trim()) ||
  'http://localhost:3001';

// Toggle to use mock layer instead of network requests
const USE_MOCK = String(process.env.REACT_APP_USE_MOCK || '').toLowerCase() === 'true';

// Lazy import to avoid bundling mock unless enabled (but CRA inlines env at build time)
let MockAPIRef = null;
if (USE_MOCK) {
  // eslint-disable-next-line global-require
  MockAPIRef = require('./mockData').MockEventsAPI;
}

/**
 * Normalize URL joining to avoid accidental double slashes.
 */
function joinUrl(base, path) {
  const b = base.replace(/\/+$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${b}${p}`;
}

/**
 * Thin fetch wrapper providing JSON handling and error normalization
 */
async function request(path, { method = 'GET', body, headers } = {}) {
  const url = joinUrl(BASE_URL, path);
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
  };
  if (body !== undefined) {
    opts.body = typeof body === 'string' ? body : JSON.stringify(body);
  }
  try {
    const res = await fetch(url, opts);
    const contentType = res.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const data = isJson ? await res.json().catch(() => ({})) : await res.text();
    if (!res.ok) {
      throw new Error(
        (isJson && (data?.detail || data?.message)) ||
          `Request failed: ${res.status} ${res.statusText}`
      );
    }
    return data;
  } catch (err) {
    // Normalize error with base URL hint for easier troubleshooting
    const baseHint = ` [${method} ${path}] (base: ${BASE_URL})`;
    const message =
      (err instanceof Error ? err.message : 'Network error') +
      baseHint +
      ' — If this is a browser CORS error, ensure the backend allows your frontend origin and the base URL is correct.';
    return Promise.reject(new Error(message));
  }
}

// PUBLIC_INTERFACE
export const EventsAPI = USE_MOCK && MockAPIRef
  ? {
      /** Get list of events with optional query params */
      list: (params = {}) => MockAPIRef.list(params),
      /** Get an event by ID */
      get: (id) => MockAPIRef.get(id),
      /** Create a new event */
      create: (payload) => MockAPIRef.create(payload),
      /** Update an existing event */
      update: (id, payload) => MockAPIRef.update(id, payload),
      /** Delete an event */
      remove: (id) => MockAPIRef.remove(id),
      /** Simple health check */
      health: () => MockAPIRef.health(),
    }
  : {
      /** Get list of events with optional query params */
      list: async (params = {}) => {
        const qp = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== '') qp.append(k, v);
        });
        const q = qp.toString();
        return request(`/events${q ? `?${q}` : ''}`, { method: 'GET' });
      },
      /** Get an event by ID */
      get: (id) => request(`/events/${id}`, { method: 'GET' }),
      /** Create a new event */
      create: (payload) => request('/events', { method: 'POST', body: payload }),
      /** Update an existing event */
      update: (id, payload) => request(`/events/${id}`, { method: 'PUT', body: payload }),
      /** Delete an event */
      remove: (id) => request(`/events/${id}`, { method: 'DELETE' }),
      // PUBLIC_INTERFACE
      /** Simple health check to verify backend connectivity from the app */
      health: () => request('/health', { method: 'GET' }),
    };

export default EventsAPI;
