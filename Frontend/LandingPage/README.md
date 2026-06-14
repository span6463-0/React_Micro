# LandingPage — Micro-frontend Remote

Public-facing pages: Home, About, Login, and Register. Runs as a **Module Federation remote** consumed by the Shell at runtime.

**Port**: 3001  
**Type**: Remote (exposes components to Shell)

---

## Prerequisites

- Node.js 24.x (`nvm use 24`)
- Shell app running on port 3000 (or run standalone — see below)

---

## Run Locally (with Shell)

Start this remote **before** the Shell so the Shell can load it at startup.

```bash
# From project root
cd Frontend/LandingPage

npm install
npm run dev
```

The remote will be available at **http://localhost:3001** and automatically consumed by the Shell at http://localhost:3000.

---

## Run Standalone (isolated development)

You can develop this remote in isolation without the Shell running:

```bash
npm run dev
# Open http://localhost:3001 directly
```

In standalone mode the Shell's header/footer and Redux store are not present. All pages are still fully functional for UI development.

---

## Available Pages

| Route       | Component  | Description                                   |
| ----------- | ---------- | --------------------------------------------- |
| `/`         | `Home`     | Hero section, feature highlights, CTA buttons |
| `/about`    | `About`    | Platform and company information              |
| `/login`    | `Login`    | Email + password login form                   |
| `/register` | `Register` | New account registration form                 |

---

## Scripts

```bash
npm run dev      # Start dev server on http://localhost:3001
npm run build    # Production build (outputs to dist/)
npm run preview  # Preview the production build locally
npm run lint     # Run ESLint
```

---

## Environment Variables

Create a `.env` file in this directory if you need to override the BFF URL:

```env
VITE_API_BASE_URL=http://localhost:4000
```

---

## Exposed Module Federation Components

```javascript
// Available for Shell to import at runtime
'./App'      → src/App.jsx
'./Home'     → src/pages/Home/Home.jsx
'./About'    → src/pages/About/About.jsx
'./Login'    → src/pages/Login/Login.jsx
'./Register' → src/pages/Register/Register.jsx
```
