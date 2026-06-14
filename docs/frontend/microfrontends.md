# Micro-frontend Remotes

Each remote is a self-contained Vite + React application that exposes components for the Shell to consume.

---

## LandingPage Remote (`Frontend/LandingPage/`)

**Port**: 3001  
**Exposes**: `App`, `Home`, `About`, `Login`, `Register`

### Pages

| Page       | Route       | Description                           |
| ---------- | ----------- | ------------------------------------- |
| `Home`     | `/`         | Hero section, feature highlights, CTA |
| `About`    | `/about`    | Company and platform information      |
| `Login`    | `/login`    | Email/password login form             |
| `Register` | `/register` | New account registration form         |

### Auth Forms

- Client-side validation using custom validators from `shared/utils/validation.js`
- Dispatches `login` / `register` thunks from `authSlice`
- On success, redirects to `/dashboard`
- Displays inline error messages on failure

---

## Dashboard Remote (`Frontend/Dashboard/`)

**Port**: 3002  
**Exposes**: `App`, `Overview`, `Profile`, `Settings`

### Pages

| Page       | Route                 | Description                       |
| ---------- | --------------------- | --------------------------------- |
| `Overview` | `/dashboard`          | Stats cards, recent activity feed |
| `Profile`  | `/dashboard/profile`  | View and edit user profile        |
| `Settings` | `/dashboard/settings` | Notification and UI preferences   |

### Layout

The `DashboardLayout` component renders a sidebar with navigation links. All dashboard routes share this layout via nested routing.

---

## Item-management Remote (`Frontend/Item-management/`)

**Port**: 3003  
**Exposes**: `App`, `ItemList`, `ItemDetail`, `ItemCreate`

### Pages

| Page         | Route        | Description                             |
| ------------ | ------------ | --------------------------------------- |
| `ItemList`   | `/items`     | Searchable, filterable, paginated table |
| `ItemCreate` | `/items/new` | Create item form with validation        |
| `ItemDetail` | `/items/:id` | View item + edit in place               |

### Features

- **Search**: Debounced text search (300ms) via `useDebounce`
- **Filters**: Category and status dropdowns
- **Pagination**: `usePagination` hook + `Pagination` shared component
- **Optimistic updates**: RTK Query cache invalidation on mutations

---

## Running Each Remote

```bash
# Run a remote independently (for isolated development)
cd Frontend/LandingPage && npm run dev   # http://localhost:3001
cd Frontend/Dashboard && npm run dev     # http://localhost:3002
cd Frontend/Item-management && npm run dev # http://localhost:3003
```

Remotes can be developed in isolation. When running standalone, they will not have the Shell's header/footer or shared auth state — use a local `MockProvider` in `main.jsx` for isolated testing.

---

## Remote Vite Config Pattern

```javascript
// vite.config.js (remote pattern)
federation({
  name: 'dashboard',
  filename: 'remoteEntry.js',
  exposes: {
    './App': './src/App.jsx',
    './Overview': './src/pages/Overview/Overview.jsx',
    './Profile': './src/pages/Profile/Profile.jsx',
  },
  shared: ['react', 'react-dom', 'react-router-dom', '@reduxjs/toolkit', 'react-redux'],
});
```
