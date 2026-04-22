# Backend Agent Guide

This subtree is the NestJS + Prisma backend. Follow `/Users/y/ai-content/AGENTS.md` first, then apply these backend-local rules.

## Read First

1. `backend/package.json`
2. `backend/src/modules`
3. `backend/src/prisma`
4. The nearest nested `AGENTS.md` if you are inside a specific module

## Structure

- Business logic lives under `src/modules/<domain>`.
- Keep controllers thin and push non-trivial behavior into services.
- DTOs stay with their module.
- Prisma access should flow through the existing Prisma service and current module patterns.

## Edit Rules

- Prefer changing one domain module at a time unless the API contract truly crosses modules.
- Be careful with schema- or env-dependent code. Do not rewrite database or Redis configuration unless required.
- If you change response shapes, check the matching frontend API helper.
- Reuse existing Nest patterns before introducing a new provider, queue, or helper layer.

## Verification

- Run `npm run lint` in `backend` for meaningful backend edits.
- Run `npm run build` in `backend` when a change affects module wiring, DTOs, providers, or TypeScript-only integration points.
- Run `npm test` in `backend` when service behavior, DTO validation, or module logic changes.
- If Prisma-facing code changes, make sure the code still matches the current schema and generated client usage.
