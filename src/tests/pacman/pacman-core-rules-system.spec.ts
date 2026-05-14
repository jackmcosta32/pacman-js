import { describe, expect, it } from 'vitest';
import { Entity } from '@game-engine/core/entity';
import { Queue } from '@shared/data-structures/queue';
import { UIComponent } from '@game-engine/components/ui.component';
import { EntityManager } from '@game-engine/managers/entity.manager';
import { SpriteComponent } from '@game-engine/components/sprite.component';
import { ControlComponent } from '@game-engine/components/control.component';
import { PositionComponent } from '@game-engine/components/position.component';
import { PACMAN_EVENT_TYPE } from '@pacman/constants/pacman-event.constant';
import { parsePacmanLevel } from '@pacman/levels/pacman-level.parser';
import { PacmanRoleComponent } from '@pacman/components/pacman-role.component';
import { PacmanActorComponent } from '@pacman/components/pacman-actor.component';
import { PacmanDeathSystem } from '@pacman/systems/pacman-death.system';
import { PacmanHudSystem } from '@pacman/systems/pacman-hud.system';
import { PacmanHudComponent } from '@pacman/components/pacman-hud.component';
import { PacmanMovementSystem } from '@pacman/systems/pacman-movement.system';
import { PacmanRoundStateSystem } from '@pacman/systems/pacman-round-state.system';
import { PacmanCollectionSystem } from '@pacman/systems/pacman-collection.system';
import { PacmanLevelEntityFactory } from '@pacman/factories/pacman-level-entity.factory';
import { PacmanGameStateComponent } from '@pacman/components/pacman-game-state.component';
import { PACMAN_ACTOR_DIRECTION, PACMAN_ACTOR_MOVEMENT_STATE } from '@pacman/constants/pacman-actor.constant';
import {
  PACMAN_ROLE,
  PACMAN_HUD_TYPE,
  PACMAN_ROUND_STATUS,
  PACMAN_SOUND_EFFECT,
} from '@pacman/constants/pacman-game-state.constant';
import type { IEvent } from '@shared/interfaces/event.interface';
import type { ISceneState } from '@game-engine/interfaces/scene.interface';
import type { IPacmanLevelDefinition, IPacmanParsedLevel } from '@pacman/interfaces/pacman-level.interface';

const sprite = { spriteSheetId: 'sprites', x: 0, y: 0, width: 10, height: 10 };

const levelDefinition: IPacmanLevelDefinition = {
  id: 'core-rules-level',
  name: 'Core Rules Level',
  tileSize: 10,
  rows: ['#####', '#PoG#', '#H  #', '#####'],
};

const makeSceneState = (entities: Entity[], elapsed = 0, events: IEvent[] = []): ISceneState => ({
  elapsed,
  entityManager: new EntityManager({ entities }),
  eventQueue: new Queue<IEvent>({ maxLength: 10 }),
  eventMap: events.reduce<Record<string, IEvent[]>>((eventMap, event) => {
    eventMap[event.type] = [...(eventMap[event.type] ?? []), event];

    return eventMap;
  }, {}),
});

const makeStateEntity = (params?: Partial<ConstructorParameters<typeof PacmanGameStateComponent>[0]>) =>
  new Entity({
    id: 'state',
    components: [new PacmanGameStateComponent({ remainingCollectibles: 1, ...params })],
  });

