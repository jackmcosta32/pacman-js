# Game Client Module

## Purpose

The game client module contains browser-facing drivers and client contracts. It isolates Canvas, DOM input, and asset loading details from the game engine.

## Main Components

- `src/packages/game-client/drivers/input.driver.ts`: listens to keyboard events and buffers them as shared input events.
- `src/packages/game-client/drivers/assets.driver.ts`: loads and stores sprite sheets, audio, and font faces by asset id.
- `src/packages/game-client/drivers/graphics.driver.ts`: draws sprites and text to a Canvas 2D context and manages canvas resolution.
- `src/packages/game-client/interfaces`: driver, client, and debugger contracts.
- `src/packages/game-client/game-client-debugger.ts`: debugging support for game client state.

## How It Works

1. The browser entry point creates concrete drivers for input, assets, and graphics.
2. The Pac-Man client initializes input listeners.
3. The asset driver loads configured sprite and font assets before gameplay begins.
4. The Pac-Man client subscribes to serialized scene snapshots from the game runtime.
5. On every client update, the input driver exposes buffered keyboard events.
6. The graphics driver clears the canvas, draws serialized text components, and draws serialized sprite components.

## Dependencies

- Browser APIs: `addEventListener`, `AbortController`, `Image`, `Audio`, `FontFace`, and `CanvasRenderingContext2D`.
- `src/packages/shared` for event, asset, coordinate, geometry, and graphics contracts.
- `src/packages/game-engine` serialized component contracts used by render code.

## Notes

- Keep direct browser API usage in drivers or browser client code.
- Keep the engine render-agnostic by consuming only serialized scene data in the client.
- The input driver currently stores keyboard events in a ring buffer and exposes one event at a time through `readInputStream()`.
- The graphics driver currently renders raw sprite dimensions without pixel-ratio scaling.
