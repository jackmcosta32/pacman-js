# Milestone 1: Stabilize Engine Runtime Contracts

## Goal

Make the reusable engine reliable enough to support real gameplay systems.

This milestone should clarify how games, scenes, systems, entities, and components interact every frame.

## Why This Matters

Pac-Man gameplay will require movement, collision, scoring, collectibles, ghost AI, and scene transitions. Those systems need stable lifecycle and state contracts so they can be implemented independently and tested confidently.

## Task Breakdown

### M1.1 Finalize Lifecycle Vocabulary

- Define the meaning of `init`, `start`, `update`, and `destroy`.
- Decide which lifecycle methods belong to `Game`, `Scene`, and `System`.
- Keep naming consistent across interfaces and classes.

Affected areas:

- `src/packages/shared/interfaces/game.interface.ts`
- `src/packages/game-engine/interfaces/scene.interface.ts`
- `src/packages/game-engine/interfaces/system.interface.ts`
- `src/packages/game-engine/core/scene.ts`
- `src/packages/game-engine/core/system.ts`

Verification:

- Lifecycle unit tests compile and pass.

### M1.2 Complete Scene State Contract

- Ensure every system lifecycle call receives a complete `ISceneState`.
- Provide `elapsed`, `eventQueue`, `eventMap`, and `entityManager` consistently.
- Use an empty event map during initialization and teardown when no events exist.

Affected areas:

- `src/packages/game-engine/interfaces/scene.interface.ts`
- `src/packages/game-engine/core/scene.ts`

Verification:

- Tests cover `init`, `update`, and `destroy` system state.

### M1.3 Define Disabled System Behavior

- Decide whether disabled systems skip only `update()` or all lifecycle calls.
- Make `Scene` respect `system.enabled`.
- Add tests for enabled and disabled systems.

Affected areas:

- `src/packages/game-engine/core/system.ts`
- `src/packages/game-engine/core/scene.ts`

Verification:

- Unit tests prove disabled systems do not update.

### M1.4 Decide System Collection Ownership

- Decide whether scenes should keep `systems: ISystem[]` or own a `SystemManager`.
- If `SystemManager` is kept, integrate it consistently.
- If direct arrays are preferred, remove unused manager abstractions or leave them for future use with tests.

Affected areas:

- `src/packages/game-engine/core/scene.ts`
- `src/packages/game-engine/managers/system.manager.ts`
- `src/packages/game-engine/interfaces/system.interface.ts`

Verification:

- System add, remove, and lookup behavior is either tested or intentionally not part of scene behavior.

### M1.5 Clarify Entity Mutation Boundary

- Decide whether entity add/remove operations are public scene helpers or only manager operations.
- Keep one canonical path for adding and removing entities.
- Update docs and tests to match that path.

Affected areas:

- `src/packages/game-engine/core/scene.ts`
- `src/packages/game-engine/managers/entity.manager.ts`
- `src/packages/game-engine/interfaces/entity.interface.ts`

Verification:

- Scene and entity-manager tests agree on the public API.

### M1.6 Stabilize Component Serialization

- Ensure every component serializes enough state for the client or debugging.
- Avoid leaking live class instances into serialized scene output.
- Keep component `type` values stable and unique.

Affected areas:

- `src/packages/game-engine/components`
- `src/app/pacman/components`
- `src/packages/shared/constants/component.constant.ts`
- `src/app/pacman/constants/pacman-component.constant.ts`

Verification:

- Serialization tests cover representative generic and Pac-Man components.

### M1.7 Add Engine Runtime Tests

- Add tests for scene update order.
- Add tests for event map delivery.
- Add tests for elapsed time behavior.
- Add tests for scene serialization.
- Add tests for destroy cleanup.

Affected areas:

- `src/tests/game-engine`

Verification:

- `pnpm exec vitest run src/tests/game-engine`

## Dependencies

- Milestone 0 must be complete first.
- M1.1 and M1.2 should happen before M1.3 through M1.7.
- M1.4 and M1.5 affect API shape, so complete them before broad test expansion.

## Exit Criteria

- Engine interfaces and implementations match.
- Scene lifecycle behavior is tested.
- New systems can be added without changing client code.
- Serialized scenes are stable enough for renderer and future debugging tools.
