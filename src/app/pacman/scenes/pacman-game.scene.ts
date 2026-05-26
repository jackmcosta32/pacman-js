import { Scene } from '@game-engine/core/scene';
import { PACMAN_SPRITE_MAP } from '@pacman/sprites/pacman.sprites';
import { EntityFactory } from '@game-engine/factories/entity.factory';
import { EntityManager } from '@game-engine/managers/entity.manager';
import {
  RED_GHOST_SPRITE_MAP,
  BLUE_GHOST_SPRITE_MAP,
  PINK_GHOST_SPRITE_MAP,
  ORANGE_GHOST_SPRITE_MAP,
} from '@pacman/sprites/ghost.sprites';
import { PACMAN_SCENE } from '@pacman/constants/pacman-scene.constant';
import { PACMAN_CLASSIC_LEVEL } from '@pacman/levels/classic-level';
import { UIComponent } from '@game-engine/components/ui.component';
import { MENU_FONT } from '@pacman/config/pacman-asset.config';
import { PositionComponent } from '@game-engine/components/position.component';
import { PacmanHudSystem } from '@pacman/systems/pacman-hud.system';
import { PacmanHudComponent } from '@pacman/components/pacman-hud.component';
import { PacmanAnimationSystem } from '@pacman/systems/pacman-animation.system';
import { PacmanGhostModeSystem } from '@pacman/systems/pacman-ghost-mode.system';
import { PacmanGhostEntityFactory } from '@pacman/factories/pacman-ghost-entity.factory';
import { parsePacmanLevel } from '@pacman/levels/pacman-level.parser';
import { PacmanCollectionSystem } from '@pacman/systems/pacman-collection.system';
import { PacmanPlayerEntityFactory } from '@pacman/factories/pacman-player-entity.factory';
import { PacmanRoundStateSystem } from '@pacman/systems/pacman-round-state.system';
import { PacmanGhostCollisionSystem } from '@pacman/systems/pacman-ghost-collision.system';
import { PacmanLevelEntityFactory } from '@pacman/factories/pacman-level-entity.factory';
import { PACMAN_ACTOR_DIRECTION, PACMAN_ACTOR_MOVEMENT_STATE } from '@pacman/constants/pacman-actor.constant';
import { PacmanMovementSystem } from '@pacman/systems/pacman-movement.system';
import { PacmanGhostTargetingSystem } from '@pacman/systems/pacman-ghost-targeting.system';
import type { IEvent } from '@shared/interfaces/event.interface';
import type { IQueue } from '@shared/interfaces/queue.interface';
import { PLAYER_SPEED } from '@pacman/config/pacman-game.config';
import { PacmanGameStateComponent } from '@pacman/components/pacman-game-state.component';
import { PACMAN_TILE_TYPE } from '@pacman/constants/pacman-level.constant';
import { PACMAN_GHOST_ID, PACMAN_GHOST_CONFIG, PACMAN_GHOST_BASE_SPEED } from '@pacman/constants/pacman-ghost.constant';
import { PACMAN_HUD_TYPE as PACMAN_GAME_HUD_TYPE } from '@pacman/constants/pacman-game-state.constant';
import type { IPacmanParsedLevel, IPacmanTile } from '@pacman/interfaces/pacman-level.interface';
import type { IPacmanGhostScatterCorner } from '@pacman/interfaces/pacman-ghost.interface';

const GHOST_SPRITE_MAP_BY_ID = {
  [PACMAN_GHOST_ID.BLINKY]: RED_GHOST_SPRITE_MAP,
  [PACMAN_GHOST_ID.PINKY]: PINK_GHOST_SPRITE_MAP,
  [PACMAN_GHOST_ID.INKY]: BLUE_GHOST_SPRITE_MAP,
  [PACMAN_GHOST_ID.CLYDE]: ORANGE_GHOST_SPRITE_MAP,
} as const;

const GHOST_IDS = [PACMAN_GHOST_ID.BLINKY, PACMAN_GHOST_ID.PINKY, PACMAN_GHOST_ID.INKY, PACMAN_GHOST_ID.CLYDE] as const;

const tileCoordinate = (tile: IPacmanTile) => ({ row: tile.row, column: tile.column });

const getScatterTargetTile = (level: IPacmanParsedLevel, corner: IPacmanGhostScatterCorner): IPacmanTile => {
  const row = corner.includes('bottom') ? level.height - 2 : 1;
  const column = corner.includes('right') ? level.width - 2 : 1;

  return level.getTileAt(row, column) ?? level.playerSpawn;
};

