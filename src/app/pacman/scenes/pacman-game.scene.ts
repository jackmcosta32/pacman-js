import { Scene } from '@game-engine/core/scene';
import { PACMAN_SPRITE_MAP } from '@pacman/sprites/pacman.sprites';
import { RED_GHOST_SPRITE_MAP } from '@pacman/sprites/ghost.sprites';
import { PacmanBotEntityFactory } from '@pacman/factories/pacman-bot-entity.factory';
import { PacmanPlayerEntityFactory } from '@pacman/factories/pacman-player-entity.factory';
import { PACMAN_ACTOR_DIRECTION, PACMAN_ACTOR_MOVEMENT_STATE } from '@pacman/constants/pacman-actor.constant';

// TODO: How can I load a scene dynamically?
export const PacmanGameScene = new Scene({
  id: 'game-scene',
  size: { width: 1280, height: 720 },
  entities: [
    PacmanPlayerEntityFactory.make({
      speed: 0.1,
      position: { x: 50, y: 50 },
      size: { height: 48, width: 48 },
      actorSpriteMap: PACMAN_SPRITE_MAP,
      spriteFrames: PACMAN_SPRITE_MAP[PACMAN_ACTOR_MOVEMENT_STATE.IDLE][PACMAN_ACTOR_DIRECTION.DOWN],
    }),
    PacmanBotEntityFactory.make({
      position: { x: 100, y: 50 },
      size: { height: 48, width: 48 },
      spriteFrames: RED_GHOST_SPRITE_MAP[PACMAN_ACTOR_MOVEMENT_STATE.IDLE][PACMAN_ACTOR_DIRECTION.DOWN],
    }),
  ],
});
