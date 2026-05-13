# Browser Runtime Smoke Checklist

Use this checklist after client runtime changes that touch input, assets, graphics, or game loop lifecycle.

## Checklist

1. Start the Vite app and confirm the Pac-Man scene appears without console errors.
2. Press each arrow key and confirm movement input is accepted without duplicated reactions after restart.
3. Stop and restart the client runtime from a local test hook or console path and confirm only one animation loop runs.
4. Check the canvas on normal and high-DPI displays; sprites and text should stay crisp and keep the expected logical size.
5. Temporarily point one configured asset to a missing path and confirm startup fails with an error that includes the asset id and path.
6. Restore the asset path and confirm startup succeeds again.

## Notes

- Input is drained once per rendered frame in insertion order.
- Canvas dimensions are scaled for `devicePixelRatio`; game coordinates remain logical scene coordinates.
- Audio files may be loaded by the asset driver, but playback is intentionally outside the Milestone 2 runtime boundary.
