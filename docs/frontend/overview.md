# Frontend Overview

The React Micro frontend is a **Module Federation** microfrontend system. A central Shell application dynamically loads independent Remote applications at runtime.

---

## Applications

| App             | Port | Type    | Exposes                          |
| --------------- | ---- | ------- | -------------------------------- |
| Shell           | 3000 | Host    | Layout, routing, Redux store     |
| LandingPage     | 3001 | Remote  | Home, About, Login, Register     |
| Dashboard       | 3002 | Remote  | Overview, Profile, Settings      |
| Item-management | 3003 | Remote  | ItemList, ItemDetail, ItemCreate |
| shared          | —    | Library | Components, hooks, utils         |

---

## Module Federation Architecture

```
Shell (Host)
├── Loads at runtime:
│   ├── landingPage → http://localhost:3001/assets/remoteEntry.js
│   ├── dashboard   → http://localhost:3002/assets/remoteEntry.js
│   └── itemManagement → http://localhost:3003/assets/remoteEntry.js
│
├── Provides to all remotes (shared singletons):
│   ├── react / react-dom
│   ├── react-router-dom
│   └── @reduxjs/toolkit / react-redux
```

Each remote is a fully independent Vite application that can:

- Be developed in isolation on its own port
- Be deployed independently without rebuilding the shell
- Share state and routing context from the shell via singleton modules

---

## Routing Structure

```
/                    → LandingPage: Home
/about               → LandingPage: About
/login               → LandingPage: Login
/register            → LandingPage: Register
/dashboard           → Dashboard: Overview  (protected)
/dashboard/profile   → Dashboard: Profile   (protected)
/dashboard/settings  → Dashboard: Settings  (protected)
/items               → Item-management: List      (protected)
/items/new           → Item-management: Create    (protected)
/items/:id           → Item-management: Detail    (protected)
```

Protected routes use the `PrivateRoute` component that checks Redux auth state and redirects to `/login` if unauthenticated.

---

## State Management

All state lives in the Shell's Redux store and is shared with remotes through the Module Federation singleton pattern.

```
store/
├── index.js          Redux store setup with RTK
├── authSlice.js      Auth state: user, token, loading, error
└── apiSlice.js       RTK Query base API with auto-refresh
```

### Auth State Shape

```javascript
{
  auth: {
    user: { id, email, role } | null,
    token: "<jwt>" | null,
    isAuthenticated: false,
    loading: false,
    error: null
  }
}
```

### RTK Query Endpoints (apiSlice)

- Auto-refreshes JWT on 401 responses via `baseQueryWithReauth`
- Provides `useGetUsersQuery`, `useGetItemsQuery`, etc.
- Handles cache invalidation via tag-based invalidation

---

## Shared Component Library (`Frontend/shared`)

```
components/
├── Button/       Variants: primary, secondary, danger, ghost
├── Input/        With label, error, helper text
├── Card/         Container with optional header/footer
├── Modal/        Accessible modal with backdrop
├── Table/        Sortable, with pagination integration
├── Pagination/   Page navigation component
├── Alert/        Types: success, error, warning, info
└── Badge/        Status indicators

hooks/
├── useAuth.js           Auth state + login/logout actions
├── useDebounce.js       Debounce search/filter inputs
├── useLocalStorage.js   Persistent state in localStorage
├── useClickOutside.js   Close dropdowns on outside click
└── usePagination.js     Pagination state management

utils/
├── date.js       formatDate, formatRelativeTime, formatDateTime
├── number.js     formatCurrency, formatPercent, formatCompact
├── string.js     truncate, capitalize, slugify, initials
├── validation.js isEmail, isStrongPassword, isUUID
└── classnames.js cn() — conditional class merging (clsx-based)
```

---

## Styling

Tailwind CSS 3.x is used throughout. Configuration is in each app's `tailwind.config.js` with a shared design system:

```javascript
// Shared color tokens
colors: {
  primary: blue-600,
  secondary: gray-600,
  success: green-500,
  error: red-500,
  warning: yellow-500
}
```

Class variants for components are defined using `class-variance-authority` (CVA) for type-safe variant props.

---

## Individual App Docs

- [Shell (Host)](./shell.md)
- [Micro-frontends (Remotes)](./microfrontends.md)
- [State Management](./state-management.md)
