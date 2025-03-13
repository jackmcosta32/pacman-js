import { Scene } from '@game-engine/core/scene';
import { PACMAN_SPRITE_MAP } from '@pacman/sprites/pacman.sprites';
import { EntityManager } from '@game-engine/managers/entity.manager';
import { RED_GHOST_SPRITE_MAP } from '@pacman/sprites/ghost.sprites';
import { PACMAN_SCENE } from '@pacman/constants/pacman-scene.constant';
import { PacmanMovementSystem } from '@pacman/systems/pacman-movement.system';
import { PacmanAnimationSystem } from '@pacman/systems/pacman-animation.system';
import { PacmanBotEntityFactory } from '@pacman/factories/pacman-bot-entity.factory';
import { PacmanPlayerEntityFactory } from '@pacman/factories/pacman-player-entity.factory';
import { PACMAN_ACTOR_DIRECTION, PACMAN_ACTOR_MOVEMENT_STATE } from '@pacman/constants/pacman-actor.constant';

const entityManager = new EntityManager({
  entities: [
    PacmanPlayerEntityFactory.make({
      speed: 0.1,
      animationDuration: 200,
      position: { x: 50, y: 50 },
      size: { height: 48, width: 48 },
      actorSpriteMap: PACMAN_SPRITE_MAP,
      spriteFrames: PACMAN_SPRITE_MAP[PACMAN_ACTOR_MOVEMENT_STATE.IDLE][PACMAN_ACTOR_DIRECTION.DOWN],
    }),
    PacmanPlayerEntityFactory.make({
      speed: 0.1,
      animationDuration: 200,
      position: { x: 150, y: 50 },
      size: { height: 48, width: 48 },
      actorSpriteMap: RED_GHOST_SPRITE_MAP,
      spriteFrames: RED_GHOST_SPRITE_MAP[PACMAN_ACTOR_MOVEMENT_STATE.IDLE][PACMAN_ACTOR_DIRECTION.DOWN],
    }),
    PacmanBotEntityFactory.make({
      animationDuration: 200,
      position: { x: 100, y: 50 },
      size: { height: 48, width: 48 },
      spriteFrames: RED_GHOST_SPRITE_MAP[PACMAN_ACTOR_MOVEMENT_STATE.IDLE][PACMAN_ACTOR_DIRECTION.DOWN],
    }),
  ],
});

const systems = [new PacmanAnimationSystem(), new PacmanMovementSystem()];

// TODO: How can I load a scene dynamically?
export const PacmanGameScene = new Scene({
  systems,
  entityManager,
  id: PACMAN_SCENE.CLASSIC_MATCH,
  size: { width: 1280, height: 720 },
  viewport: { width: 1280, height: 720 },
});
