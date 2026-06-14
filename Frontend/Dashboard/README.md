# Dashboard — Micro-frontend Remote

Authenticated user dashboard: Overview stats, Profile management, and Settings. Runs as a **Module Federation remote** consumed by the Shell at runtime.

**Port**: 3002  
**Type**: Remote (exposes components to Shell)  
**Access**: Protected — requires an authenticated session from the Shell.

---

## Prerequisites

- Node.js 24.x (`nvm use 24`)
- Infrastructure running: `cd Infrastructure/docker && docker-compose up -d`
- BFF Gateway running on port 4000
- Shell running on port 3000 (for full auth context)

---

## Run Locally (with Shell)

Start this remote **before** the Shell:

```bash
cd Frontend/Dashboard

npm install
npm run dev
```

Then open the full app at **http://localhost:3000** and navigate to `/dashboard` after logging in.

---

## Run Standalone (isolated development)

```bash
npm run dev
# Open http://localhost:3002 directly
```

In standalone mode, auth state is not available from the Shell. Add a `MockProvider` in `src/main.jsx` with a mock Redux store to develop UI in isolation.

---

## Available Pages

| Route                 | Component  | Description                       |
| --------------------- | ---------- | --------------------------------- |
| `/dashboard`          | `Overview` | Stats cards, recent activity feed |
| `/dashboard/profile`  | `Profile`  | View and edit user profile        |
| `/dashboard/settings` | `Settings` | Notification and UI preferences   |

---

## Scripts

```bash
npm run dev      # Start dev server on http://localhost:3002
npm run build    # Production build (outputs to dist/)
npm run preview  # Preview the production build locally
npm run lint     # Run ESLint
```

---

## Environment Variables

```env
VITE_API_BASE_URL=http://localhost:4000
```

---

## Exposed Module Federation Components

```javascript
// Available for Shell to import at runtime
'./App'      → src/App.jsx
'./Overview' → src/pages/Overview/Overview.jsx
'./Profile'  → src/pages/Profile/Profile.jsx
'./Settings' → src/pages/Settings/Settings.jsx
```
