# Topics Module Guide

This module owns topic discovery, scoring, and topic lifecycle state.

## Structure

- `topics.service.ts` manages CRUD-style topic state and recovery behavior.
- `topic-mining.service.ts` and `ai-scorer.service.ts` hold heavier discovery and scoring logic.
- `dto/` files define external request shapes for topic endpoints.

## Edit Rules

- Keep state transitions explicit. Changes to `pending`, `generating`, `completed`, or publish state can affect both UI and automation flows.
- Prefer updating mining or scoring services directly instead of folding AI logic into controllers.
- When changing topic payloads, check both backend DTO/service usage and the frontend topic API mapper.

## Verification

- Run backend lint after edits here.
- Run the topic-related backend tests when changing scoring, mining, or stale-state recovery behavior.
