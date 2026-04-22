# Dual-Mode Docker Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a dedicated Docker development workflow with bind-mounted source code while preserving the existing deployment-oriented image build flow and documenting both clearly in the README.

**Architecture:** Keep `docker-compose.yml` as the shared infra base and keep `docker-compose.override.yml` as the deployment-oriented app definition. Add `docker-compose.dev.yml` for hot-reload development services and update `README.md` so development and deployment startup commands are explicit.

**Tech Stack:** Docker Compose, NestJS, Next.js, PostgreSQL, Redis

---

### Task 1: Add Docker Dev Compose Flow

**Files:**
- Create: `docker-compose.dev.yml`

- [ ] **Step 1: Add development service definitions**

Create `docker-compose.dev.yml` with:
- `backend` build context `./backend`
- `frontend` build context `./frontend`
- bind mounts from local source directories to `/app`
- named volumes for `/app/node_modules`
- dev commands for backend and frontend
- service dependencies on `postgres`, `redis`, and `backend`
- published ports `3003` and `3004`

- [ ] **Step 2: Validate compose rendering**

Run: `docker compose -f docker-compose.yml -f docker-compose.dev.yml config`
Expected: exit code `0` and rendered `backend` / `frontend` services with bind mounts

### Task 2: Rewrite README Startup Instructions

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Document source code locations**

Add explicit paths for:
- `backend/src`
- `frontend/src`

- [ ] **Step 2: Add development startup section**

Document Docker development startup with:
`docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build`

Include:
- hot reload behavior
- service URLs and ports
- how to rebuild a single service after dependency changes

- [ ] **Step 3: Add deployment startup section**

Document deployment-oriented startup with:
`docker compose up -d --build`

Include:
- no bind mounts
- code changes require rebuild

- [ ] **Step 4: Keep optional local-node flow**

Retain an optional mode where Docker runs only `postgres` and `redis`, while backend and frontend run locally.

### Task 3: Verify Documentation and Compose Commands

**Files:**
- Test: `docker-compose.yml`
- Test: `docker-compose.dev.yml`
- Test: `docker-compose.override.yml`
- Test: `README.md`

- [ ] **Step 1: Render deploy compose**

Run: `docker compose config`
Expected: exit code `0`

- [ ] **Step 2: Render dev compose**

Run: `docker compose -f docker-compose.yml -f docker-compose.dev.yml config`
Expected: exit code `0`

- [ ] **Step 3: Inspect final diff**

Run: `git diff -- README.md docker-compose.dev.yml`
Expected: diff shows new dev workflow and updated startup instructions
