# Milestone 5: Add Core Pac-Man Rules

## Goal

Turn the prototype into a playable game loop with scoring, lives, collectibles, and round state.

This milestone should create the core Pac-Man gameplay loop before ghost AI is made sophisticated.

## Why This Matters

A Pac-Man game is more than movement in a maze. The player needs objectives, feedback, state transitions, and win/loss conditions.

## Task Breakdown

### M5.1 Add Game State Component Or Store

- Decide where score, lives, level status, and timers live.
- Prefer a Pac-Man-specific state component or scene-level state object.
- Keep generic engine state separate from Pac-Man rules.

Affected areas:

- `src/app/pacman/components`
- `src/app/pacman/systems`
- `src/packages/game-engine/core/scene.ts` only if scene state extension is needed.

Verification:

- Tests for initial game state and state serialization if rendered.

### M5.2 Implement Pellet Collection

- Detect player overlap with pellet tiles or entities.
- Remove collected pellets from the scene or mark them collected.
- Add score for normal pellets.
- Track remaining pellets.

Affected areas:

- `src/app/pacman/systems`
- `src/app/pacman/components`
- `src/app/pacman/constants`

Verification:

- Tests for collection, score change, and remaining pellet count.

### M5.3 Implement Power Pellets

- Detect power pellet collection.
- Add score for power pellets.
- Trigger frightened mode state for ghosts.
- Start and expire a frightened mode timer.

Affected areas:

- `src/app/pacman/systems`
- `src/app/pacman/constants`
- `src/app/pacman/interfaces`

Verification:

- Tests for frightened mode start and expiration.

### M5.4 Add Score UI

- Render score through UI components or a HUD-specific render path.
- Keep score rendering derived from authoritative game state.
- Avoid storing score only in UI text.

Affected areas:

- `src/app/pacman/scenes`
- `src/packages/game-engine/components/ui.component.ts`
- `src/app/pacman/pacman-game-client.ts`

Verification:

- Manual browser check.
- Serialization test if HUD is entity-based.

### M5.5 Add Lives And Death Flow

- Track remaining lives.
- Detect player death events.
- Reset actor positions after death.
- Pause briefly before respawn if desired.
- End the game when lives reach zero.

Affected areas:

- `src/app/pacman/systems`
- `src/app/pacman/scenes`
- `src/app/pacman/components`

Verification:

- Tests for life decrement, respawn, and game-over state.

### M5.6 Add Round Win Flow

- Detect when all pellets are collected.
- Transition to win state or next level state.
- Reset level state cleanly when restarting.

Affected areas:

- `src/app/pacman/systems`
- `src/app/pacman/pacman-game.ts`

Verification:

- Tests for all-pellets-collected condition.

### M5.7 Add Pause And Restart Events

- Define pause and restart event types.
- Map keys to pause/restart input in the client.
- Stop simulation updates while paused, but keep rendering the current scene.

Affected areas:

- `src/app/pacman/constants/pacman-event.constant.ts`
- `src/app/pacman/interfaces/pacman-event.interface.ts`
- `src/app/pacman/pacman-game-client.ts`
- `src/app/pacman/systems`

Verification:

- Tests for paused update behavior.
- Manual keyboard check.

### M5.8 Add Basic Sound Hooks

- Trigger sound effects from game events or state transitions.
- Keep audio playback in the client layer.
- Start with pellet, power pellet, death, and start sounds.

Affected areas:

- `src/packages/game-client`
- `src/app/pacman`

Verification:

- Manual browser audio check.

## Dependencies

- Milestone 4 should be complete so collection and death collision are reliable.
- M5.1 should happen before the other rule systems.
- M5.2 and M5.3 can precede ghost AI, but frightened mode will become more useful in Milestone 6.

## Exit Criteria

- Player can collect pellets and score points.
- Player has lives and can die.
- Round win and game-over conditions exist.
- Game state transitions are explicit and testable.
