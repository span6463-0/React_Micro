# Shell Application

The Shell is the Module Federation **host** — the top-level React application that bootstraps the entire frontend.

**Port**: 3000  
**Location**: `Frontend/shell/`

---

## Responsibilities

1. **Bootstrap**: Mount the React app, wrap with Redux `<Provider>` and `<BrowserRouter>`
2. **Layout**: Render the global `Header`, navigation, and `Footer`
3. **Routing**: Define all top-level routes; lazy-load remotes on demand
4. **Redux Store**: Create and own the shared Redux store (consumed by all remotes)
5. **Auth Guard**: Protect routes with `PrivateRoute` component
6. **Error Handling**: Wrap lazy remotes in `<ErrorBoundary>` and `<Suspense>`

---

## Key Files

```
Frontend/shell/
├── vite.config.js        Module Federation host config + remote URLs
├── tailwind.config.js    Tailwind design tokens
├── src/
│   ├── main.jsx          Entry: wraps App with Provider + Router
│   ├── App.jsx           Route definitions, lazy remote imports
│   ├── store/
│   │   ├── index.js      configureStore: auth + api slices
│   │   ├── authSlice.js  Auth state, login/logout reducers
│   │   └── apiSlice.js   RTK Query base with reauth logic
│   └── components/
│       ├── Layout/       Header, Footer, nav links
│       ├── ErrorBoundary/ React error boundary wrapper
│       └── LoadingSpinner/ Suspense fallback component
```

---

## Vite Module Federation Config

```javascript
// vite.config.js (simplified)
federation({
  name: 'shell',
  remotes: {
    landingPage: 'http://localhost:3001/assets/remoteEntry.js',
    dashboard: 'http://localhost:3002/assets/remoteEntry.js',
    itemManagement: 'http://localhost:3003/assets/remoteEntry.js',
  },
  shared: ['react', 'react-dom', 'react-router-dom', '@reduxjs/toolkit', 'react-redux'],
});
```

In production, remote URLs are configured via environment variables:

```env
VITE_LANDING_PAGE_URL=https://cdn.example.com/landing
VITE_DASHBOARD_URL=https://cdn.example.com/dashboard
VITE_ITEM_MANAGEMENT_URL=https://cdn.example.com/items
```

---

## Adding a New Remote

1. Create a new Vite app under `Frontend/`
2. Configure it as a Module Federation remote (expose your components)
3. Add its URL to `shell/vite.config.js` remotes
4. Add a lazy import and route in `shell/src/App.jsx`
5. Wrap the lazy import in `<ErrorBoundary>` and `<Suspense>`

---

## Running the Shell

```bash
cd Frontend/shell
npm install
npm run dev     # http://localhost:3000

# Build for production
npm run build

# Preview production build
npm run preview
```
