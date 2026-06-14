# Frontend — Shell

Module Federation host application. Loads and composes all micro-frontend remotes.

**Port**: 3000

## Quick Start

Start remotes first, then the shell:

```bash
# Start remotes (separate terminals)
cd ../LandingPage && npm run dev   # :3001
cd ../Dashboard && npm run dev     # :3002
cd ../Item-management && npm run dev # :3003

# Start shell
npm install
npm run dev   # http://localhost:3000
```

## Remotes Loaded

| Remote           | URL            | Exposed                          |
| ---------------- | -------------- | -------------------------------- |
| `landingPage`    | localhost:3001 | Home, About, Login, Register     |
| `dashboard`      | localhost:3002 | Overview, Profile, Settings      |
| `itemManagement` | localhost:3003 | ItemList, ItemDetail, ItemCreate |

## Redux Store

The shell owns the shared Redux store. All remotes consume it through Module Federation singleton sharing. See [State Management docs](../../docs/frontend/state-management.md).

## Scripts

```bash
npm run dev       # Development server (http://localhost:3000)
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # ESLint check
npm test          # Vitest unit tests
```

See [Shell documentation](../../docs/frontend/shell.md) for full architecture details.
