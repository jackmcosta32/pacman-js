# Game Engine Module

## Purpose

The game engine module provides reusable runtime primitives for entity-component-system gameplay. It is framework-agnostic and does not know about Pac-Man assets, controls, or browser rendering.

## Main Components

- `src/packages/game-engine/core`: base `Entity`, `Component`, `System`, and `Scene` implementations.
- `src/packages/game-engine/components`: reusable components such as position, sprite, UI, control, and camera data.
- `src/packages/game-engine/interfaces`: contracts for scenes, entities, components, systems, and managers.
- `src/packages/game-engine/managers`: entity and system collection managers.
- `src/packages/game-engine/factories`: entity factories for generic entities and text entities.
- `src/packages/game-engine/utils`: reusable engine utilities such as 2D bounding-box collision checks.

## How It Works

1. Feature modules create entities by composing component instances.
2. An `EntityManager` stores entities by id and exposes iteration, lookup, add, remove, clear, and serialization operations.
3. A `Scene` receives systems, an entity manager, viewport data, scene size, and an event queue.
4. `Scene.init()` gives each system the initial scene state.
5. `Scene.update()` computes elapsed time and calls each enabled system with the event map, event queue, and entity manager.
6. Systems read components from entities and mutate component state.
7. `Scene.serialize()` returns a snapshot with scene metadata and serialized entities for the client to render.

## Runtime Contracts

- `Game.start()` starts the app runtime and initializes the active scene.
- `Game.update()` drains runtime/client events and advances the active scene.
- `Game.destroy()` tears down the active scene/runtime.
- `Scene.init()` initializes systems with complete scene state.
- `Scene.update()` advances enabled systems in the order provided to the scene.
- `Scene.destroy()` calls system teardown hooks and clears managed entities.
- `System.init()`, `System.update()`, and `System.destroy()` are optional hooks.
- Disabled systems skip `update()` only; initialization and teardown still run.
- Scenes keep a direct `systems` array. `SystemManager` remains a standalone manager for add, remove, lookup, iteration, clear, and serialization behavior.
- Entity mutation is owned by `EntityManager`; scenes and systems access entities through `ISceneState.entityManager`.

## Dependencies

- `src/packages/shared/interfaces` for geometry, coordinates, queues, events, and game state contracts.
- `src/packages/shared/constants` for shared component and event type identifiers.
- `lodash/uniqueId` in the generic entity factory.

## Notes

- Engine code should stay free of browser APIs and Pac-Man-specific behavior.
- Components expose a static `type` and serialize their own public render or state data.
- Follow the component authoring and system authoring pattern docs when adding reusable ECS primitives.
- UI text may be updated through `UIComponent.updateInnerText()` when a feature-level system derives HUD text from authoritative state.
- Systems should operate through scene state and entity components rather than owning feature-specific global state.
- The serialized scene is a stable snapshot consumed by browser rendering code.
- Generic collision and render abstraction components are deferred until gameplay or rendering needs make their payloads concrete.
