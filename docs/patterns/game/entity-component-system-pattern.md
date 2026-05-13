# Entity-Component-System Pattern

## Purpose

This guide documents how gameplay behavior should be modeled in the local game engine. It applies to reusable engine code under `src/packages/game-engine` and feature-specific game code under `src/app/pacman`.

## Recommended Rule

- Model game objects as entities composed from components.
- Store mutable state in components.
- Put behavior that scans or updates entities in systems.
- Keep reusable components and systems generic when they are not Pac-Man-specific.
- Keep Pac-Man rules, events, sprites, and actor state in `src/app/pacman`.
- Use factories when an entity has a repeated component composition.

## Why This Rule Exists

- Entity composition keeps game object variants small and flexible.
- Components make state serialization explicit.
- Systems keep frame-by-frame behavior out of entities and client rendering code.
- Feature code can evolve without turning the generic engine into a Pac-Man-only runtime.

## Recommended Structure Or Usage Pattern

```text
src/packages/game-engine/
  core/
    component.ts
    entity.ts
    scene.ts
    system.ts
  components/
  managers/
  interfaces/

src/app/pacman/
  components/
  factories/
  systems/
  scenes/
  constants/
  interfaces/
```

Use this ownership split:

- `Entity`: stable id plus component map.
- `Component`: state holder with a static `type` and `serialize()` method.
- `System`: behavior that receives `ISceneState` and mutates components.
- `EntityManager`: entity lookup, iteration, and serialization.
- Feature factory: repeated entity composition for players, bots, UI text, or future map pieces.

Use this runtime contract:

- Scenes receive a direct ordered systems array.
- Enabled systems update in array order.
- Disabled systems do not update, but still receive init and destroy hooks.
- Entity add/remove operations go through `EntityManager`, not `Scene` helpers.
- Systems access entities through `sceneState.entityManager`.

## Example

`PacmanPlayerEntityFactory` composes:

- `PacmanActorComponent` for Pac-Man-specific actor state.
- `SpriteComponent` for renderable sprite frames.
- `PositionComponent` for position and bounding box data.
- `ControlComponent` to mark the entity as controllable.

`PacmanMovementSystem` then finds controllable entities, reads actor and position state, and updates position based on movement events.

## Checklist

1. Add state as a component before adding entity-specific mutable fields.
2. Add per-frame behavior as a system.
3. Keep browser APIs out of systems.
4. Keep Pac-Man-specific behavior out of `src/packages/game-engine`.
5. Make serialized component output explicit and stable for the client.
6. Disable a system when it should skip frame updates without skipping setup or cleanup.

## Anti-Patterns

- Do not put Canvas drawing inside entities, components, or systems.
- Do not make the generic engine import from `src/app/pacman`.
- Do not add one-off entity subclasses when component composition is enough.
- Do not mutate another layer through hidden globals when scene state provides the necessary managers and queues.
- Do not add parallel entity mutation paths on `Scene` while `EntityManager` is the canonical owner.
