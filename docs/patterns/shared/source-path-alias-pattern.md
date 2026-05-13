# Source Path Alias Pattern

## Purpose

This guide documents the local TypeScript path aliases used by the Vite app and tests.

## Recommended Rule

- Use the configured source aliases when importing across major source boundaries.
- Use short relative imports for nearby files in the same folder or tightly coupled slice.
- Keep `tsconfig.json` and `vite.config.ts` aliases aligned.
- Add a new alias only when it represents a stable top-level source boundary.

## Why This Rule Exists

- Cross-module imports are easier to scan when they name the boundary they cross.
- Matching TypeScript and Vite aliases prevents code that type-checks but fails in the browser.
- Stable aliases make module ownership clear without long relative paths.

## Recommended Structure Or Usage Pattern

Current aliases:

```text
@tests/*          -> src/tests/*
@pacman/*         -> src/app/pacman/*
@shared/*         -> src/packages/shared/*
@game-client/*    -> src/packages/game-client/*
@game-engine/*    -> src/packages/game-engine/*
```

Use aliases for imports such as:

```ts
import { Scene } from '@game-engine/core/scene';
import { Queue } from '@shared/data-structures/queue';
import { PACMAN_EVENT_TYPE } from '@pacman/constants/pacman-event.constant';
```

## Checklist

1. Update both `tsconfig.json` and `vite.config.ts` when changing aliases.
2. Keep the alias name aligned with the source boundary.
3. Prefer existing aliases over adding a near-duplicate.
4. Run the smallest relevant build or test command after alias changes.

## Anti-Patterns

- Do not add aliases for individual files.
- Do not use an alias in TypeScript that Vite cannot resolve.
- Do not import feature code from generic packages through aliases or relative paths.
