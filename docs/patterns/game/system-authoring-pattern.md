# System Authoring Pattern

## Purpose

This guide documents how to add frame-by-frame behavior to the local ECS runtime. It applies to reusable systems under `src/packages/game-engine` and Pac-Man-specific systems under `src/app/pacman/systems`.

## Recommended Rule

- Put behavior that scans or mutates entities in systems.
- Read entities through `sceneState.entityManager`.
- Read queued input or runtime events from `sceneState.eventMap`.
- Keep system order explicit in scene factories.
- Keep browser APIs, rendering, and audio playback out of systems.

## Why This Rule Exists

- Systems make gameplay behavior testable without Canvas or DOM APIs.
- Explicit scene order makes same-frame rules predictable.
- The serialized scene boundary stays clean when systems mutate components and clients render snapshots.

## Recommended Structure Or Usage Pattern

```text
src/app/pacman/systems/
  pacman-round-state.system.ts
  pacman-movement.system.ts
  pacman-collection.system.ts
  pacman-hud.system.ts
```

Add Pac-Man systems when behavior depends on Pac-Man events, tiles, roles, ghosts, scoring, HUD, or match state. Add reusable engine systems only when the behavior has no Pac-Man vocabulary.

## Example

`PacmanMovementSystem` reads movement request events, finds controllable actor entities, validates movement against parsed level tile queries, and updates `PositionComponent` plus `PacmanActorComponent`.

## Checklist

1. Define constructor dependencies explicitly, such as parsed level data.
2. Read entities through `sceneState.entityManager`.
3. Mutate component state, not serialized snapshots.
4. Add the system to the scene factory in the intended order.
5. Add focused tests for event handling, component mutation, and important edge cases.
6. Update module or pattern docs when the system introduces a new reusable rule.

## Anti-Patterns

- Do not call Canvas, DOM, asset, or audio APIs from systems.
- Do not make systems depend on feature globals when constructor injection is available.
- Do not hide required ordering assumptions outside the scene factory.
- Do not emit events without a clear consumer and tested payload.
