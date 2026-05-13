# Scene Serialization Pattern

## Purpose

This guide documents the runtime boundary between the game simulation and browser rendering. Scenes update authoritative component state, then expose a serialized snapshot that the client can draw.

## Recommended Rule

- Treat `Scene.serialize()` as the boundary between game state and rendering.
- Pass input into the game as events, not direct component mutations from the client.
- Group queued events by type before systems consume them.
- Keep scene updates deterministic with respect to elapsed time, queued events, systems, and entity state.
- Keep render-only browser details out of serialized game state.

## Why This Rule Exists

- The client can render snapshots without owning simulation rules.
- Systems can be tested without depending on Canvas or DOM APIs.
- A stable snapshot shape makes later debugging, networking, replay, or worker isolation easier.
- Event queues decouple input timing from simulation updates.

## Recommended Structure Or Usage Pattern

```text
InputDriver
  -> PacmanGameClient.readInputEvents()
  -> PacmanGame.readClientEvent()
  -> Queue<IEvent>
  -> PacmanGame.update()
  -> Scene.update({ eventMap, eventQueue })
  -> System.update(sceneState)
  -> Scene.serialize()
  -> PacmanGameClient.syncGameScene()
  -> GraphicsDriver
```

## Example

1. The input driver buffers a keyboard event.
2. `PacmanGameClient` maps `ArrowLeft` into a Pac-Man movement event.
3. `PacmanGame` enqueues the event and drains events during `update()`.
4. `PacmanMovementSystem` receives movement events through `sceneState.eventMap`.
5. The movement system updates `PositionComponent` and `PacmanActorComponent`.
6. The scene serializes entity components.
7. The graphics driver draws the serialized sprite at the serialized position.

## Checklist

1. New client input should become a typed event before entering the game runtime.
2. New systems should read events from `sceneState.eventMap` or shared scene state.
3. New renderable component data should be included in `serialize()`.
4. Client rendering should consume serialized data instead of concrete component instances.

## Anti-Patterns

- Do not let the client directly mutate engine entities.
- Do not pass Canvas context or DOM objects into scenes or systems.
- Do not make systems depend on serialized output from another system.
- Do not hide event flow in feature globals when the queue already exists.
