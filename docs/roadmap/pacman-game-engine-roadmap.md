# Pac-Man Game Engine Roadmap

## Purpose

This roadmap captures the current unfinished implementation areas and the recommended path from the present prototype to a fully working game engine for a Pac-Man game.

The goal is to finish the foundation first, then layer playable Pac-Man rules on top without blurring the boundaries between the game engine, browser client, shared utilities, and Pac-Man feature module.

## Current Baseline

The project currently has the right high-level shape:

- `src/packages/game-engine` owns reusable entity, component, system, scene, manager, and utility primitives.
- `src/packages/game-client` owns browser-facing input, asset, and graphics drivers.
- `src/packages/shared` owns framework-agnostic contracts, constants, data structures, and helpers.
- `src/app/pacman` owns Pac-Man scenes, actors, sprites, events, systems, factories, and client orchestration.

The current implementation is not yet build-clean or test-clean.

Observed baseline checks:

- `pnpm build` fails.
- `pnpm exec vitest run` fails.

The failures point to architecture drift rather than one isolated bug:

- `PacmanGame` implements `IGame`, but `IGame` requires `init()` and the class does not provide it.
- `PacmanGame.start()` calls `scene.init()`, but `IScene` does not currently declare `init()`.
- `Scene` now requires `eventQueue` and `entityManager`, while some scene definitions and tests still pass older constructor shapes.
- `PacmanGameScene` imports and prepares physics-related state, but the active systems only include animation and movement.
- `PacmanMainMenuScene` passes `entities` directly to `Scene`, but `Scene` expects an `EntityManager`.
- `RenderComponent` imports missing or incorrect types and serializes no render payload.
- `CollisionComponentMocker` references a missing `collision.component`.
- `RingBuffer` tests use an old constructor property named `size` instead of `maxLength`.
- `scene.spec.ts` expects `Scene.addEntity()`, but entity mutation has moved to `EntityManager`.
- `entity-manager.spec.ts` exists but has no tests.
- `tsconfig.json` uses `ES2024`, while the installed TypeScript version only accepts targets through `ES2023` or `ESNext`.
- `AssetsDriver` uses `Promise.withResolvers`, which is not available under the current TypeScript/lib setup.
- Canvas rendering currently does not handle device pixel ratio.

## Guiding Architecture

Use these boundaries while completing the project:

- Game engine code stays generic and does not import Pac-Man modules or browser APIs.
- Browser APIs stay in `src/packages/game-client` or Pac-Man client orchestration.
- Pac-Man rules stay in `src/app/pacman`.
- Shared code stays framework-agnostic and should contain only contracts, constants, data structures, and utilities used across boundaries.
- Scene serialization remains the handoff from simulation to rendering.
- Client input enters the game as typed events, not direct component mutations.

## Milestone 0: Restore A Clean Baseline

Detailed tracking document: [Milestone 0: Restore A Clean Baseline](./milestone-0-clean-baseline.md)

### Goal

Make the project compile and make the test suite describe the current architecture accurately.

### Work Items

- Change `tsconfig.json` target/lib to a supported value, likely `ES2023` or `ESNext`.
- Decide whether `IGame` should require `init()` or whether `start()` is the public initialization method.
- Add `init()` to `IScene` if scene lifecycle initialization is part of the engine contract.
- Align all `Scene` construction sites with the current constructor contract:
  - pass `eventQueue`;
  - pass `entityManager`;
  - do not pass raw `entities` directly.
- Update `scene.spec.ts` to test current `Scene` behavior, or add explicit scene helper methods if `Scene.addEntity()` is intentionally part of the public API.
- Update `ring-buffer.spec.ts` to use `maxLength`.
- Add real tests to `entity-manager.spec.ts`.
- Remove the stale collision mock or implement a real collision component.
- Fix `RenderComponent` imports and decide whether it remains part of the engine.
- Replace `Promise.withResolvers` with a compatibility-safe promise wrapper, or intentionally upgrade the TypeScript/lib/runtime target.
- Remove unused imports and variables surfaced by `noUnusedLocals` and `noUnusedParameters`.

### Exit Criteria

- `pnpm build` passes.
- `pnpm exec vitest run` passes.
- Tests assert current architecture rather than older constructor and scene APIs.

