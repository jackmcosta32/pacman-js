# Shared Module

## Purpose

The shared module provides framework-agnostic types, constants, interfaces, data structures, patterns, and utilities used by the game engine, game client, and Pac-Man application module.

## Main Components

- `src/packages/shared/constants`: shared component and input event type identifiers.
- `src/packages/shared/interfaces`: contracts for assets, coordinates, events, game state, geometry, graphics, observers, queues, and ring buffers.
- `src/packages/shared/data-structures`: `Queue`, `RingBuffer`, and `QuadTree`.
- `src/packages/shared/patterns`: observer helpers.
- `src/packages/shared/utils`: reusable helpers such as sprite-frame extraction.
- `src/packages/shared/types`: generic utility types.

## How It Works

1. Engine, client, and application modules import shared contracts instead of duplicating cross-module shapes.
2. Runtime buffering uses `RingBuffer` and `Queue` for input and game event flow.
3. Spatial lookup experiments use `QuadTree` to store and query entity bounding boxes.
4. Observer helpers provide a small subscription/notification primitive for game snapshot updates.
5. Graphics utilities and interfaces describe sprite sheets, sprite frames, typography, and renderable asset metadata.

## Dependencies

- This module should remain independent from the browser, Vite, Pac-Man feature code, and game-engine concrete classes unless the dependency is purely type-level and intentionally shared.

## Notes

- Keep this module framework-agnostic.
- Put reusable contracts here only when more than one layer needs the shape.
- Keep feature-specific constants, events, and actor state in `src/app/pacman`.
- Keep engine-owned class implementations in `src/packages/game-engine`.
