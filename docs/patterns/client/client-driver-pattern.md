# Client Driver Pattern

## Purpose

This guide documents how browser-specific concerns are isolated from the game runtime. Drivers own DOM, asset, input, and Canvas APIs so the game engine can remain render-agnostic.

## Recommended Rule

- Keep browser APIs in `src/packages/game-client/drivers` or in browser client orchestration code.
- Keep driver behavior behind interfaces in `src/packages/game-client/interfaces`.
- Let feature clients translate raw driver events into game-specific events.
- Render serialized scene snapshots, not live engine objects.
- Load assets before starting the game loop.
- Play audio through an audio driver from serialized game events or state, not from engine systems.
- Stop browser loops and input listeners before restarting a client runtime.
- Keep debug rendering client-side and derived from serialized snapshots.

## Why This Rule Exists

- The game engine stays reusable outside the browser.
- Tests can target engine behavior without DOM or Canvas setup.
- Asset loading and rendering failures stay isolated to the client layer.
- Feature modules can decide how raw input maps to game events.

## Recommended Structure Or Usage Pattern

```text
src/packages/game-client/
  drivers/
    audio.driver.ts
    assets.driver.ts
    graphics.driver.ts
    input.driver.ts
  interfaces/
    driver.interface.ts
    game-client.interface.ts

src/app/pacman/
  pacman-game-client.ts
```

Use this ownership split:

- `InputDriver`: raw keyboard event buffering.
- `AssetsDriver`: sprite sheet, audio, and font loading by asset id.
- `GraphicsDriver`: Canvas 2D drawing and resolution management.
- `AudioDriver`: audio playback for assets already loaded and cached by `AssetsDriver`.
- `PacmanGameClient`: Pac-Man-specific orchestration, input mapping, asset selection, and snapshot rendering.
- `GameClientDebugger`: optional client runtime helper for debug enablement, FPS, scene id, entity count, and player tile overlay state.

## Example

`PacmanGameClient` drains buffered input events from `InputDriver`, maps `KEYBOARD_EVENT_TYPE.KEY_DOWN` or `KEYBOARD_EVENT_TYPE.KEY_PRESSED` for `ArrowUp` to Pac-Man movement events, forwards mapped events to `PacmanGame`, and renders the next serialized scene snapshot using `GraphicsDriver`.

`InputDriver.init()` resets previous keyboard listeners and clears stale input. Runtime clients should call `InputDriver.destroy()` during stop or restart cleanup.

`GraphicsDriver.setResolution()` treats scene viewport dimensions as logical coordinates. It scales the physical canvas by `devicePixelRatio` and keeps CSS sizing at the logical resolution.

`AssetsDriver` owns loading, timeout, failure reporting, and asset caching. It may load audio files, but playback belongs to `AudioDriver` or feature-level client orchestration that consumes serialized sound events.

Debug overlays should use normal graphics driver primitives and serialized scene data. Feature-specific debug interpretation, such as Pac-Man tile labels or player tile lookup, belongs in the feature client.

## Checklist

1. Add new browser API usage to a driver when it can be reused.
2. Add or update the driver interface before depending on new driver behavior.
3. Keep feature-specific input mapping in the feature client.
4. Load new assets through `AssetsDriver` before they are used by render code.
5. Keep one-shot sound requests as serialized feature state or events with client-side deduping.
6. Keep Canvas draw calls in `GraphicsDriver` unless a feature-specific renderer abstraction is introduced intentionally.
7. Make repeated `start()` calls idempotent and pair restart flows with `stop()` cleanup.
8. Keep debug toggles out of game event queues unless gameplay systems intentionally consume them.

## Anti-Patterns

- Do not access `window`, `document`, `CanvasRenderingContext2D`, `Image`, `Audio`, or `FontFace` from the game engine.
- Do not make systems load or draw assets.
- Do not make systems play audio or depend on browser audio elements.
- Do not make generic drivers import Pac-Man constants.
- Do not store authoritative game state in the graphics driver.
- Do not add debug-only state to engine serialization when it can be derived by the client.
