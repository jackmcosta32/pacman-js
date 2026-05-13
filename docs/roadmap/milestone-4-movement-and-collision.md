# Milestone 4: Implement Movement And Collision

## Goal

Make player movement feel like Pac-Man and prevent invalid movement through walls.

This milestone should replace the current free-form movement prototype with maze-aware movement.

## Why This Matters

Pac-Man is fundamentally a grid and collision game. Without grid-aware movement, later rules like ghost pathing, tunnels, pellets, and frightened mode will be built on shaky ground.

## Task Breakdown

### M4.1 Define Movement Model

- Decide how world pixels map to tile coordinates.
- Define actor center, tile center, and movement thresholds.
- Decide how speed is expressed: pixels per millisecond, tiles per second, or another unit.

Affected areas:

- `src/app/pacman/config/pacman-game.config.ts`
- `src/app/pacman/interfaces`
- `src/app/pacman/components/pacman-actor.component.ts`

Verification:

- Unit tests for coordinate and tile conversion helpers.

### M4.2 Split Requested Direction From Current Direction

- Store current direction separately from intended direction.
- Map keyboard events to intended direction.
- Continue moving in the current direction until a turn is legal or the actor is blocked.

Affected areas:

- `src/app/pacman/components/pacman-actor.component.ts`
- `src/app/pacman/interfaces/pacman-actor.interface.ts`
- `src/app/pacman/systems/pacman-movement.system.ts`

Verification:

- Tests for buffered direction behavior.

### M4.3 Implement Grid-Aware Movement

- Snap or guide actors toward tile centers before turning.
- Prevent diagonal drift.
- Keep movement smooth between tiles.
- Stop actors when the next tile is blocked.

Affected areas:

- `src/app/pacman/systems/pacman-movement.system.ts`
- `src/app/pacman/config/pacman-game.config.ts`

Verification:

- Tests for legal turns, blocked movement, and no diagonal drift.

### M4.4 Choose Collision Strategy

- Choose tile map collision queries, entity bounding-box collision, or a hybrid.
- Keep the collision decision documented in code and docs.
- Avoid duplicating wall state in incompatible systems.

Affected areas:

- `src/app/pacman`
- `src/packages/game-engine/utils/physics2d`
- `src/packages/shared/data-structures/quad-tree.ts`

Verification:

- Collision tests prove the chosen query method.

### M4.5 Finish Or Replace Physics System

- Decide whether `PacmanPhysicsSystem` replaces `PacmanMovementSystem` or handles only collision validation.
- Give it a unique system id if it remains.
- Inject required spatial or tile collision data explicitly.
- Remove unused imports and scene variables until the system is active.

Affected areas:

- `src/app/pacman/systems/pacman-physics.system.ts`
- `src/app/pacman/constants/pacman-system.constant.ts`
- `src/app/pacman/scenes/pacman-game.scene.ts`

Verification:

- Tests for physics system behavior.
- `pnpm build`

### M4.6 Add Tunnel Wrapping

- Represent tunnel tiles in the level model.
- Move actors from one tunnel exit to the other when crossing the boundary.
- Ensure camera or rendering does not flash invalid positions.

Affected areas:

- `src/app/pacman`

Verification:

- Tests for tunnel entry and exit behavior.

### M4.7 Add Collision Event Flow

- Emit collision events only when other systems need to react.
- Keep movement blocking as direct movement validation if no event is needed.
- Use `PACMAN_EVENT_TYPE.COLLISION` only with a defined payload.

Affected areas:

- `src/app/pacman/constants/pacman-event.constant.ts`
- `src/app/pacman/interfaces/pacman-event.interface.ts`
- `src/app/pacman/systems`

Verification:

- Tests assert collision event payloads if events are used.

## Dependencies

- Milestone 3 should define the level and wall data.
- M4.1 should happen before movement system changes.
- M4.4 should happen before completing `PacmanPhysicsSystem`.

## Exit Criteria

- Pac-Man cannot move through walls.
- Turns work naturally at intersections.
- Movement remains smooth while respecting the tile grid.
- Collision behavior is tested and represented by one clear strategy.