const makePlayer = (
  level: IPacmanParsedLevel,
  params?: {
    position?: { x: number; y: number };
    direction?: typeof PACMAN_ACTOR_DIRECTION.RIGHT | typeof PACMAN_ACTOR_DIRECTION.DOWN;
  },
) => {
  const direction = params?.direction ?? PACMAN_ACTOR_DIRECTION.RIGHT;

  return new Entity({
    id: 'player',
    components: [
      new PacmanRoleComponent({ role: PACMAN_ROLE.PLAYER }),
      new ControlComponent(),
      new PositionComponent({
        size: { width: level.tileSize, height: level.tileSize },
        position: params?.position ?? { ...level.playerSpawn.position },
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
};

const makeGhost = (level: IPacmanParsedLevel, position = level.ghostSpawns[0].position) =>
  new Entity({
    id: 'ghost',
    components: [
      new PacmanRoleComponent({ role: PACMAN_ROLE.GHOST }),
      new PositionComponent({
        size: { width: level.tileSize, height: level.tileSize },
        position: { ...position },
      }),
      new SpriteComponent({ spriteFrames: sprite }),
    ],
  });

const getGameState = (entity: Entity) => entity.getComponent(PacmanGameStateComponent);
const getPosition = (entity: Entity) => entity.getComponent(PositionComponent).position;
const getActor = (entity: Entity) => entity.getComponent(PacmanActorComponent);

describe('Pac-Man - Core rules systems', () => {
  it('should collect pellets, update score, remove entities, and set win state', () => {
    const level = parsePacmanLevel(levelDefinition);
    const pellet = PacmanLevelEntityFactory.makePellet(level.getTileAt(1, 2)!);
    const stateEntity = makeStateEntity();
    const player = makePlayer(level, { position: { ...level.getTileAt(1, 2)!.position } });
    const sceneState = makeSceneState([stateEntity, player, pellet as Entity]);

    new PacmanCollectionSystem().update(sceneState);

    expect(sceneState.entityManager.hasEntity(pellet.id)).toBe(false);
    expect(getGameState(stateEntity)).toMatchObject({
      score: 10,
      remainingCollectibles: 0,
      status: PACMAN_ROUND_STATUS.WON,
    });
    expect(getGameState(stateEntity).serialize().soundHooks.at(-1)).toEqual({
      id: 2,
      soundEffect: PACMAN_SOUND_EFFECT.PELLET,
    });
  });

  it('should let same-tick power pellet collection prevent ghost death collision', () => {
    const level = parsePacmanLevel(levelDefinition);
    const powerPellet = PacmanLevelEntityFactory.makePowerPellet(level.getTileAt(1, 2)!);
    const stateEntity = makeStateEntity({ remainingCollectibles: 2 });
    const player = makePlayer(level, { position: { ...level.getTileAt(1, 2)!.position } });
    const ghost = makeGhost(level, { ...level.getTileAt(1, 2)!.position });
    const sceneState = makeSceneState([stateEntity, player, ghost, powerPellet as Entity]);

    new PacmanCollectionSystem().update(sceneState);
    new PacmanDeathSystem().update(sceneState);

    expect(getGameState(stateEntity)).toMatchObject({
      score: 50,
      lives: 3,
      remainingCollectibles: 1,
      status: PACMAN_ROUND_STATUS.PLAYING,
    });
    expect(getGameState(stateEntity).frightenedRemainingMs).toBeGreaterThan(0);
  });

  it('should freeze movement while paused', () => {
    const level = parsePacmanLevel(levelDefinition);
    const stateEntity = makeStateEntity({ status: PACMAN_ROUND_STATUS.PAUSED });
    const player = makePlayer(level);
    const sceneState = makeSceneState([stateEntity, player], 10, [
      { type: PACMAN_EVENT_TYPE.MOVEMENT_REQUEST, direction: PACMAN_ACTOR_DIRECTION.RIGHT },
    ]);

    new PacmanMovementSystem({ level }).update(sceneState);

    expect(getPosition(player)).toEqual(level.playerSpawn.position);
  });

  it('should keep pause from advancing frightened and respawn timers', () => {
    const level = parsePacmanLevel(levelDefinition);
    const stateEntity = makeStateEntity({
      status: PACMAN_ROUND_STATUS.PAUSED,
      frightenedRemainingMs: 100,
      respawnRemainingMs: 100,
    });
    const sceneState = makeSceneState([stateEntity], 25);

    new PacmanRoundStateSystem({ level }).update(sceneState);

    expect(getGameState(stateEntity)).toMatchObject({
      frightenedRemainingMs: 100,
      respawnRemainingMs: 100,
      status: PACMAN_ROUND_STATUS.PAUSED,
    });
  });

  it('should expire frightened mode while playing and make death collision active again', () => {
    const level = parsePacmanLevel(levelDefinition);
    const stateEntity = makeStateEntity({ frightenedRemainingMs: 5 });
    const player = makePlayer(level);
    const ghost = makeGhost(level, level.playerSpawn.position);
    const sceneState = makeSceneState([stateEntity, player, ghost], 10);

    new PacmanRoundStateSystem({ level }).update(sceneState);
    new PacmanDeathSystem().update(sceneState);

    expect(getGameState(stateEntity)).toMatchObject({
      frightenedRemainingMs: 0,
      lives: 2,
      status: PACMAN_ROUND_STATUS.RESPAWNING,
    });
  });

  it('should finish respawn by resetting actor positions and player movement state', () => {
    const level = parsePacmanLevel(levelDefinition);
    const stateEntity = makeStateEntity({ status: PACMAN_ROUND_STATUS.RESPAWNING, respawnRemainingMs: 5 });
    const player = makePlayer(level, { position: { x: 20, y: 10 }, direction: PACMAN_ACTOR_DIRECTION.RIGHT });
    const ghost = makeGhost(level, { x: 10, y: 10 });
    const sceneState = makeSceneState([stateEntity, player, ghost], 10);

    getActor(player).updateRequestedDirection(PACMAN_ACTOR_DIRECTION.RIGHT);
    new PacmanRoundStateSystem({ level }).update(sceneState);

    expect(getGameState(stateEntity).status).toBe(PACMAN_ROUND_STATUS.PLAYING);
    expect(getPosition(player)).toEqual(level.playerSpawn.position);
    expect(getPosition(ghost)).toEqual(level.ghostSpawns[0].position);
    expect(getActor(player)).toMatchObject({
      currentDirection: PACMAN_ACTOR_DIRECTION.DOWN,
      requestedDirection: PACMAN_ACTOR_DIRECTION.DOWN,
      movementState: PACMAN_ACTOR_MOVEMENT_STATE.IDLE,
    });
  });

  it('should set game over when the player dies with the last life', () => {
    const level = parsePacmanLevel(levelDefinition);
    const stateEntity = makeStateEntity({ lives: 1 });
    const player = makePlayer(level);
    const ghost = makeGhost(level, level.playerSpawn.position);
    const sceneState = makeSceneState([stateEntity, player, ghost]);

    new PacmanDeathSystem().update(sceneState);

    expect(getGameState(stateEntity)).toMatchObject({
      lives: 0,
      status: PACMAN_ROUND_STATUS.GAME_OVER,
    });
    expect(getGameState(stateEntity).serialize().soundHooks.at(-1)).toEqual({
      id: 2,
      soundEffect: PACMAN_SOUND_EFFECT.DEATH,
    });
  });

  it('should derive HUD text from authoritative game state', () => {
    const stateEntity = makeStateEntity({ lives: 2, score: 80, status: PACMAN_ROUND_STATUS.PAUSED });
    const scoreHud = new Entity({
      id: 'score-hud',
      components: [
        new PacmanHudComponent({ hudType: PACMAN_HUD_TYPE.SCORE }),
        new UIComponent({ innerText: 'old score' }),
      ],
    });
    const livesHud = new Entity({
      id: 'lives-hud',
      components: [
        new PacmanHudComponent({ hudType: PACMAN_HUD_TYPE.LIVES }),
        new UIComponent({ innerText: 'old lives' }),
      ],
    });
    const statusHud = new Entity({
      id: 'status-hud',
      components: [
        new PacmanHudComponent({ hudType: PACMAN_HUD_TYPE.STATUS }),
        new UIComponent({ innerText: 'old status' }),
      ],
    });

    new PacmanHudSystem().update(makeSceneState([stateEntity, scoreHud, livesHud, statusHud]));

    expect(scoreHud.getComponent(UIComponent).innerText).toBe('SCORE 80');
    expect(livesHud.getComponent(UIComponent).innerText).toBe('LIVES 2');
    expect(statusHud.getComponent(UIComponent).innerText).toBe('PAUSED');
  });
});
