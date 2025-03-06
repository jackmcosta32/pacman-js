import { Scene } from '@game-engine/core/scene';
import { ACTOR_STATE } from '@pacman/constants/actor.constant';
import { PACMAN_SPRITE_MAP } from '@pacman/sprites/pacman.sprites';
import { PlayerEntityFactory } from '@pacman/factories/player-entity.factory';

// TODO: How can I load a scene dynamically?
export const ClassicGameScene = new Scene({
  size: { width: 100, height: 100 },
  entities: [
    PlayerEntityFactory.make({
      position: { x: 50, y: 50 },
      size: { height: 48, width: 48 },
      spriteMap: PACMAN_SPRITE_MAP,
      animationSequence: ACTOR_STATE.IDLE_DOWN,
    }),
  ],
});
