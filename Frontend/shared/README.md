# Frontend Shared Library

Shared React components, hooks, and utilities consumed by all micro-frontend remotes. This is a **library** — it is not a standalone app and does not run on its own port.

---

## Usage

Import shared code directly from the `src/` folder within any remote. In a local Vite project the path alias `@shared` should be configured to point here.

```javascript
// In any remote (e.g. Dashboard)
import { Button } from '@shared/components/Button';
import { useAuth } from '@shared/hooks/useAuth';
import { formatDate } from '@shared/utils/date';
```

---

## What's Inside

### Components (`src/components/`)

| Component    | Props                                       | Description                                |
| ------------ | ------------------------------------------- | ------------------------------------------ |
| `Button`     | `variant`, `size`, `disabled`, `onClick`    | Primary, secondary, danger, ghost variants |
| `Input`      | `label`, `error`, `helperText`, `...rest`   | Labelled input with error/helper text      |
| `Card`       | `title`, `footer`, `children`               | Container with optional header/footer      |
| `Modal`      | `isOpen`, `onClose`, `title`, `children`    | Accessible modal with backdrop             |
| `Table`      | `columns`, `data`, `onSort`                 | Sortable data table                        |
| `Pagination` | `currentPage`, `totalPages`, `onPageChange` | Page navigation                            |
| `Alert`      | `type`, `message`, `onDismiss`              | success / error / warning / info           |
| `Badge`      | `variant`, `children`                       | Status indicator pill                      |

### Hooks (`src/hooks/`)

| Hook                            | Returns                                           | Description                       |
| ------------------------------- | ------------------------------------------------- | --------------------------------- |
| `useAuth()`                     | `{ user, isAuthenticated, token, login, logout }` | Auth state from Redux             |
| `useDebounce(value, delay)`     | debounced value                                   | Debounce inputs for search        |
| `useLocalStorage(key, initial)` | `[value, setValue]`                               | Persisted state                   |
| `useClickOutside(ref, handler)` | —                                                 | Closes dropdowns on outside click |
| `usePagination(total, perPage)` | `{ currentPage, totalPages, goToPage, ... }`      | Pagination state                  |

### Utils (`src/utils/`)

| Module          | Functions                                            |
| --------------- | ---------------------------------------------------- |
| `date.js`       | `formatDate`, `formatRelativeTime`, `formatDateTime` |
| `number.js`     | `formatCurrency`, `formatPercent`, `formatCompact`   |
| `string.js`     | `truncate`, `capitalize`, `slugify`, `initials`      |
| `validation.js` | `isEmail`, `isStrongPassword`, `isUUID`              |
| `classnames.js` | `cn(...classes)` — conditional class merging         |

---

## Installing

No separate `npm install` step is needed for the shared library. Remotes reference it via path alias. Make sure the alias is set in each remote's `vite.config.js`:

```javascript
// vite.config.js in a remote
import path from 'path';

export default {
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../shared/src'),
    },
  },
};
```

---

## Adding a New Shared Component

1. Create the folder under `src/components/ComponentName/`
2. Add `ComponentName.jsx` (the component), `index.js` (re-export), and `ComponentName.test.js`
3. Export from `src/index.js`
4. Update this README with the component in the table above

---

## Running Tests

```bash
cd Frontend/shared
npm install
npm test            # Vitest unit tests
npm run test:watch  # Watch mode
```
