# Milestone 8: Polish, Tooling, And Maintainability

## Goal

Make the project easier to evolve after the game is playable.

This milestone should improve debugging, documentation, verification, and long-term maintainability.

## Why This Matters

Once gameplay works, the next bottleneck becomes understanding runtime behavior. Debug tools and focused docs prevent future changes from turning into archaeology.

## Task Breakdown

### M8.1 Add Debug Overlay

- Show FPS.
- Show entity count.
- Show current scene id.
- Show optional player tile coordinate.
- Keep the overlay togglable.

Affected areas:

- `src/packages/game-client`
- `src/app/pacman`

Verification:

- Manual browser check.

### M8.2 Add Collision And Tile Debug Rendering

- Render collision boxes in debug mode.
- Render tile grid coordinates or tile boundaries.
- Keep debug rendering separate from normal gameplay rendering.

Affected areas:

- `src/packages/game-client/drivers/graphics.driver.ts`
- `src/app/pacman/pacman-game-client.ts`

Verification:

- Manual browser check.

### M8.3 Decide `GameClientDebugger` Role

- Expand `GameClientDebugger` into useful runtime tooling, or remove it.
- If kept, define log levels and what gets logged.
- Avoid unused debug code that fails `noUnusedLocals`.

Affected areas:

- `src/packages/game-client/game-client-debugger.ts`
- `src/packages/game-client/interfaces/game-client-debugger.interface.ts`

Verification:

- Build remains clean.

### M8.4 Document Map Authoring

- Add docs for the final level data format.
- Include tile symbols and validation rules.
- Include a small example map.

Affected areas:

- `docs/modules`
- `docs/patterns`
- `src/app/pacman` level files.

Verification:

- Docs match the implemented parser.

### M8.5 Document Adding Components And Systems

- Add a pattern doc for adding a new component.
- Add a pattern doc for adding a new system.
- Include serialization and testing expectations.

Affected areas:

- `docs/patterns/game`

Verification:

- Docs link from `docs/README.md`.

### M8.6 Add Visual Smoke Testing

- Add a small browser smoke test once the app builds.
- Verify canvas is nonblank after startup.
- Verify movement changes the player position.
- Verify scene transitions render expected UI.

Affected areas:

- Test tooling, if introduced.
- `docs` manual checklist, if automated testing is deferred.

Verification:

- Smoke check runs locally or manual checklist is documented.

### M8.7 Clean Naming And Dead Code

- Fix typos such as `muti-subject-observer`.
- Remove unused constants, components, systems, and helpers.
- Keep renames scoped and covered by imports/tests.

Affected areas:

- `src/packages/shared/patterns`
- Any stale engine or Pac-Man files.

Verification:

- `pnpm build`
- `pnpm exec vitest run`

### M8.8 Review Documentation Accuracy

- Update module docs after major architecture changes.
- Update pattern docs after adding map, movement, collision, and scene-flow patterns.
- Keep README commands and controls current.

Affected areas:

- `README.md`
- `docs/README.md`
- `docs/modules`
- `docs/patterns`
- `docs/roadmap`

Verification:

- Stale-text scan for old implementation notes.
- Manual doc readback.

## Dependencies

- Milestones 0 through 7 should be substantially complete.
- Debug tooling can start earlier if it helps development, but final docs should match the completed runtime.

## Exit Criteria

- Developers can inspect runtime state while the game runs.
- Docs explain how to add maps, components, and systems.
- Dead code and naming drift are cleaned up.
- Build and tests remain clean after polish work.