export const createPacmanGameScene = (eventQueue: IQueue<IEvent>): Scene => {
  const level = parsePacmanLevel(PACMAN_CLASSIC_LEVEL);
  const collectibleCount =
    level.getTilesByType(PACMAN_TILE_TYPE.PELLET).length + level.getTilesByType(PACMAN_TILE_TYPE.POWER_PELLET).length;

  const staticEntities = PacmanLevelEntityFactory.makeStaticEntities(level);

  const entities = [
    EntityFactory.with(new PacmanGameStateComponent({ remainingCollectibles: collectibleCount })).make(),
    ...staticEntities,
    EntityFactory.with(new PacmanHudComponent({ hudType: PACMAN_GAME_HUD_TYPE.SCORE }))
      .with(new UIComponent({ color: 'white', fontSize: 16, fontFamily: MENU_FONT.id, innerText: 'SCORE 0' }))
      .with(new PositionComponent({ position: { x: 12, y: 18 }, size: { width: 120, height: 18 } }))
      .make(),
    EntityFactory.with(new PacmanHudComponent({ hudType: PACMAN_GAME_HUD_TYPE.LIVES }))
      .with(new UIComponent({ color: 'white', fontSize: 16, fontFamily: MENU_FONT.id, innerText: 'LIVES 3' }))
      .with(new PositionComponent({ position: { x: 156, y: 18 }, size: { width: 120, height: 18 } }))
      .make(),
    EntityFactory.with(new PacmanHudComponent({ hudType: PACMAN_GAME_HUD_TYPE.STATUS }))
      .with(new UIComponent({ color: '#f8e6b0', fontSize: 16, fontFamily: MENU_FONT.id, innerText: '' }))
      .with(new PositionComponent({ position: { x: 324, y: 18 }, size: { width: 160, height: 18 } }))
      .make(),
    EntityFactory.with(new PacmanHudComponent({ hudType: PACMAN_GAME_HUD_TYPE.OVERLAY_STATUS }))
      .with(
        new UIComponent({
          color: '#f8e6b0',
          fontSize: 32,
          fontFamily: MENU_FONT.id,
          innerText: '',
          textAlign: 'center',
        }),
      )
      .with(
        new PositionComponent({
          position: { x: Math.floor(level.size.width / 2), y: Math.floor(level.size.height / 2) - 36 },
          size: { width: 240, height: 36 },
        }),
      )
      .make(),
    EntityFactory.with(new PacmanHudComponent({ hudType: PACMAN_GAME_HUD_TYPE.OVERLAY_PROMPT }))
      .with(
        new UIComponent({
          color: 'white',
          fontSize: 16,
          fontFamily: MENU_FONT.id,
          innerText: '',
          textAlign: 'center',
        }),
      )
      .with(
        new PositionComponent({
          position: { x: Math.floor(level.size.width / 2), y: Math.floor(level.size.height / 2) + 8 },
          size: { width: 360, height: 18 },
        }),
      )
      .make(),
    PacmanPlayerEntityFactory.make({
      speed: PLAYER_SPEED,
      animationDuration: 200,
      position: { ...level.playerSpawn.position },
      size: level.playerSpawn.size,
      actorSpriteMap: PACMAN_SPRITE_MAP,
      spriteFrames: PACMAN_SPRITE_MAP[PACMAN_ACTOR_MOVEMENT_STATE.IDLE][PACMAN_ACTOR_DIRECTION.DOWN],
    }),
    ...GHOST_IDS.map((ghostId, index) => {
      const slot = level.ghostStartSlots[index] ?? level.ghostStartSlots[level.ghostStartSlots.length - 1];
      const config = PACMAN_GHOST_CONFIG[ghostId];
      const actorSpriteMap = GHOST_SPRITE_MAP_BY_ID[ghostId];
      const scatterTargetTile = getScatterTargetTile(level, config.scatterCorner);

      return PacmanGhostEntityFactory.make({
        ghostId,
        speed: PACMAN_GHOST_BASE_SPEED,
        animationDuration: 200,
        direction: config.direction,
        currentDirection: config.direction,
        requestedDirection: config.direction,
        movementState:
          config.releaseDelayMs === 0 ? PACMAN_ACTOR_MOVEMENT_STATE.WALKING : PACMAN_ACTOR_MOVEMENT_STATE.IDLE,
        actorSpriteMap,
        position: { ...slot.spawnTile.position },
        size: slot.spawnTile.size,
        spriteFrames: actorSpriteMap[PACMAN_ACTOR_MOVEMENT_STATE.IDLE][config.direction],
        spawnTile: tileCoordinate(slot.spawnTile),
        homeTile: tileCoordinate(slot.homeTile),
        houseEntryTile: tileCoordinate(slot.houseEntryTile),
        houseExitTile: tileCoordinate(slot.houseExitTile),
        scatterTargetTile: tileCoordinate(scatterTargetTile),
        released: config.releaseDelayMs === 0,
        releaseDelayMs: config.releaseDelayMs,
      });
    }),
  ];

  const entityManager = new EntityManager({ entities });
  const systems = [
    new PacmanRoundStateSystem({ level }),
    new PacmanGhostModeSystem({ level }),
    new PacmanGhostTargetingSystem({ level }),
    new PacmanMovementSystem({ level }),
    new PacmanCollectionSystem(),
    new PacmanGhostCollisionSystem(),
    new PacmanHudSystem(),
    new PacmanAnimationSystem(),
  ];

  return new Scene({
    systems,
    eventQueue,
    entityManager,
    size: level.size,
    viewport: level.size,
    id: PACMAN_SCENE.CLASSIC_MATCH,
  });
};
