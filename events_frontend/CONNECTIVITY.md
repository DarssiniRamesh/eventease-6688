# Frontend ↔ Backend Connectivity

This frontend expects a FastAPI backend exposing:
- Health endpoint at GET /health (200 OK)
- Events endpoints at /events and /events/{id}

Configuration:
- PUBLIC_INTERFACE
- Environment variable: REACT_APP_API_BASE_URL
  - Example local dev: REACT_APP_API_BASE_URL=http://localhost:3001
  - If not set, the app defaults to http://localhost:3001.

CORS:
- Backend must allow origin http://localhost:3000 (the CRA dev server).
- Allow methods: GET, POST, PUT, DELETE, OPTIONS
- Allow headers: Content-Type, Authorization (if needed)
- Allow credentials: false (unless sessions required)

Troubleshooting:
- Open browser devtools, check Network tab for failed requests.
- Verify GET {REACT_APP_API_BASE_URL}/health returns 200 OK.
- Ensure no double slashes in URL; client normalizes with joinUrl.
- If hosted in a remote preview, set REACT_APP_API_BASE_URL to the backend preview host.
