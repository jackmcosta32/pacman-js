import { Scene } from '@game-engine/core/scene';
import { PACMAN_SPRITE_MAP } from '@pacman/sprites/pacman.sprites';
import { EntityFactory } from '@game-engine/factories/entity.factory';
import { EntityManager } from '@game-engine/managers/entity.manager';
import { RED_GHOST_SPRITE_MAP } from '@pacman/sprites/ghost.sprites';
import { PACMAN_SCENE } from '@pacman/constants/pacman-scene.constant';
import { PACMAN_CLASSIC_LEVEL } from '@pacman/levels/classic-level';
import { UIComponent } from '@game-engine/components/ui.component';
import { MENU_FONT } from '@pacman/config/pacman-asset.config';
import { PositionComponent } from '@game-engine/components/position.component';
import { PacmanHudSystem } from '@pacman/systems/pacman-hud.system';
import { PacmanDeathSystem } from '@pacman/systems/pacman-death.system';
import { PacmanHudComponent } from '@pacman/components/pacman-hud.component';
import { PacmanAnimationSystem } from '@pacman/systems/pacman-animation.system';
import { PacmanBotEntityFactory } from '@pacman/factories/pacman-bot-entity.factory';
import { parsePacmanLevel } from '@pacman/levels/pacman-level.parser';
import { PacmanCollectionSystem } from '@pacman/systems/pacman-collection.system';
import { PacmanPlayerEntityFactory } from '@pacman/factories/pacman-player-entity.factory';
import { PacmanRoundStateSystem } from '@pacman/systems/pacman-round-state.system';
import { PacmanLevelEntityFactory } from '@pacman/factories/pacman-level-entity.factory';
import { PACMAN_ACTOR_DIRECTION, PACMAN_ACTOR_MOVEMENT_STATE } from '@pacman/constants/pacman-actor.constant';
import { PacmanMovementSystem } from '@pacman/systems/pacman-movement.system';
import type { IEvent } from '@shared/interfaces/event.interface';
import type { IQueue } from '@shared/interfaces/queue.interface';
import { PLAYER_SPEED } from '@pacman/config/pacman-game.config';
import { PacmanGameStateComponent } from '@pacman/components/pacman-game-state.component';
import { PACMAN_TILE_TYPE } from '@pacman/constants/pacman-level.constant';
import { PACMAN_HUD_TYPE as PACMAN_GAME_HUD_TYPE } from '@pacman/constants/pacman-game-state.constant';

// TODO: How can I load a scene dynamically?
export const createPacmanGameScene = (eventQueue: IQueue<IEvent>): Scene => {
  const level = parsePacmanLevel(PACMAN_CLASSIC_LEVEL);
  const collectibleCount =
    level.getTilesByType(PACMAN_TILE_TYPE.PELLET).length + level.getTilesByType(PACMAN_TILE_TYPE.POWER_PELLET).length;

  const staticEntities = PacmanLevelEntityFactory.makeStaticEntities(level);

  const firstGhostSpawn = level.ghostSpawns[0];

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
    PacmanPlayerEntityFactory.make({
      speed: PLAYER_SPEED,
      animationDuration: 200,
      position: { ...level.playerSpawn.position },
      size: level.playerSpawn.size,
      actorSpriteMap: PACMAN_SPRITE_MAP,
      spriteFrames: PACMAN_SPRITE_MAP[PACMAN_ACTOR_MOVEMENT_STATE.IDLE][PACMAN_ACTOR_DIRECTION.DOWN],
    }),
    PacmanBotEntityFactory.make({
      animationDuration: 200,
      position: { ...firstGhostSpawn.position },
      size: firstGhostSpawn.size,
      spriteFrames: RED_GHOST_SPRITE_MAP[PACMAN_ACTOR_MOVEMENT_STATE.IDLE][PACMAN_ACTOR_DIRECTION.DOWN],
    }),
  ];

  const entityManager = new EntityManager({ entities });
  const systems = [
    new PacmanRoundStateSystem({ level }),
    new PacmanMovementSystem({ level }),
    new PacmanCollectionSystem(),
    new PacmanDeathSystem(),
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
