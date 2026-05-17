# Browser Runtime Smoke Checklist

Use this checklist after client runtime changes that touch input, assets, graphics, or game loop lifecycle.

## Checklist

1. Start the Vite app and confirm the main menu appears without console errors.
2. Press arrow keys on the menu and confirm the selected item changes.
3. Press Enter or Space on Start Game and confirm a fresh classic match appears.
4. Press each arrow key in the match and confirm movement input is accepted without duplicated reactions after restart.
5. Press P and confirm the pause overlay appears; press P again and confirm gameplay resumes.
6. Press R and confirm the match restarts with fresh score, lives, actors, pellets, and sound hooks.
7. Press Escape and confirm the main menu appears and old match entities are gone.
8. Reach or force win/game-over locally and confirm the overlay shows status, score, restart, and menu options.
9. Stop and restart the client runtime from a local test hook or console path and confirm only one animation loop runs.
10. Check the canvas on normal and high-DPI displays; sprites and text should stay crisp and keep the expected logical size.
11. Confirm the maze walls and pellets are visible.
12. Confirm the player and ghost start on map-defined spawn tiles, not the old hard-coded empty-canvas positions.
13. Temporarily point one configured asset to a missing path and confirm startup fails with an error that includes the asset id and path.
14. Restore the asset path and confirm startup succeeds again.

## Notes

- Input is drained once per rendered frame in insertion order.
- Input mapping depends on the current serialized scene id: menu keys navigate/select, while match keys move, pause, restart, or return to menu.
- Canvas dimensions are scaled for `devicePixelRatio`; game coordinates remain logical scene coordinates.
- Level rows preserve spaces; visible maze state should come from parsed level data.
- Audio hooks are consumed from serialized match state and reset when the scene id changes.
