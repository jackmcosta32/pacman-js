import { describe, expect, it } from 'vitest';
import { Entity } from '@game-engine/core/entity';
import { Queue } from '@shared/data-structures/queue';
import { EntityManager } from '@game-engine/managers/entity.manager';
import { ControlComponent } from '@game-engine/components/control.component';
import { PositionComponent } from '@game-engine/components/position.component';
import { PACMAN_EVENT_TYPE } from '@pacman/constants/pacman-event.constant';
import type { IEvent } from '@shared/interfaces/event.interface';
import { parsePacmanLevel } from '@pacman/levels/pacman-level.parser';
import { PacmanActorComponent } from '@pacman/components/pacman-actor.component';
import { PacmanMovementSystem } from '@pacman/systems/pacman-movement.system';
import type { IPacmanLevelDefinition, IPacmanParsedLevel } from '@pacman/interfaces/pacman-level.interface';
import type { IPacmanActorDirection, IPacmanActorMovementState } from '@pacman/interfaces/pacman-actor.interface';
import { PACMAN_ACTOR_DIRECTION, PACMAN_ACTOR_MOVEMENT_STATE } from '@pacman/constants/pacman-actor.constant';

const makeDefinition = (rows?: string[]): IPacmanLevelDefinition => ({
  id: 'movement-system-level',
  name: 'Movement System Level',
  tileSize: 10,
  rows: rows ?? ['#####', '#P  #', '#   #', '#H G#', '#####'],
});

const makeTunnelDefinition = (): IPacmanLevelDefinition => ({
  id: 'movement-tunnel-level',
  name: 'Movement Tunnel Level',
  tileSize: 10,
  rows: ['#####', '#P G#', 'T  HT', '#####'],
});

const makePlayer = (
  level: IPacmanParsedLevel,
  params?: {
    position?: { x: number; y: number };
    direction?: IPacmanActorDirection;
    requestedDirection?: IPacmanActorDirection;
    movementState?: IPacmanActorMovementState;
    speed?: number;
  },
) => {
  const direction = params?.direction ?? PACMAN_ACTOR_DIRECTION.RIGHT;

  return new Entity({
    id: 'player',
    components: [
      new ControlComponent(),
      new PositionComponent({
        size: { width: level.tileSize, height: level.tileSize },
        position: params?.position ?? { ...level.playerSpawn.position },
      }),
      new PacmanActorComponent({
        speed: params?.speed ?? 1,
        direction,
        requestedDirection: params?.requestedDirection ?? direction,
        movementState: params?.movementState ?? PACMAN_ACTOR_MOVEMENT_STATE.WALKING,
        actorSpriteMap: {},
      }),
    ],
  });
};

const updateSystem = (level: IPacmanParsedLevel, player: Entity, elapsed: number, events: IEvent[] = []) => {
  const system = new PacmanMovementSystem({ level });
  const entityManager = new EntityManager({ entities: [player] });

  system.update({
    elapsed,
    entityManager,
    eventQueue: new Queue<IEvent>({ maxLength: 10 }),
    eventMap: events.reduce<Record<string, IEvent[]>>((eventMap, event) => {
      eventMap[event.type] = [...(eventMap[event.type] ?? []), event];

      return eventMap;
    }, {}),
  });
};

const getPosition = (player: Entity) => player.getComponent(PositionComponent).position;
const getActor = (player: Entity) => player.getComponent(PacmanActorComponent);

