# Frontend Agent Guide

This subtree is the Next.js dashboard app. Follow `/Users/y/ai-content/AGENTS.md` first, then apply these frontend-local rules.

## Read First

1. `frontend/package.json`
2. `frontend/src/app`
3. `frontend/src/lib/api`
4. The nearest nested `AGENTS.md` if you are inside a specific route group

## Structure

- `src/app` owns routes, layouts, and route-local UI.
- `src/app/(dashboard)` is the main authenticated dashboard surface.
- `src/lib/api` holds API clients and request helpers. Reuse them before adding fetch logic in pages.
- `src/components` is for shared UI that is not tied to a single route group.

## Edit Rules

- Prefer route-local changes before promoting code into shared components.
- Keep API shapes aligned with backend responses. If you change a contract, update the matching file in `src/lib/api`.
- Follow existing client-component patterns in route pages instead of introducing a new state/data pattern for one screen.

## Verification

- Run `npm run lint` in `frontend` for meaningful frontend edits.
- Run `npm run build` in `frontend` when a change affects routing, config, types, or API contract wiring.
- If a change is route-specific, sanity-check the affected route code paths before finishing.
