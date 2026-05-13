# Milestone 0: Restore A Clean Baseline

## Goal

Make the project compile and make the test suite describe the current architecture accurately.

This milestone should not add gameplay features. It exists to remove architecture drift so later work starts from a dependable baseline.

## Why This Matters

The current app has useful engine pieces, but several interfaces, tests, and scene construction sites no longer agree with each other. Finishing game features before this baseline is clean would make every later change harder to verify.

## Task Breakdown

### M0.1 Fix TypeScript Runtime Target

- Update `tsconfig.json` to use a supported `target` and `lib`.
- Prefer `ES2023` or `ESNext` based on whether the project wants stable TypeScript support or the newest language APIs.
- Verify that Vite and Vitest still resolve path aliases after the change.

Affected areas:

- `tsconfig.json`

Verification:

- `pnpm build`

### M0.2 Align Game Lifecycle Contract

- Decide whether `IGame` should expose `init()` or whether `start()` is the initialization entry point.
- Update `IGame` and `PacmanGame` so the interface and implementation match.
- Keep the public lifecycle small and explicit.

Affected areas:

- `src/packages/shared/interfaces/game.interface.ts`
- `src/app/pacman/pacman-game.ts`
- `src/main.ts`

Verification:

- TypeScript build catches the contract alignment.

### M0.3 Align Scene Lifecycle Contract

- Add `init()` to `IScene` if scene initialization is part of the engine lifecycle.
- Ensure `Scene.init()`, `Scene.update()`, and `Scene.destroy()` all satisfy the interface.
- Make lifecycle state passed to systems consistent.

Affected areas:

- `src/packages/game-engine/interfaces/scene.interface.ts`
- `src/packages/game-engine/core/scene.ts`

Verification:

- Add or update scene lifecycle tests.
- `pnpm exec vitest run src/tests/game-engine/scene.spec.ts`

### M0.4 Fix Scene Construction Sites

- Update scene files to use the current `Scene` constructor shape.
- Pass an `EntityManager` instead of raw `entities`.
- Pass an `eventQueue` where required, or move event queue ownership if the constructor contract changes.
- Remove unused scene imports and experimental variables until they are wired.

Affected areas:

- `src/app/pacman/scenes/pacman-game.scene.ts`
- `src/app/pacman/scenes/pacman-main-menu.scene.ts`
- `src/app/pacman/pacman-game.ts`

Verification:

- `pnpm build`

### M0.5 Reconcile Scene Tests

- Update `scene.spec.ts` to test the current `Scene` API.
- If `Scene.addEntity()` is desired, add it intentionally and delegate to `EntityManager`.
- If entity mutation belongs only to `EntityManager`, update tests to assert serialization and lifecycle behavior instead.

Affected areas:

- `src/tests/game-engine/scene.spec.ts`
- `src/packages/game-engine/core/scene.ts`

Verification:

- `pnpm exec vitest run src/tests/game-engine/scene.spec.ts`

### M0.6 Repair Ring Buffer Tests

- Update tests to use `maxLength` instead of the old `size` constructor field.
- Align expectations with the current fixed-capacity internal array.
- Prefer public behavior assertions over private `elements` assertions where possible.

Affected areas:

- `src/tests/shared/ring-buffer.spec.ts`
- `src/packages/shared/data-structures/ring-buffer.ts`

Verification:

- `pnpm exec vitest run src/tests/shared/ring-buffer.spec.ts`

### M0.7 Fill Entity Manager Test Coverage

- Add tests for `EntityManager` add, duplicate add, get, has, remove, iterate, clear, and serialize behavior.
- Keep the tests focused on the manager, not on scene behavior.

Affected areas:

- `src/tests/game-engine/entity-manager.spec.ts`
- `src/packages/game-engine/managers/entity.manager.ts`

Verification:

- `pnpm exec vitest run src/tests/game-engine/entity-manager.spec.ts`

### M0.8 Resolve Collision Mock Drift

- Either implement a real `CollisionComponent`, or remove the stale mock until collision work begins.
- If implemented now, keep it generic and engine-owned.
- If deferred, document collision work in Milestone 4 and keep tests build-clean.

Affected areas:

- `src/tests/mocks/collision-component.mocker.ts`
- `src/packages/game-engine/components`

Verification:

- `pnpm build`

### M0.9 Resolve Render Component Drift

- Decide whether `RenderComponent` is needed in addition to `SpriteComponent` and `UIComponent`.
- If kept, fix imports and define its serialized payload.
- If not needed, remove it and remove its shared constant entry.

Affected areas:

- `src/packages/game-engine/components/render.component.ts`
- `src/packages/shared/constants/component.constant.ts`
- `src/packages/shared/interfaces/graphics.interface.ts`

Verification:

- `pnpm build`

### M0.10 Replace Unsupported Promise API

- Replace `Promise.withResolvers` in `AssetsDriver` with a local `new Promise` wrapper.
- Keep image and audio load behavior equivalent.
- Add error handling if possible without broadening scope too much.

Affected areas:

- `src/packages/game-client/drivers/assets.driver.ts`

Verification:

- `pnpm build`

## Dependencies

- M0.1 should happen before other TypeScript cleanup.
- M0.2, M0.3, and M0.4 should happen before test repair.
- M0.8 and M0.9 can happen independently once the build errors are visible.

## Exit Criteria

- `pnpm build` passes.
- `pnpm exec vitest run` passes.
- Tests no longer describe stale API shapes.
- No gameplay rules are added in this milestone.
