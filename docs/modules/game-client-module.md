# Game Client Module

## Purpose

The game client module contains browser-facing drivers and client contracts. It isolates Canvas, DOM input, asset loading, and audio playback details from the game engine.

## Main Components

- `src/packages/game-client/drivers/input.driver.ts`: listens to keyboard events and buffers them as shared input events.
- `src/packages/game-client/drivers/assets.driver.ts`: loads and stores sprite sheets, audio, and font faces by asset id.
- `src/packages/game-client/drivers/graphics.driver.ts`: draws sprites, text, and primitive shapes to a Canvas 2D context and manages canvas resolution.
- `src/packages/game-client/drivers/audio.driver.ts`: replays cached audio assets by id.
- `src/packages/game-client/interfaces`: driver, client, and debugger contracts.
- `src/packages/game-client/game-client-debugger.ts`: toggleable runtime debugging support for frame, scene, entity, and player-tile state.

## How It Works

1. The browser entry point creates concrete drivers for input, assets, graphics, and audio.
2. The Pac-Man client initializes input listeners.
3. The asset driver loads configured sprite, font, and audio assets before gameplay begins.
4. The Pac-Man client subscribes to serialized scene snapshots from the game runtime.
5. On every client update, the input driver drains buffered keyboard events in insertion order.
6. The graphics driver clears the canvas in logical scene coordinates, draws primitive wall and collectible shapes, draws serialized text components, and draws serialized sprite components.
7. When debug mode is enabled, the Pac-Man client draws debug collision boxes, tile boundaries, tile coordinates, and overlay metrics from the serialized scene.
8. The Pac-Man client reads serialized sound hooks from game state and asks the audio driver to play each new hook once.

## Dependencies

- Browser APIs: `addEventListener`, `AbortController`, `Image`, `Audio`, `FontFace`, and `CanvasRenderingContext2D`.
- `src/packages/shared` for event, asset, coordinate, geometry, and graphics contracts.
- `src/packages/game-engine` serialized component contracts used by render code.

## Notes

- Keep direct browser API usage in drivers or browser client code.
- Keep the engine render-agnostic by consuming only serialized scene data in the client.
- The input driver stores keyboard events in a ring buffer. `drainInputStream()` is the per-frame path; `readInputStream()` remains available for one-at-a-time reads.
- Repeated input driver initialization resets existing listeners and clears stale input.
- The graphics driver scales the physical canvas by `devicePixelRatio` while preserving logical scene coordinates.
- Primitive drawing methods accept framework-agnostic style values such as `fillColor`, `strokeColor`, and `lineWidth`; Pac-Man tile semantics stay in the Pac-Man client.
- The asset driver loads and caches assets only. Audio playback belongs to the audio driver and is triggered by feature clients from serialized game events or state.
- Debug rendering uses existing graphics primitives. Generic drivers do not import Pac-Man constants.
