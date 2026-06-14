# State Management

Redux Toolkit (RTK) is the single source of truth for application state. The store lives in the Shell and is shared with all remotes through Module Federation singleton sharing.

---

## Store Structure

```
store/
├── index.js       configureStore: combines slices, exports hooks
├── authSlice.js   Authentication state and thunks
└── apiSlice.js    RTK Query base API with token refresh logic
```

---

## Auth Slice (`authSlice.js`)

### State Shape

```javascript
{
  user: {
    id: "uuid",
    email: "user@example.com",
    role: "user"
  } | null,
  token: "<jwt_string>" | null,
  isAuthenticated: false,
  loading: false,
  error: null
}
```

### Actions

| Action                            | Description                                   |
| --------------------------------- | --------------------------------------------- |
| `loginUser(credentials)`          | Async thunk: POST /api/auth/login             |
| `registerUser(userData)`          | Async thunk: POST /api/auth/register          |
| `refreshToken()`                  | Async thunk: POST /api/auth/refresh           |
| `logout()`                        | Clear auth state + call POST /api/auth/logout |
| `setCredentials({ token, user })` | Used by reauth logic to update token          |

### Usage in Components

```javascript
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, logout } from '../store/authSlice';

// Read state
const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

// Dispatch actions
const dispatch = useDispatch();
dispatch(loginUser({ email, password }));
dispatch(logout());
```

Or use the `useAuth` hook from shared library:

```javascript
import { useAuth } from '@shared/hooks/useAuth';
const { user, isAuthenticated, login, logout } = useAuth();
```

---

## API Slice (`apiSlice.js`)

Built on RTK Query with a custom `baseQueryWithReauth` that automatically handles 401 responses:

### Auto-Refresh Flow

```
1. RTK Query makes API call → 401 received
2. baseQueryWithReauth dispatches refreshToken()
3. On success → retries original request with new token
4. On failure → dispatches logout()
```

### Defining Endpoints (in each remote)

```javascript
// Inject endpoints from the base apiSlice
const itemsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getItems: builder.query({
      query: (params) => ({ url: '/items', params }),
      providesTags: ['Items'],
    }),
    createItem: builder.mutation({
      query: (body) => ({ url: '/items', method: 'POST', body }),
      invalidatesTags: ['Items'],
    }),
  }),
});

export const { useGetItemsQuery, useCreateItemMutation } = itemsApi;
```

---

## Custom Hooks

### `useAuth()`

```javascript
const { user, isAuthenticated, token, loading, error, login, logout } = useAuth();
```

### `usePagination(totalItems, itemsPerPage)`

```javascript
const { currentPage, totalPages, goToPage, nextPage, prevPage } = usePagination(100, 10);
```

### `useDebounce(value, delay)`

```javascript
const debouncedSearch = useDebounce(searchInput, 300);
// Use debouncedSearch in your RTK Query hook's arg
```

---

## Redux DevTools

Redux DevTools Extension is enabled in development. Use it to:

- Inspect state at any point in time
- Time-travel debug actions
- Export/import state snapshots
