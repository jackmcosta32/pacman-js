import { describe, expect, it } from 'vitest';
import { Entity } from '@game-engine/core/entity';
import { Queue } from '@shared/data-structures/queue';
import { EntityManager } from '@game-engine/managers/entity.manager';
import { PositionComponent } from '@game-engine/components/position.component';
import { PacmanRoleComponent } from '@pacman/components/pacman-role.component';
import { PacmanActorComponent } from '@pacman/components/pacman-actor.component';
import { PacmanGhostComponent } from '@pacman/components/pacman-ghost.component';
import { parsePacmanLevel } from '@pacman/levels/pacman-level.parser';
import { PacmanGhostModeSystem } from '@pacman/systems/pacman-ghost-mode.system';
import { PacmanGhostTargetingSystem } from '@pacman/systems/pacman-ghost-targeting.system';
import { PacmanGameStateComponent } from '@pacman/components/pacman-game-state.component';
import { PACMAN_ROLE } from '@pacman/constants/pacman-game-state.constant';
import { PACMAN_ACTOR_DIRECTION, PACMAN_ACTOR_MOVEMENT_STATE } from '@pacman/constants/pacman-actor.constant';
import { PACMAN_GHOST_ID, PACMAN_GHOST_MODE } from '@pacman/constants/pacman-ghost.constant';
import type { IEvent } from '@shared/interfaces/event.interface';
import type { ISceneState } from '@game-engine/interfaces/scene.interface';
import type { IPacmanActorDirection } from '@pacman/interfaces/pacman-actor.interface';
import type { IPacmanGhostId, IPacmanGhostMode } from '@pacman/interfaces/pacman-ghost.interface';
import type { IPacmanLevelDefinition, IPacmanParsedLevel } from '@pacman/interfaces/pacman-level.interface';

const levelDefinition: IPacmanLevelDefinition = {
  id: 'ghost-system-level',
  name: 'Ghost System Level',
  tileSize: 10,
  rows: ['#####', '#P G#', '# H #', '#####'],
};

const makeSceneState = (entities: Entity[], elapsed = 0): ISceneState => ({
  elapsed,
  entityManager: new EntityManager({ entities }),
  eventQueue: new Queue<IEvent>({ maxLength: 10 }),
  eventMap: {},
});

const makeStateEntity = (params?: Partial<ConstructorParameters<typeof PacmanGameStateComponent>[0]>) =>
  new Entity({
    id: 'state',
    components: [new PacmanGameStateComponent({ remainingCollectibles: 1, ...params })],
  });

const makePlayer = (level: IPacmanParsedLevel, direction = PACMAN_ACTOR_DIRECTION.RIGHT) =>
  new Entity({
    id: 'player',
    components: [
      new PacmanRoleComponent({ role: PACMAN_ROLE.PLAYER }),
      new PositionComponent({
        size: { width: level.tileSize, height: level.tileSize },
        position: { ...level.playerSpawn.position },
      }),
      new PacmanActorComponent({
        speed: 1,
        direction,
        requestedDirection: direction,
        movementState: PACMAN_ACTOR_MOVEMENT_STATE.WALKING,
        actorSpriteMap: {},
      }),
    ],
  });

const makeGhost = (
  level: IPacmanParsedLevel,
  ghostId: IPacmanGhostId,
  params?: {
    mode?: IPacmanGhostMode;
    released?: boolean;
    releaseDelayMs?: number;
    releaseElapsedMs?: number;
    direction?: IPacmanActorDirection;
    position?: { x: number; y: number };
  },
) => {
  const direction = params?.direction ?? PACMAN_ACTOR_DIRECTION.UP;

  return new Entity({
    id: ghostId,
    components: [
      new PacmanRoleComponent({ role: PACMAN_ROLE.GHOST }),
      new PositionComponent({
        size: { width: level.tileSize, height: level.tileSize },
        position: params?.position ?? { ...level.ghostSpawns[0].position },
      }),
      new PacmanActorComponent({
        speed: 1,
        direction,
        requestedDirection: direction,
        movementState: PACMAN_ACTOR_MOVEMENT_STATE.WALKING,
        actorSpriteMap: {},
      }),
      new PacmanGhostComponent({
        ghostId,
        mode: params?.mode ?? PACMAN_GHOST_MODE.CHASE,
        previousMode: PACMAN_GHOST_MODE.CHASE,
        spawnTile: { row: level.ghostSpawns[0].row, column: level.ghostSpawns[0].column },
        homeTile: { row: level.ghostHouseEntryTile.row, column: level.ghostHouseEntryTile.column },
        houseEntryTile: { row: level.ghostHouseEntryTile.row, column: level.ghostHouseEntryTile.column },
        houseExitTile: { row: level.ghostHouseExitTile.row, column: level.ghostHouseExitTile.column },
        scatterTargetTile: { row: 1, column: 1 },
        released: params?.released ?? true,
        releaseDelayMs: params?.releaseDelayMs ?? 0,
        releaseElapsedMs: params?.releaseElapsedMs,
      }),
    ],
  });
};

