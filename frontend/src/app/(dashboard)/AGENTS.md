# Dashboard Route Guide

This route group contains the main product UI. Keep changes consistent across dashboard pages.

## Structure

- Each page under this directory is a route entry. Keep route-specific UI with the route unless it is clearly reused.
- Shared dashboard-only pieces belong in `components/` beside this route group.
- Page-level sample mappers such as `data.ts` are part of the route contract; update them when API fields change.

## Edit Rules

- Reuse `src/lib/api/*` clients instead of adding ad hoc fetch helpers in page files.
- Preserve the current HeroUI + Iconify + Recharts style unless the task explicitly changes design direction.
- Keep loading, toast, and error handling behavior consistent with nearby pages.

## Verification

- After dashboard edits, run the frontend lint check.
- For route behavior changes, review imports and affected API helper usage together.
