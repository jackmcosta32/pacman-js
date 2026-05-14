# Pac-Man Module

## Purpose

The Pac-Man module contains the game-specific application code: scene definitions, actors, sprites, systems, configuration, events, and entity factories.

It depends on the reusable game engine and browser client contracts, but owns the Pac-Man rules and presentation data.

## Main Components

- `src/app/pacman/pacman-game.ts`: game runtime facade that owns the active scene and client event queue.
- `src/app/pacman/pacman-game-client.ts`: Pac-Man-specific browser client that translates keyboard events into Pac-Man events and renders serialized scenes.
- `src/app/pacman/scenes`: scene factories for the match and menu.
- `src/app/pacman/levels`: Pac-Man level definitions and parsing helpers.
- `src/app/pacman/systems`: systems for animation, tile-aware movement, and inactive experimental physics behavior.
- `src/app/pacman/components`: actor state plus level tile, collectible, and spawn marker components.
- `src/app/pacman/factories`: helpers that compose Pac-Man entities from engine components.
- `src/app/pacman/config`: frame-rate, controls, asset, tile, and sprite configuration.
- `src/app/pacman/constants` and `src/app/pacman/interfaces`: Pac-Man-specific event, scene, actor, component, and system definitions.

## How It Works

1. `src/main.ts` creates a `PacmanGame` and a `PacmanGameClient`.
2. `PacmanGameClient.start()` initializes browser input, loads assets, subscribes to game snapshots, and starts the game.
3. `PacmanGame.start()` creates the current scene from parsed level data and calls `scene.init()`.
4. `PacmanGameScene` parses the compact classic level, generates wall/collectible/spawn entities, and places actors at map-defined spawn tiles.
5. On each animation frame, the client drains buffered input events and maps supported arrow keys into Pac-Man movement request events.
6. `PacmanGame.update()` drains queued events, groups them by type, updates the current scene, and notifies subscribers with the serialized scene.
7. Pac-Man systems update actor movement state, buffered direction intent, tile-aware position, and sprite animation frames.
8. The client draws walls and collectibles as primitives, then draws serialized UI and sprite components to the canvas.

## Dependencies

- `src/packages/game-engine` for scenes, systems, entities, components, factories, managers, and physics helpers.
- `src/packages/game-client` for input, asset, and graphics driver contracts.
- `src/packages/shared` for events, geometry, graphics types, queues, observers, and data structures.
- Browser APIs used by the client layer: `requestAnimationFrame`, keyboard events, `Image`, `FontFace`, and Canvas 2D rendering.

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
- Scene loading is currently static and marked for future dynamic loading; scene factories create fresh entities, managers, and systems for each load.
- The physics system exists alongside the movement system but is not currently wired into the active game scene; static maze collision remains tile-query based.
- Collision events are deferred until another system needs a defined collision payload. Wall blocking is direct movement validation.
