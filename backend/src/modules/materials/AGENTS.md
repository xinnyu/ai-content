# Materials Module Guide

This module owns content collection, crawling, and material processing.

## Structure

- `materials.service.ts` is the orchestration layer for material workflows.
- `crawlers/` contains source-specific crawler implementations plus the registry.
- `processors/` is for background processing steps.
- `dto/` should stay as the request boundary for this module.

## Edit Rules

- Prefer adding or adjusting a crawler in `crawlers/` instead of bloating the main service with source-specific logic.
- Keep crawler-specific parsing isolated from shared orchestration.
- Be conservative with changes that affect collection fan-out, deduplication, or image filtering; they can change multiple sources at once.

## Verification

- Run backend lint after edits here.
- If behavior changes in a crawler or processing path, run the most relevant backend tests you can, then report any uncovered risk clearly.
