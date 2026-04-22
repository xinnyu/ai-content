# AI Content Agent Guide

This file is the repo-level instruction set for coding agents. Keep it short, and let deeper `AGENTS.md` files add local rules when a task is scoped to a subtree.

## Scope

- This repo is a split frontend/backend app: `frontend` is Next.js 16 + React 19, `backend` is NestJS + Prisma.
- Default development path is the Docker dev workflow documented in `README.md`.
- Prefer the nearest nested `AGENTS.md` over this file when both apply.

## Read First

1. Read `README.md` for runtime modes and ports.
2. Read the nearest `package.json` before suggesting commands.
3. Read the closest nested `AGENTS.md` before editing code in that subtree.

## Edit Boundaries

- Frontend-only work should stay in `frontend/` unless an API contract must change.
- Backend-only work should stay in `backend/` unless frontend wiring must change.
- Prefer extending existing modules, routes, and API helpers over creating parallel structures.
- Do not change `.env`, `*-local-config.yml`, tunnel config, or Docker host-specific files unless the task explicitly requires it.

## Verification

- Frontend changes: run the relevant `frontend` checks, at minimum `npm run lint` when feasible.
- Backend changes: run the relevant `backend` checks, at minimum `npm run lint`; add tests when behavior changes.
- For non-trivial TypeScript, DTO, contract, or Prisma-facing changes, lint is not enough. Run the narrowest build, type, or test command that actually proves the change.
- Docker or compose changes: validate with `docker compose config` before claiming success.
- Match the verification scope to the risk of the change. Do not claim completion without fresh evidence.

## Working Style

- Treat `README.md` as guidance, then verify commands against the current codebase.
- Preserve user changes in the worktree. Do not clean up unrelated diffs.
- Keep new instructions local. If a rule only matters for one subtree, put it in a nested `AGENTS.md`, not here.