describe('Pac-Man - MovementSystem', () => {
  it('should keep moving in the current direction without new input', () => {
    const level = parsePacmanLevel(makeDefinition());
    const player = makePlayer(level, { direction: PACMAN_ACTOR_DIRECTION.RIGHT });

    updateSystem(level, player, 4);

    expect(getPosition(player)).toEqual({ x: 14, y: 10 });
    expect(getActor(player).movementState).toBe(PACMAN_ACTOR_MOVEMENT_STATE.WALKING);
  });

  it('should keep an idle actor still until a movement request is received', () => {
    const level = parsePacmanLevel(makeDefinition());
    const player = makePlayer(level, {
      movementState: PACMAN_ACTOR_MOVEMENT_STATE.IDLE,
      direction: PACMAN_ACTOR_DIRECTION.RIGHT,
    });

    updateSystem(level, player, 4);

    expect(getPosition(player)).toEqual({ x: 10, y: 10 });
    expect(getActor(player).movementState).toBe(PACMAN_ACTOR_MOVEMENT_STATE.IDLE);
  });

  it('should start an idle actor when a requested direction is legal', () => {
    const level = parsePacmanLevel(makeDefinition());
    const player = makePlayer(level, {
      movementState: PACMAN_ACTOR_MOVEMENT_STATE.IDLE,
      direction: PACMAN_ACTOR_DIRECTION.DOWN,
    });

    updateSystem(level, player, 4, [
      { type: PACMAN_EVENT_TYPE.MOVEMENT_REQUEST, direction: PACMAN_ACTOR_DIRECTION.RIGHT },
    ]);

    expect(getPosition(player)).toEqual({ x: 14, y: 10 });
    expect(getActor(player).currentDirection).toBe(PACMAN_ACTOR_DIRECTION.RIGHT);
    expect(getActor(player).requestedDirection).toBe(PACMAN_ACTOR_DIRECTION.RIGHT);
  });

  it('should buffer an illegal turn and continue in the current direction', () => {
    const level = parsePacmanLevel(makeDefinition());
    const player = makePlayer(level, { direction: PACMAN_ACTOR_DIRECTION.RIGHT });

    updateSystem(level, player, 4, [
      { type: PACMAN_EVENT_TYPE.MOVEMENT_REQUEST, direction: PACMAN_ACTOR_DIRECTION.UP },
    ]);

    expect(getPosition(player)).toEqual({ x: 14, y: 10 });
    expect(getActor(player).currentDirection).toBe(PACMAN_ACTOR_DIRECTION.RIGHT);
    expect(getActor(player).requestedDirection).toBe(PACMAN_ACTOR_DIRECTION.UP);
  });

  it('should not apply player input events to actors without control', () => {
    const level = parsePacmanLevel(makeDefinition());
    const ghost = new Entity({
      id: 'ghost',
      components: [
        new PositionComponent({
          size: { width: level.tileSize, height: level.tileSize },
          position: { ...level.ghostSpawns[0].position },
        }),
        new PacmanActorComponent({
          speed: 1,
          direction: PACMAN_ACTOR_DIRECTION.LEFT,
          requestedDirection: PACMAN_ACTOR_DIRECTION.LEFT,
          movementState: PACMAN_ACTOR_MOVEMENT_STATE.WALKING,
          actorSpriteMap: {},
        }),
      ],
    });

    updateSystem(level, ghost, 4, [
      { type: PACMAN_EVENT_TYPE.MOVEMENT_REQUEST, direction: PACMAN_ACTOR_DIRECTION.UP },
    ]);

    expect(getActor(ghost).requestedDirection).toBe(PACMAN_ACTOR_DIRECTION.LEFT);
  });

  it('should apply a buffered turn when the actor reaches a legal centered tile', () => {
    const level = parsePacmanLevel(makeDefinition());
    const player = makePlayer(level, {
      position: { x: 20, y: 10 },
      direction: PACMAN_ACTOR_DIRECTION.RIGHT,
      requestedDirection: PACMAN_ACTOR_DIRECTION.DOWN,
    });

    updateSystem(level, player, 4);

    expect(getPosition(player)).toEqual({ x: 20, y: 14 });
    expect(getActor(player).currentDirection).toBe(PACMAN_ACTOR_DIRECTION.DOWN);
  });

  it('should reverse direction immediately without requiring center alignment', () => {
    const level = parsePacmanLevel(makeDefinition());
    const player = makePlayer(level, {
      position: { x: 23, y: 10 },
      direction: PACMAN_ACTOR_DIRECTION.RIGHT,
      requestedDirection: PACMAN_ACTOR_DIRECTION.LEFT,
    });

    updateSystem(level, player, 4);

    expect(getPosition(player)).toEqual({ x: 19, y: 10 });
    expect(getActor(player).currentDirection).toBe(PACMAN_ACTOR_DIRECTION.LEFT);
  });

  it('should stop at walls without entering a blocking tile', () => {
    const level = parsePacmanLevel(makeDefinition());
    const player = makePlayer(level, {
      position: { x: 30, y: 10 },
      direction: PACMAN_ACTOR_DIRECTION.RIGHT,
      requestedDirection: PACMAN_ACTOR_DIRECTION.RIGHT,
    });

    updateSystem(level, player, 4);

    expect(getPosition(player)).toEqual({ x: 30, y: 10 });
    expect(getActor(player).movementState).toBe(PACMAN_ACTOR_MOVEMENT_STATE.IDLE);
  });

  it('should sweep large elapsed movement without skipping an intervening wall', () => {
    const level = parsePacmanLevel(makeDefinition());
    const player = makePlayer(level, {
      position: { x: 10, y: 10 },
      direction: PACMAN_ACTOR_DIRECTION.RIGHT,
      requestedDirection: PACMAN_ACTOR_DIRECTION.RIGHT,
    });

    updateSystem(level, player, 100);

    expect(getPosition(player)).toEqual({ x: 30, y: 10 });
    expect(getActor(player).movementState).toBe(PACMAN_ACTOR_MOVEMENT_STATE.IDLE);
  });

  it('should still apply a buffered turn during a large elapsed movement step', () => {
    const level = parsePacmanLevel(makeDefinition(['#####', '#P  #', '##  #', '#H G#', '#####']));
    const player = makePlayer(level, {
      direction: PACMAN_ACTOR_DIRECTION.RIGHT,
      requestedDirection: PACMAN_ACTOR_DIRECTION.DOWN,
    });

    updateSystem(level, player, 30);

    expect(getPosition(player)).toEqual({ x: 20, y: 30 });
    expect(getActor(player).currentDirection).toBe(PACMAN_ACTOR_DIRECTION.DOWN);
  });

  it('should not move diagonally while correcting center alignment', () => {
    const level = parsePacmanLevel(makeDefinition());
    const player = makePlayer(level, {
      position: { x: 10, y: 12 },
      direction: PACMAN_ACTOR_DIRECTION.RIGHT,
      requestedDirection: PACMAN_ACTOR_DIRECTION.RIGHT,
    });

    updateSystem(level, player, 4);

    expect(getPosition(player)).toEqual({ x: 14, y: 10 });
  });

  it('should keep non-tunnel boundary movement blocked', () => {
    const level = parsePacmanLevel(makeDefinition(['#####', 'P  G#', '#H  #', '#####']));
    const player = makePlayer(level, {
      position: { x: 0, y: 10 },
      direction: PACMAN_ACTOR_DIRECTION.LEFT,
      requestedDirection: PACMAN_ACTOR_DIRECTION.LEFT,
    });

    updateSystem(level, player, 4);

    expect(getPosition(player)).toEqual({ x: 0, y: 10 });
    expect(getActor(player).movementState).toBe(PACMAN_ACTOR_MOVEMENT_STATE.IDLE);
  });

  it('should wrap from one tunnel exit to the paired tunnel tile', () => {
    const level = parsePacmanLevel(makeTunnelDefinition());
    const player = makePlayer(level, {
      position: { x: 0, y: 20 },
      direction: PACMAN_ACTOR_DIRECTION.LEFT,
      requestedDirection: PACMAN_ACTOR_DIRECTION.LEFT,
    });

    updateSystem(level, player, 4);

    expect(getPosition(player)).toEqual({ x: 40, y: 20 });
    expect(getActor(player).currentDirection).toBe(PACMAN_ACTOR_DIRECTION.LEFT);
  });
});
