import { Scene } from '@game-engine/core/scene';
import { PACMAN_SPRITE_MAP } from '@pacman/sprites/pacman.sprites';
import { EntityManager } from '@game-engine/managers/entity.manager';
import { RED_GHOST_SPRITE_MAP } from '@pacman/sprites/ghost.sprites';
import { PACMAN_SCENE } from '@pacman/constants/pacman-scene.constant';
import { PACMAN_CLASSIC_LEVEL } from '@pacman/levels/classic-level';
import { PacmanAnimationSystem } from '@pacman/systems/pacman-animation.system';
import { PacmanBotEntityFactory } from '@pacman/factories/pacman-bot-entity.factory';
import { parsePacmanLevel } from '@pacman/levels/pacman-level.parser';
import { PacmanPlayerEntityFactory } from '@pacman/factories/pacman-player-entity.factory';
import { PacmanLevelEntityFactory } from '@pacman/factories/pacman-level-entity.factory';
import { PACMAN_ACTOR_DIRECTION, PACMAN_ACTOR_MOVEMENT_STATE } from '@pacman/constants/pacman-actor.constant';
import { PacmanMovementSystem } from '@pacman/systems/pacman-movement.system';
import type { IEvent } from '@shared/interfaces/event.interface';
import type { IQueue } from '@shared/interfaces/queue.interface';
import { PLAYER_SPEED } from '@pacman/config/pacman-game.config';

// TODO: How can I load a scene dynamically?
export const createPacmanGameScene = (eventQueue: IQueue<IEvent>): Scene => {
  const level = parsePacmanLevel(PACMAN_CLASSIC_LEVEL);

  const staticEntities = PacmanLevelEntityFactory.makeStaticEntities(level);

  const firstGhostSpawn = level.ghostSpawns[0];

  const entities = [
    ...staticEntities,
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
  const systems = [new PacmanMovementSystem({ level }), new PacmanAnimationSystem()];

  return new Scene({
    systems,
    eventQueue,
    entityManager,
    size: level.size,
    viewport: level.size,
    id: PACMAN_SCENE.CLASSIC_MATCH,
  });
};
