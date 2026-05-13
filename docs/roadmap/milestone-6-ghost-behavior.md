# Milestone 6: Add Ghost Behavior

## Goal

Implement ghost actors with recognizable Pac-Man behavior while keeping AI isolated from generic engine code.

This milestone should turn ghosts from static or simple actors into autonomous enemies.

## Why This Matters

Ghost behavior is the heart of Pac-Man's challenge. It requires path decisions, mode transitions, collision outcomes, and state that interacts with power pellets and scoring.

## Task Breakdown

### M6.1 Add Ghost Identity And State

- Add ghost identity values for each ghost.
- Add ghost mode state: scatter, chase, frightened, eaten, and returning home.
- Store mode and identity in Pac-Man-specific components.

Affected areas:

- `src/app/pacman/components`
- `src/app/pacman/constants`
- `src/app/pacman/interfaces`

Verification:

- Component serialization tests.

### M6.2 Add Ghost Spawn And House Rules

- Use level data to place ghosts.
- Define ghost house entry and exit tiles.
- Add release timing or pellet-count release rules.

Affected areas:

- `src/app/pacman/scenes`
- `src/app/pacman/systems`
- `src/app/pacman/level` or equivalent level module.

Verification:

- Tests for initial placement and release conditions.

### M6.3 Add Path Selection At Intersections

- Detect valid directions at intersections.
- Prevent ghosts from reversing direction except when rules allow it.
- Select next direction based on current mode.

Affected areas:

- `src/app/pacman/systems`
- `src/app/pacman/utils` if path helpers are introduced.

Verification:

- Tests for valid direction selection.

### M6.4 Implement Scatter And Chase Targeting

- Define target tiles for scatter mode.
- Define chase targeting per ghost.
- Keep targeting strategies Pac-Man-specific and testable.

Affected areas:

- `src/app/pacman/systems`
- `src/app/pacman/interfaces`

Verification:

- Tests for each ghost's target selection.

### M6.5 Implement Frightened Mode

- Trigger frightened mode from power pellets.
- Use slower or altered movement if desired.
- Randomize or reverse ghost direction according to selected rules.
- Expire frightened mode after a timer.

Affected areas:

- `src/app/pacman/systems`
- `src/app/pacman/components`

Verification:

- Tests for mode transition and expiration.

### M6.6 Implement Eaten And Returning Home

- Detect player collision with frightened ghost.
- Award ghost-eaten score.
- Move eaten ghosts back to the ghost house.
- Restore normal ghost mode after return.

Affected areas:

- `src/app/pacman/systems`

Verification:

- Tests for eaten scoring and return-to-house flow.

### M6.7 Implement Player-Ghost Collision Outcomes

- If ghost is normal, player loses a life.
- If ghost is frightened, ghost is eaten.
- If ghost is eaten or returning, collision should not kill the player.

Affected areas:

- `src/app/pacman/systems`
- `src/app/pacman/interfaces/pacman-event.interface.ts`

Verification:

- Tests for each collision outcome.

## Dependencies

- Milestone 4 must provide reliable movement and collision.
- Milestone 5 should provide power pellet and scoring state.
- M6.1 should happen before all other ghost tasks.

## Exit Criteria

- Ghosts move autonomously through the maze.
- Ghost modes transition based on timers and player actions.
- Player/ghost collisions produce correct death or scoring behavior.
- Ghost AI remains outside the generic engine.