describe('Pac-Man - Ghost systems', () => {
  it('should release ghosts by timer and sync frightened mode from game state', () => {
    const level = parsePacmanLevel(levelDefinition);
    const stateEntity = makeStateEntity({ frightenedRemainingMs: 1000, frightenedWindowId: 1 });
    const ghost = makeGhost(level, PACMAN_GHOST_ID.PINKY, {
      released: false,
      releaseDelayMs: 100,
      releaseElapsedMs: 90,
      direction: PACMAN_ACTOR_DIRECTION.RIGHT,
    });
    const sceneState = makeSceneState([stateEntity, ghost], 20);

    new PacmanGhostModeSystem({ level }).update(sceneState);

    expect(ghost.getComponent(PacmanGhostComponent)).toMatchObject({
      released: true,
      mode: PACMAN_GHOST_MODE.FRIGHTENED,
      frightenedWindowId: 1,
    });
    expect(ghost.getComponent(PacmanActorComponent).currentDirection).toBe(PACMAN_ACTOR_DIRECTION.LEFT);
  });

  it('should choose Blinky chase direction toward the player without reversing', () => {
    const level = parsePacmanLevel(levelDefinition);
    const stateEntity = makeStateEntity();
    const player = makePlayer(level);
    const ghost = makeGhost(level, PACMAN_GHOST_ID.BLINKY, { direction: PACMAN_ACTOR_DIRECTION.UP });
    const sceneState = makeSceneState([stateEntity, player, ghost]);

    new PacmanGhostTargetingSystem({ level }).update(sceneState);

    expect(ghost.getComponent(PacmanActorComponent).requestedDirection).toBe(PACMAN_ACTOR_DIRECTION.LEFT);
  });

  it('should allow reversing as a dead-end fallback', () => {
    const deadEndLevel = parsePacmanLevel({
      id: 'ghost-dead-end',
      name: 'Ghost Dead End',
      tileSize: 10,
      rows: ['#####', '#PG##', '###H#', '#####'],
    });
    const stateEntity = makeStateEntity();
    const player = makePlayer(deadEndLevel);
    const ghost = makeGhost(deadEndLevel, PACMAN_GHOST_ID.BLINKY, { direction: PACMAN_ACTOR_DIRECTION.RIGHT });
    const sceneState = makeSceneState([stateEntity, player, ghost]);

    new PacmanGhostTargetingSystem({ level: deadEndLevel }).update(sceneState);

    expect(ghost.getComponent(PacmanActorComponent).requestedDirection).toBe(PACMAN_ACTOR_DIRECTION.LEFT);
  });

  it('should route released ghosts from the house entry toward the house exit', () => {
    const level = parsePacmanLevel(levelDefinition);
    const stateEntity = makeStateEntity();
    const player = makePlayer(level);
    const ghost = makeGhost(level, PACMAN_GHOST_ID.PINKY, {
      direction: PACMAN_ACTOR_DIRECTION.RIGHT,
      position: { ...level.ghostHouseEntryTile.position },
    });
    const sceneState = makeSceneState([stateEntity, player, ghost]);

    new PacmanGhostTargetingSystem({ level }).update(sceneState);

    expect(ghost.getComponent(PacmanActorComponent).requestedDirection).toBe(PACMAN_ACTOR_DIRECTION.UP);
  });

  it('should restore returning ghosts at home and return them to base speed', () => {
    const level = parsePacmanLevel(levelDefinition);
    const stateEntity = makeStateEntity();
    const ghost = makeGhost(level, PACMAN_GHOST_ID.BLINKY, {
      mode: PACMAN_GHOST_MODE.RETURNING_HOME,
      position: { ...level.ghostHouseEntryTile.position },
    });
    const actorComponent = ghost.getComponent(PacmanActorComponent);
    const sceneState = makeSceneState([stateEntity, ghost]);

    actorComponent.updateSpeed(10);
    new PacmanGhostModeSystem({ level }).update(sceneState);

    expect(ghost.getComponent(PacmanGhostComponent)).toMatchObject({
      mode: PACMAN_GHOST_MODE.SCATTER,
      released: true,
    });
    expect(actorComponent.speed).toBeLessThan(10);
  });
});
