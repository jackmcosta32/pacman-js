# Milestone 7: Scene Flow And Menus

## Goal

Make the game feel complete around the match runtime.

This milestone should connect the main menu, match scene, pause/restart flow, win state, and game-over flow.

## Why This Matters

A playable game needs clean transitions. Scene loading also exercises engine lifecycle cleanup, client restart behavior, and persistent game state decisions.

## Task Breakdown

### M7.1 Add Scene Registry

- Replace static scene selection with a registry keyed by scene id.
- Decide whether registry values are scene instances or scene factory functions.
- Prefer factories if scenes need fresh state on restart.

Affected areas:

- `src/app/pacman/pacman-game.ts`
- `src/app/pacman/scenes`
- `src/app/pacman/constants/pacman-scene.constant.ts`

Verification:

- Tests for loading known and unknown scene ids.

### M7.2 Implement `loadScene(id)`

- Destroy the current scene before switching.
- Initialize the new scene.
- Notify subscribers with the new serialized scene.
- Handle invalid scene ids with useful errors.

Affected areas:

- `src/app/pacman/pacman-game.ts`

Verification:

- Tests for scene transition cleanup and initialization.

### M7.3 Wire Main Menu Startup

- Start the game on `PacmanMainMenuScene` or explicitly load the match scene based on product choice.
- Fix menu scene construction to use the current engine contracts.
- Keep menu rendering consistent with scene serialization.

Affected areas:

- `src/app/pacman/scenes/pacman-main-menu.scene.ts`
- `src/app/pacman/pacman-game.ts`

Verification:

- Browser check starts on the intended scene.

### M7.4 Add Menu Input

- Add menu navigation events.
- Support start game and exit or reset actions.
- Keep menu input mapping in the Pac-Man client or menu-specific systems.

Affected areas:

- `src/app/pacman/pacman-game-client.ts`
- `src/app/pacman/constants/pacman-event.constant.ts`
- `src/app/pacman/systems`

Verification:

- Manual keyboard check.
- Unit tests for menu event handling if practical.

### M7.5 Add Pause Overlay Or Scene

- Decide whether pause is a separate scene, overlay state, or UI entities in the match scene.
- Keep simulation paused while rendering remains active.
- Support resume and restart.

Affected areas:

- `src/app/pacman/scenes`
- `src/app/pacman/systems`
- `src/app/pacman/pacman-game.ts`

Verification:

- Tests for paused update behavior.
- Manual pause/resume check.

### M7.6 Add Win And Game-Over Flow

- Define how win and game-over states are represented.
- Show score and restart options.
- Ensure restart creates fresh match state.

Affected areas:

- `src/app/pacman/scenes`
- `src/app/pacman/pacman-game.ts`

Verification:

- Tests for transition triggers.
- Manual gameplay checks.

### M7.7 Prevent Transition Leaks

- Ensure input listeners, animation loops, entity managers, and system state are cleaned up.
- Ensure old scene entities do not remain in serialized snapshots after transition.

Affected areas:

- `src/app/pacman/pacman-game.ts`
- `src/app/pacman/pacman-game-client.ts`
- `src/packages/game-engine/core/scene.ts`

Verification:

- Tests for scene cleanup.
- Manual restart check.

## Dependencies

- Milestone 1 must provide stable lifecycle behavior.
- Milestone 2 should provide clean client start/stop.
- M7.1 and M7.2 should happen before menu and game-over flows.

## Exit Criteria

- The game starts from a defined entry scene.
- The player can start, pause, resume, restart, win, and reach game over.
- Scene transitions do not leak runtime state.