## Milestone 1: Stabilize Engine Runtime Contracts

Detailed tracking document: [Milestone 1: Stabilize Engine Runtime Contracts](./milestone-1-engine-runtime-contracts.md)

### Goal

Make the reusable engine reliable enough to support real gameplay systems.

### Work Items

- Finalize lifecycle contracts for `Game`, `Scene`, and `System`:
  - `init`;
  - `start`;
  - `update`;
  - `destroy`.
- Ensure `Scene.init()`, `Scene.update()`, and `Scene.destroy()` always pass a complete `ISceneState`.
- Decide how disabled systems behave:
  - skip disabled systems in `Scene.update()`;
  - optionally skip disabled systems in lifecycle hooks.
- Decide whether `SystemManager` is needed by `Scene`, or whether scenes should keep a direct `systems` array.
- Add tests for:
  - system lifecycle calls;
  - elapsed time flow;
  - event map delivery;
  - entity serialization;
  - scene cleanup.
- Keep component serialization explicit and stable.

### Exit Criteria

- Engine contracts are consistent across interfaces, implementations, and tests.
- New systems can be added without changing client code.
- Scene snapshots can be consumed by the renderer without accessing live engine objects.

## Milestone 2: Finish Client Runtime

Detailed tracking document: [Milestone 2: Finish Client Runtime](./milestone-2-client-runtime.md)

### Goal

Make the browser client dependable for a canvas game loop.

### Work Items

- Add a destroy path for `InputDriver` so keyboard listeners can be removed.
- Store and abort the input event listener controller during cleanup.
- Decide whether `InputDriver` should expose all buffered events per frame or only one event per frame.
- Handle canvas device pixel ratio in `GraphicsDriver`.
- Keep logical scene resolution separate from CSS display size.
- Add asset loading error and timeout paths.
- Register loaded `FontFace` instances with `document.fonts` if text rendering depends on the custom font.
- Decide how audio assets are triggered and where playback belongs.
- Add a browser smoke test or small manual verification checklist once build is clean.

### Exit Criteria

- The game loop starts and stops cleanly.
- Canvas output is crisp on high-DPI displays.
- Missing assets fail with useful errors.
- Input buffering behavior is documented and tested.

## Milestone 3: Build The Pac-Man Level Model

Detailed tracking document: [Milestone 3: Build The Pac-Man Level Model](./milestone-3-pacman-level-model.md)

### Goal

Represent a real Pac-Man maze as data that can generate renderable and collidable entities.

### Work Items

- Create a tile map representation for:
  - walls;
  - empty paths;
  - pellets;
  - power pellets;
  - player spawn;
  - ghost spawns;
  - ghost house;
  - tunnels.
- Add map parsing or construction helpers under the Pac-Man module.
- Add entity factories for static map entities.
- Add components for map/tile identity where systems need to distinguish walls, pellets, and spawn areas.
- Decide whether map tiles are entities, static collision data, or a mix of both.
- Render maze tiles and pellets from data instead of hard-coded actor-only scenes.

### Exit Criteria

- A Pac-Man level can be described in data.
- The scene can generate all initial entities from that data.
- Walls and collectible items are represented consistently.

## Milestone 4: Implement Movement And Collision

Detailed tracking document: [Milestone 4: Implement Movement And Collision](./milestone-4-movement-and-collision.md)

### Goal

Make player movement feel like Pac-Man and prevent invalid movement through walls.

### Work Items

- Replace free-form pixel movement with grid-aware movement.
- Add intended direction buffering so quick turns are accepted when the next tile allows them.
- Keep current direction until blocked or redirected.
- Add wall collision using either:
  - tile map collision queries; or
  - entity bounding boxes with a maintained spatial index.
- Decide whether `PacmanPhysicsSystem` replaces or augments `PacmanMovementSystem`.
- Give `PacmanPhysicsSystem` a unique system id instead of sharing the movement id.
- Keep the spatial index updated when entities move.
- Add tests for:
  - blocked movement;
  - legal turns;
  - buffered turns;
  - tunnel wrapping;
  - collision candidate filtering.

### Exit Criteria

- Pac-Man cannot pass through walls.
- Movement remains smooth but respects the tile grid.
- The player can steer naturally at intersections.

## Milestone 5: Add Core Pac-Man Rules

