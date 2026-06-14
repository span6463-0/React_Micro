# Item-management — Micro-frontend Remote

Item CRUD interface: list, search, create, and view items. Runs as a **Module Federation remote** consumed by the Shell at runtime.

**Port**: 3003  
**Type**: Remote (exposes components to Shell)  
**Access**: Protected — requires an authenticated session from the Shell.

---

## Prerequisites

- Node.js 24.x (`nvm use 24`)
- Infrastructure running: `cd Infrastructure/docker && docker-compose up -d`
- BFF Gateway running on port 4000
- Item API running on port 3003 (container port)
- Shell running on port 3000 (for full auth context)

---

## Run Locally (with Shell)

Start this remote **before** the Shell:

```bash
cd Frontend/Item-management

npm install
npm run dev
```

Then open the full app at **http://localhost:3000** and navigate to `/items` after logging in.

---

## Run Standalone (isolated development)

```bash
npm run dev
# Open http://localhost:3003 directly
```

In standalone mode, add a mock Redux store and mock API responses for isolated UI development.

---

## Available Pages

| Route        | Component    | Description                                  |
| ------------ | ------------ | -------------------------------------------- |
| `/items`     | `ItemList`   | Searchable, filterable, paginated item table |
| `/items/new` | `ItemCreate` | Create item form with validation             |
| `/items/:id` | `ItemDetail` | View item details + inline edit              |

---

## Features

- **Search**: Debounced text search (300ms delay)
- **Filters**: Category and status dropdowns
- **Pagination**: Page navigation with configurable page size
- **Optimistic updates**: Cache invalidation via RTK Query tags

---

## Scripts

```bash
npm run dev      # Start dev server on http://localhost:3003
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
'./App'        → src/App.jsx
'./ItemList'   → src/pages/ItemList/ItemList.jsx
'./ItemDetail' → src/pages/ItemDetail/ItemDetail.jsx
'./ItemCreate' → src/pages/ItemCreate/ItemCreate.jsx
```
