import { GameActor } from './game-actor.entity';
import { PACMAN_SPRITE_MAP } from '../sprites/pacman.sprites';
import { SPRITE_SIZE, TILE_SIZE } from '../config/game.config';

export class Pacman extends GameActor {
  constructor() {
    super({
      speed: Math.floor(TILE_SIZE / 10),
      position: { x: 0, y: 0 },
      spriteMap: PACMAN_SPRITE_MAP,
      boundingBox: { width: SPRITE_SIZE, height: SPRITE_SIZE },
    });
  }
}
