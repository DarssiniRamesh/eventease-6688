const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://vscode-internal-27850-beta.beta01.cloud.kavia.ai:3001';

/**
 * Thin fetch wrapper providing JSON handling and error normalization
 */
async function request(path, { method = 'GET', body, headers } = {}) {
  const url = `${BASE_URL}${path}`;
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
    // Normalize error
    return Promise.reject(err instanceof Error ? err : new Error('Network error'));
  }
}

// PUBLIC_INTERFACE
export const EventsAPI = {
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
};

export default EventsAPI;