Detailed tracking document: [Milestone 5: Add Core Pac-Man Rules](./milestone-5-core-pacman-rules.md)

### Goal

Turn the prototype into a playable game loop with scoring, lives, collectibles, and round state.

### Work Items

- Add score state and UI rendering.
- Add lives state and UI rendering.
- Add pellet collection.
- Add power pellet collection.
- Add frightened mode trigger for ghosts.
- Add player death and respawn flow.
- Add round reset after death.
- Add win condition when all pellets are collected.
- Add game-over state when lives reach zero.
- Add pause/restart events.
- Add sound effects where useful.

### Exit Criteria

- A player can start a round, collect pellets, score points, lose lives, win a level, and reach game over.
- Game state transitions are explicit and testable.

## Milestone 6: Add Ghost Behavior

Detailed tracking document: [Milestone 6: Add Ghost Behavior](./milestone-6-ghost-behavior.md)

### Goal

Implement ghost actors with recognizable Pac-Man behavior while keeping AI isolated from generic engine code.

### Work Items

- Add ghost actor identity and state components.
- Define ghost modes:
  - scatter;
  - chase;
  - frightened;
  - eaten;
  - returning home.
- Add per-ghost targeting rules in Pac-Man-specific systems or strategy helpers.
- Add path selection at intersections.
- Add ghost house release timing.
- Add collision behavior between player and ghosts.
- Add frightened mode timing and scoring for eaten ghosts.
- Add tests around mode transitions and target selection.

### Exit Criteria

- Ghosts move autonomously.
- Ghost behavior changes based on game state.
- Player/ghost collisions produce correct death or scoring outcomes.

## Milestone 7: Scene Flow And Menus

Detailed tracking document: [Milestone 7: Scene Flow And Menus](./milestone-7-scene-flow-and-menus.md)

### Goal

Make the game feel complete around the match runtime.

### Work Items

- Replace static scene selection with a scene registry.
- Implement `loadScene(id)` using the registry.
- Wire `PacmanMainMenuScene` into startup flow.
- Add start, restart, pause, win, and game-over scene or overlay states.
- Decide whether menus are engine scenes, UI entities in a scene, or a separate browser UI layer.
- Add keyboard navigation for menus.

### Exit Criteria

- The game starts from a menu.
- Scene transitions do not leak entities, systems, or input listeners.
- Restarting a game produces a clean match state.

## Milestone 8: Polish, Tooling, And Maintainability

Detailed tracking document: [Milestone 8: Polish, Tooling, And Maintainability](./milestone-8-polish-tooling-maintainability.md)

### Goal

Make the project easier to evolve after the game is playable.

### Work Items

- Add a debug overlay for:
  - FPS;
  - entity count;
  - current scene;
  - collision boxes;
  - tile coordinates.
- Expand `GameClientDebugger` or remove it if it no longer has a clear role.
- Add docs for map data authoring once the level format exists.
- Add docs for adding a new system.
- Add docs for adding a new component.
- Add visual smoke testing once the canvas output is stable.
- Clean up naming typos such as `muti-subject-observer`.
- Review unused constants and components.

### Exit Criteria

- Developers can add systems, components, maps, and sprites without rediscovering the architecture.
- Debug tooling helps diagnose runtime behavior.
- Docs match the implemented game engine.

## Suggested Implementation Order

1. Restore build and test baseline.
2. Finalize engine lifecycle and scene contracts.
3. Finish client driver cleanup, resolution, and asset behavior.
4. Add data-driven maze generation.
5. Implement grid-aware movement and wall collision.
6. Add pellets, score, lives, and round state.
7. Add ghosts and player/ghost interactions.
8. Add scene transitions, menu flow, and game-over flow.
9. Add debug tooling and polish.

## Near-Term First Pull Request

The first implementation PR should be deliberately small:

- Update TypeScript target/lib to a supported value.
- Align `IGame` and `IScene` lifecycle contracts.
- Fix scene constructors to use `EntityManager` and `eventQueue` consistently.
- Update or remove stale tests that target the old scene shape.
- Replace `Promise.withResolvers`.
- Make `pnpm build` pass.

Do not add Pac-Man gameplay rules in the same PR. A clean baseline will make every later gameplay change easier to review and verify.
