//
// Simple storage utility with JSON support and SSR/disabled storage safety.
//

// PUBLIC_INTERFACE
export function loadJSON(key, fallback = null) {
  /** Load and parse JSON from localStorage; return fallback on error or if unavailable. */
  try {
    if (typeof window === 'undefined' || !window.localStorage) return fallback;
    const raw = window.localStorage.getItem(key);
    if (raw === null || raw === undefined) return fallback;
    try {
      return JSON.parse(raw);
    } catch {
      // if it's a plain string "true"/"false"/number, try to coerce
      if (raw === 'true') return true;
      if (raw === 'false') return false;
      const num = Number(raw);
      if (!Number.isNaN(num)) return num;
      return raw;
    }
  } catch {
    return fallback;
  }
}

// PUBLIC_INTERFACE
export function saveJSON(key, value) {
  /** Stringify and save JSON to localStorage; ignore errors silently. */
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const serialized =
      typeof value === 'string' ? value : JSON.stringify(value);
    window.localStorage.setItem(key, serialized);
  } catch {
    // no-op
  }
}

// PUBLIC_INTERFACE
export function remove(key) {
  /** Remove a key from localStorage; ignore errors silently. */
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.removeItem(key);
  } catch {
    // no-op
  }
}
