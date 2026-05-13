# Milestone 3: Build The Pac-Man Level Model

## Goal

Represent a real Pac-Man maze as data that can generate renderable and collidable entities.

This milestone should move the game scene away from hard-coded actors floating on an empty canvas.

## Why This Matters

Pac-Man rules depend on the maze. Movement, pellets, power pellets, ghost behavior, tunnels, and spawn rules all need a shared level model.

## Task Breakdown

### M3.1 Define Tile Types

- Define tile values for walls, paths, pellets, power pellets, player spawn, ghost spawn, ghost house, and tunnels.
- Keep tile definitions Pac-Man-specific unless a generic tile engine emerges naturally.

Affected areas:

- `src/app/pacman/constants`
- `src/app/pacman/interfaces`

Verification:

- Type tests or unit tests for tile type helpers.

### M3.2 Create Level Data Format

- Choose a readable representation for the classic maze.
- Prefer a simple text/grid format first.
- Include dimensions and tile size assumptions.
- Keep the first map small if necessary to validate the pipeline before adding a full layout.

Affected areas:

- `src/app/pacman`

Verification:

- Parser or loader test proves the map dimensions and tile counts.

### M3.3 Add Level Parsing Helpers

- Convert level data into structured tile records.
- Validate row lengths, unsupported symbols, and required spawn points.
- Return useful errors for invalid maps.

Affected areas:

- `src/app/pacman`
- `src/tests`

Verification:

- Tests for valid and invalid level definitions.

### M3.4 Add Static Entity Factories

- Add factories for wall, pellet, power pellet, and spawn marker entities if they are represented as entities.
- Reuse `PositionComponent` for render and collision placement.
- Add tile or collectible components as needed.

Affected areas:

- `src/app/pacman/factories`
- `src/app/pacman/components`
- `src/packages/game-engine/components` only if a component is truly generic.

Verification:

- Factory tests assert component composition.

### M3.5 Decide Collision Data Shape

- Decide whether walls are entities, static collision data, or both.
- If using a tile collision map, expose queries by tile coordinate and bounding box.
- If using entities, ensure collision systems can query them efficiently.

Affected areas:

- `src/app/pacman`
- `src/packages/shared/data-structures/quad-tree.ts`
- `src/packages/game-engine/utils/physics2d`

Verification:

- Tests for wall lookup at tile and bounding-box level.

### M3.6 Generate Scene From Level Data

- Update `PacmanGameScene` to build initial entities from level data.
- Keep actor spawns data-driven.
- Avoid manually positioning every entity in the scene file.

Affected areas:

- `src/app/pacman/scenes/pacman-game.scene.ts`
- `src/app/pacman/factories`

Verification:

- Scene construction test asserts expected entity groups exist.

### M3.7 Render Maze And Collectibles

- Decide whether maze tiles use sprites, canvas primitives, or both.
- Render walls and pellets through serialized components.
- Keep rendering logic in the client/graphics layer.

Affected areas:

- `src/app/pacman/sprites`
- `src/packages/game-client/drivers/graphics.driver.ts`
- `src/app/pacman/pacman-game-client.ts`

Verification:

- Manual browser check shows the maze and collectibles.

## Dependencies

- Milestone 1 should be mostly complete so scene generation is stable.
- M3.1 through M3.3 should happen before M3.4 through M3.7.
- M3.5 must be settled before Milestone 4 collision work.

## Exit Criteria

- A level can be described as data.
- The scene can generate its initial entities from that data.
- Walls, collectibles, and spawns are represented consistently.
- The browser renders a recognizable Pac-Man playfield.
