# Component Authoring Pattern

## Purpose

This guide documents how to add component state to the local ECS runtime. It applies to reusable components under `src/packages/game-engine/components` and Pac-Man-specific components under `src/app/pacman/components`.

## Recommended Rule

- Add component classes for state that belongs on entities.
- Keep reusable engine components free of Pac-Man rules and constants.
- Keep Pac-Man-specific components in the Pac-Man module.
- Give every component a stable static `type`.
- Serialize only the state needed by systems, clients, tests, or debugging tools.

## Why This Rule Exists

- Components are the runtime state boundary for systems and serialization.
- Stable component types let entities serialize predictable snapshots.
- Keeping feature state out of the generic engine preserves the engine boundary.

## Recommended Structure Or Usage Pattern

```text
src/packages/game-engine/components/
  position.component.ts
  sprite.component.ts
  ui.component.ts

src/app/pacman/components/
  pacman-actor.component.ts
  pacman-role.component.ts
  pacman-game-state.component.ts
```

Use engine components when the state is reusable across games. Use Pac-Man components when the state mentions Pac-Man roles, ghosts, score, tiles, collectibles, HUD markers, or match status.

## Example

`PacmanRoleComponent` stores whether an entity is the player or a ghost. The role is Pac-Man-specific, so the component belongs in `src/app/pacman/components` and serializes a small `{ role }` payload for systems, rendering, tests, and debug tools.

## Checklist

1. Define constructor params and serialized output interfaces next to the component.
2. Add a stable component type constant in the owning layer.
3. Clone mutable objects in `serialize()` instead of returning live references.
4. Add or update tests for construction and serialization.
5. Update factories that compose entities with the new component.

## Anti-Patterns

- Do not add Pac-Man component types to the generic engine.
- Do not store behavior or Canvas drawing in components.
- Do not serialize browser objects, class instances, or live mutable references.
- Do not duplicate state that an existing component already owns.
