---
applyTo: 'Frontend/**'
---

# Frontend Instructions

## Module Federation Architecture

- `shell/` is the HOST application - it loads remote micro-frontends
- `Dashboard/`, `Item-management/`, `LandingPage/` are REMOTE applications
- `shared/` contains code shared across all micro-frontends

## React Standards

- Use functional components with hooks exclusively
- Use Redux Toolkit for global state
- Use RTK Query for server state (API calls)
- Use React Router v6 for routing
- Lazy load remote components with React.lazy()

## Tailwind CSS

- Use utility classes directly in JSX
- Create component variants in `styles.js` when complex
- Follow mobile-first responsive design
- Use the shared design tokens from `shared/styles/`

## Redux Pattern

```javascript
// Slice structure
import { createSlice } from '@reduxjs/toolkit';

const featureSlice = createSlice({
  name: 'feature',
  initialState: {},
  reducers: {
    actionName: (state, action) => { ... }
  }
});

export const { actionName } = featureSlice.actions;
export default featureSlice.reducer;
```

## RTK Query Pattern

```javascript
// API slice
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const featureApi = createApi({
  reducerPath: 'featureApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getItems: builder.query({
      query: () => '/items',
    }),
  }),
});

export const { useGetItemsQuery } = featureApi;
```

## Component Structure

- Keep components small and focused (< 200 lines)
- Extract hooks for complex logic
- Use prop-types or JSDoc for prop documentation
- Co-locate tests with components

## Import Order

1. React and core libraries
2. Third-party libraries
3. Shared components/hooks
4. Local components
5. Styles/constants
