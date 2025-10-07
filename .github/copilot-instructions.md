<!--
This file guides AI coding agents working on the FE-CasaBlancaR repository.
Keep it concise and focused on discoverable, actionable project patterns.
-->

# AI Guide for FE-CasaBlancaR (copilot-instructions)

Quick, actionable facts an AI should know to be productive in this codebase.

- Tech stack: React 19 + TypeScript, Vite, Tailwind CSS, Zustand (local state), TanStack Query (server state), React Router v7, Socket.io client. Tests use Vitest + React Testing Library. (See `README.md`, `CLAUDE.md`)

- Project layout to reference when adding or modifying code:
    - `src/features/*` — feature modules (e.g. `auth/`)
    - `src/global/*` — shared components, hooks, utils (e.g. `global/components/ErrorBoundary.tsx`, `global/hooks/useAsync.ts`)
    - `src/stores/*` — Zustand stores (e.g. `stores/useAuthStore`)
    - `src/routes/*` — routing and route types
    - `src/services/*` — external integrations (api/socket/storage)

- State patterns & conventions
    - Use Zustand for local/global state and keep stores under `src/stores/*`. Example: `src/stores/useAuthStore/useAuthStore.ts` (tests live next to stores).
    - Use TanStack Query (React Query) for server data — prefer queries/mutations for server interactions.

- Routing and protected routes
    - Use `src/routes/routes.ts` and `src/global/ProtectedRoute/ProtectedRoute.tsx` for role-based protection. When adding a new page, register the route in `src/routes/index.tsx` and update `routes.ts` types if needed.

- Tests and TDD workflow
    - Repo favors TDD (see `CLAUDE.md`). Tests use Vitest + React Testing Library. Keep tests colocated (feature or component folder) and follow existing test naming conventions: `*.test.tsx` or `*.test.ts`.
    - Run tests with `pnpm test`. UI runner is `pnpm test:ui`. Coverage: `pnpm test:coverage`.

- Build & dev commands (from README)
    - Install: `pnpm install` (Node >= 20.19, pnpm >= 9)
    - Dev server: `pnpm dev`
    - Build: `pnpm build`
    - Preview: `pnpm preview`

- Linting / formatting / types
    - Lint: `pnpm lint` | Fix: `pnpm lint:fix` | Format: `pnpm format` | Type check: `pnpm type-check`
    - ESLint + Prettier are enforced; prefer edits that are lint-clean.

- Real-time & integration points
    - Socket.io client is used for collaborative features. Check `src/services/socket` (or `src/services` if present) and follow existing socket event naming. Keep socket usage isolated to `services/socket` and reconnect logic in stores/hooks.

- Commit messages & git strategy
    - Follow the repository's conventional prefixes (from `CLAUDE.md`):
        - feat, test, fix, etc. Example: `test: add auth store tests (RED)` then `feat: implement auth store (GREEN)`.

- Patterns to preserve when making changes
    - Small, focused PRs following TDD phases: add failing test, implement, then commit green.
    - Put tests next to the code they exercise (e.g., `src/features/auth/components/LoginForm/LoginForm.test.tsx`).
    - Shared UI components go into `src/global/components` and hooks into `src/global/hooks`.

- Files to inspect when reasoning about behavior
    - `src/global/ErrorBoundary.tsx` and `global/components/DefaultErrorFallback.tsx` — error handling patterns
    - `src/global/hooks/useErrorHandler.ts` and `useAsync.ts` — async/error utilities
    - `src/stores/useAuthStore` — auth store shape and usage examples
    - `src/routes/routes.ts` and `src/routes/index.tsx` — routing and protection

- When editing tests or runtime behaviour, run quick checks locally:
    - Unit tests: `pnpm test <test-file-or-pattern>`
    - Lint + types: `pnpm lint && pnpm type-check`

- What NOT to change without a follow-up PR or author confirmation
    - Global linting, formatting, or build configs (`eslint.config.js`, `tsconfig.json`, `vite.config.ts`) unless the change is narrowly scoped and tests/CI updated.

If anything above is unclear or you need examples for a specific area (stores, routes, sockets, or tests), tell me which area and I will expand with concrete file excerpts and recommended edits.
