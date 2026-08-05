# Task: Fix the code (TypeScript build errors)

## Steps

- [x] Fix `frontend/tsconfig.json`:
  - Added `moduleResolution: "bundler"` (resolves TS5070 with resolveJsonModule)
  - Removed invalid `ignoreDeprecations: "6.0"` (resolves TS5103)
  - Removed removed `baseUrl` option and updated `paths` to use relative `./src/*`
- [x] Fix `backend/tsconfig.json`:
  - Removed invalid `ignoreDeprecations: "6.0"` (resolves TS5103)
- [x] Create `frontend/src/vite-env.d.ts` referencing `vite/client` (resolves CSS side-effect import type errors)
- [x] Remove unused imports/variables:
  - `main.tsx`: changed `'./App.tsx'` → `'./App'`
  - `Dashboard.tsx`: removed unused `isAuthenticated`
  - `Editor.tsx`: removed unused `React`, `exportToPDF`, `navigate`
  - `Home.tsx`: removed unused `React`
- [x] Install `@types/cors` in backend (resolves TS7016 for `cors` module)
- [x] Verify: `npx tsc --noEmit` passes on both frontend and backend with zero errors
