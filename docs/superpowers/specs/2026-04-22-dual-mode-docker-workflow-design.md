# Dual-Mode Docker Workflow Design

## Goal

Make the project easy to modify locally while keeping deployment predictable.

The workflow must support:

- Development with live code editing and hot reload
- Deployment with image builds and production-style container startup
- Clear README instructions so future startup is unambiguous

## Current State

- `docker-compose.yml` provides only `postgres` and `redis`
- `docker-compose.override.yml` adds `backend` and `frontend` as image-build services
- `backend` and `frontend` source code exists locally in this repository, but running containers do not bind-mount the local source tree
- Local code changes therefore require image rebuilds to take effect

## Proposed Approach

Use two explicit Docker modes:

### 1. Base/Deploy Mode

- Keep `docker-compose.yml` focused on shared infrastructure and stable service definitions
- Keep production-oriented image builds for `backend` and `frontend`
- Deployment continues to use image build semantics instead of host bind mounts

### 2. Dev Mode

- Add a dedicated development compose file
- Development `backend` and `frontend` services bind-mount local source code into the containers
- Development commands run watch mode:
  - backend: `npm run start:dev`
  - frontend: `npm run dev -- --hostname 0.0.0.0 --port 3004`
- Preserve `node_modules` inside the container with named volumes so host and container dependency layouts do not conflict

## Service Layout

### Base file

`docker-compose.yml` remains the shared foundation:

- `postgres`
- `redis`

This file should stay safe to run on its own for local dependency startup.

### Deploy file

`docker-compose.override.yml` remains the deployment-oriented app definition:

- `backend` built from `./backend`
- `frontend` built from `./frontend`
- no source bind mounts

This keeps current deployment behavior intact.

### Dev file

Add `docker-compose.dev.yml`:

- `backend`
  - build from `./backend`
  - bind mount `./backend` to `/app`
  - mount a named volume at `/app/node_modules`
  - use backend `.env`
  - depend on `postgres` and `redis`
  - expose `3003`
  - run dev/watch command
- `frontend`
  - build from `./frontend`
  - bind mount `./frontend` to `/app`
  - mount a named volume at `/app/node_modules`
  - use frontend `.env.local`
  - depend on `backend`
  - expose `3004`
  - run dev command on `0.0.0.0`

## README Changes

README must document three distinct entry points:

1. Development with Docker
2. Optional local-node development with Docker only for `postgres` and `redis`
3. Deployment build/start flow

The README must answer these questions directly:

- Where is the source code
- Which command to use for dev
- Which command to use after code changes in deploy mode
- Which ports each service uses

## Error Handling

- If dependencies are missing in dev containers, rebuild the specific service
- If file watching is unreliable on Docker Desktop/macOS, prefer polling-related env vars only where needed
- If container `node_modules` becomes stale, recreate the named volume instead of mixing host-installed modules with container-installed modules

## Testing and Verification

Verification is configuration-focused:

- Compose config renders correctly for base, dev, and deploy modes
- Development commands are present and readable in README
- No production deployment path depends on bind mounts

## Scope

In scope:

- Add dedicated dev compose flow
- Preserve deploy flow
- Update README clearly

Out of scope:

- Refactoring application code
- Changing app ports or framework architecture
- Adding reverse proxy, CI, or production orchestration changes
