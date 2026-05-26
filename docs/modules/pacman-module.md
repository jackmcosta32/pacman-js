# Pac-Man Module

## Purpose

The Pac-Man module contains the game-specific application code: scene definitions, actors, sprites, systems, configuration, events, and entity factories.

It depends on the reusable game engine and browser client contracts, but owns the Pac-Man rules and presentation data.

## Main Components

- `src/app/pacman/pacman-game.ts`: game runtime facade that owns the active scene and client event queue.
- `src/app/pacman/pacman-game-client.ts`: Pac-Man-specific browser client that translates keyboard events into Pac-Man events and renders serialized scenes.
- `src/app/pacman/scenes`: Pac-Man scene registry and scene factories for the match and menu.
- `src/app/pacman/levels`: Pac-Man level definitions and parsing helpers.
- `src/app/pacman/systems`: systems for menu selection, round state, tile-aware movement, collection, ghost mode/targeting/collision, HUD text, animation, and inactive experimental physics behavior.
- `src/app/pacman/components`: actor, ghost, role, match state, HUD marker, menu item, level tile, collectible, and spawn marker components.
- `src/app/pacman/factories`: helpers that compose Pac-Man entities from engine components.
- `src/app/pacman/config`: frame-rate, controls, asset, tile, and sprite configuration.
- `src/app/pacman/constants` and `src/app/pacman/interfaces`: Pac-Man-specific event, scene, actor, component, and system definitions.
- `src/packages/game-client/game-client-debugger.ts`: optional client debugger injected into the Pac-Man browser client.

## How It Works

1. `src/main.ts` creates a `PacmanGame` and a `PacmanGameClient`.
2. `PacmanGameClient.start()` initializes browser input, loads assets, subscribes to game snapshots, and starts the game.
3. `PacmanGame.start()` loads the main menu through the Pac-Man scene registry.
4. `PacmanGame.loadScene()` validates the scene id, creates a fresh scene, destroys the previous scene, clears stale events, initializes the new scene, and publishes a serialized snapshot.
5. On each animation frame, the client drains buffered input events and maps supported keys based on the current serialized scene id.
6. `PacmanGame.update()` drains queued events and handles transitions before normal scene updates. Return-to-menu wins over restart/start-match, and transitions discard mixed same-frame events.
7. The main menu uses menu item components and `PacmanMenuSystem` to keep serialized selection state and display text aligned.
8. `PacmanGameScene` parses the compact classic level, generates wall/collectible/spawn entities, and places actors at map-defined spawn tiles.
9. Active match updates run in order: round state, ghost mode, ghost targeting, movement, collection, ghost collision, HUD, then animation.
10. The serialized game-state component carries score, lives, status, timers, remaining collectibles, and transient sound hooks.
11. The client draws walls and collectibles as primitives, draws serialized UI and sprite components, and optionally draws debug overlay state from serialized entities.
12. The client plays new serialized sound hooks through the audio driver.

## Dependencies

- `src/packages/game-engine` for scenes, systems, entities, components, factories, managers, and physics helpers.
- `src/packages/game-client` for input, asset, and graphics driver contracts.
- `src/packages/shared` for events, geometry, graphics types, queues, observers, and data structures.
- Browser APIs used by the client layer: `requestAnimationFrame`, keyboard events, `Image`, `Audio`, `FontFace`, and Canvas 2D rendering.

## Notes

- Keep Pac-Man-specific rules in this module instead of moving them into the generic engine.
- Keep level data, tile symbols, static map components, and tile-map collision queries in this module.
- Keep reusable engine primitives in `src/packages/game-engine` when they are not specific to Pac-Man.
- Keep browser API usage inside the client layer or driver implementations.
- `PacmanGameClient.stop()` cancels the animation frame loop, unsubscribes from scene snapshots, destroys input listeners, and tears down the active game scene so a later `start()` can create a clean runtime.
- Tile-map queries are the authoritative static collision data for movement. Wall entities exist for rendering and metadata, not as the collision source.
- Pac-Man movement stores requested direction separately from current direction. Movement advances every tick, uses buffered input when a turn becomes legal, allows same-axis reversals immediately, and treats non-tunnel out-of-bounds movement as blocked.
- Tunnel wrapping uses parsed tunnel-pair metadata and aligns the actor center to the paired tunnel tile center before scene serialization.
- Text-grid level rows preserve spaces; do not trim level rows before parsing.
- Scene loading is owned by the Pac-Man scene registry. Registry values are factories so menu start, restart, and return-to-menu transitions always receive fresh entities, managers, and systems.
- The game starts on the main menu. Start loads a fresh classic match, restart reloads the classic match, and Escape returns to the main menu.
- The classic match starts in `playing` state. Pause toggles only between `playing` and `paused`; respawn, win, and game-over ignore pause input.
- Pause, win, and game-over are match-scene overlay states rendered by HUD entities, not separate scenes.
- Power pellets start a Pac-Man-level frightened timer. Ghost components mirror that timer into per-ghost mode unless the ghost is eaten or returning home.
- Ghost identity, release timing, scatter/chase/frightened/returning modes, and targeting rules live in Pac-Man components and systems. The generic engine does not own ghost AI.
- The compact level exposes four deterministic ghost start slots by combining ordered `G` spawn tiles with ordered `H` house tiles. Scenes consume parsed slot metadata instead of hard-coding ghost positions.
- Sound hooks are authored by Pac-Man systems as serialized state and consumed once by the client. Systems never call browser audio APIs directly.
- The physics system exists alongside the movement system but is not currently wired into the active game scene; static maze collision remains tile-query based.
- Player/ghost collision outcomes are handled by the Pac-Man ghost collision system. Wall blocking remains direct movement validation.
- Press Backquote to toggle debug rendering. The overlay is client-only and does not change engine state.
