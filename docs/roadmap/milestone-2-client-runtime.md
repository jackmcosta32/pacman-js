# Milestone 2: Finish Client Runtime

## Goal

Make the browser client dependable for a canvas game loop.

This milestone should finish input, asset, graphics, and cleanup behavior without adding Pac-Man rules.

## Why This Matters

The game runtime can stay generic only if browser concerns remain isolated. A stable client boundary makes it easier to improve rendering and input without changing simulation systems.

## Task Breakdown

### M2.1 Add Input Driver Cleanup

- Store the `AbortController` created by `InputDriver.init()`.
- Add a `destroy()` or `dispose()` method to remove event listeners.
- Decide whether repeated `init()` calls are ignored or reset the listener controller.

Affected areas:

- `src/packages/game-client/drivers/input.driver.ts`
- `src/packages/game-client/interfaces/driver.interface.ts`
- `src/app/pacman/pacman-game-client.ts`

Verification:

- Unit test or browser smoke check proves listeners do not duplicate after restart.

### M2.2 Define Input Buffer Semantics

- Decide whether the client reads one event per frame or drains all buffered events per frame.
- Decide how key repeat should affect movement.
- Document the selected behavior in the client pattern doc if it changes.

Affected areas:

- `src/packages/game-client/drivers/input.driver.ts`
- `src/app/pacman/pacman-game-client.ts`
- `docs/patterns/client/client-driver-pattern.md`

Verification:

- Tests cover buffer order and clearing behavior.

### M2.3 Handle Device Pixel Ratio

- Update `GraphicsDriver.setResolution()` to account for `devicePixelRatio`.
- Preserve logical scene coordinates while increasing physical canvas pixels.
- Ensure CSS sizing and canvas width/height do not fight each other.

Affected areas:

- `src/packages/game-client/drivers/graphics.driver.ts`
- `src/style.css`

Verification:

- Manual browser check on normal and high-DPI displays.
- Optional canvas smoke test later.

### M2.4 Improve Asset Loading

- Replace load-only happy paths with success and failure paths.
- Reject on image, audio, or font load errors.
- Consider timeouts for assets that never resolve.
- Register loaded fonts with `document.fonts` if needed.

Affected areas:

- `src/packages/game-client/drivers/assets.driver.ts`
- `src/packages/game-client/interfaces/driver.interface.ts`

Verification:

- Unit tests with mocked asset loading where practical.
- Manual check that missing asset paths produce useful errors.

### M2.5 Decide Audio Runtime Boundary

- Decide whether audio playback belongs in `AssetsDriver`, a new `AudioDriver`, or Pac-Man client orchestration.
- Keep playback out of engine systems unless represented as events.
- Define how game events trigger sound effects.

Affected areas:

- `src/packages/game-client`
- `src/app/pacman`

Verification:

- A small sound-trigger test or manual browser check once sounds exist.

### M2.6 Add Client Stop/Restart Flow

- Add a way for `PacmanGameClient` to stop the animation loop.
- Ensure `game.destroy()` and driver cleanup run during stop.
- Prevent multiple `requestAnimationFrame` loops after restart.

Affected areas:

- `src/app/pacman/pacman-game-client.ts`
- `src/packages/game-client/interfaces/game-client.interface.ts`

Verification:

- Manual restart smoke check.
- Tests with mocked `requestAnimationFrame` if practical.

### M2.7 Browser Smoke Checklist

- Add a short manual checklist for browser runtime verification.
- Include startup, movement input, canvas sizing, asset load, and cleanup.

Affected areas:

- `docs/roadmap` or a future `docs/testing` page.

Verification:

- Checklist exists and can be followed after each client change.

## Dependencies

- Milestone 0 must be complete first.
- M2.1 and M2.6 are related and should be designed together.
- M2.3 should happen before visual polish.
- M2.4 should happen before adding more gameplay assets.

## Exit Criteria

- Game client starts and stops cleanly.
- Canvas rendering is crisp and correctly scaled.
- Asset failures are visible and actionable.
- Input buffering behavior is explicit and tested or manually verified.
