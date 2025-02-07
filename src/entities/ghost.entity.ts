import type { Keys } from '@/types/util.type';
import { GameActor } from './game-actor.entity';
import { GHOST_COLORS } from '@/models/ghost.model';
import * as GHOST_SPRITES from '@/sprites/ghost.sprites';
import { SPRITE_SIZE, TILE_SIZE } from '@/config/game.config';

export interface TGhostConstructor {
  color?: Keys<typeof GHOST_COLORS>;
}

const COLOR_TO_SPRITE_MAP = {
  [GHOST_COLORS.RED]: GHOST_SPRITES.RED_GHOST_SPRITE_MAP,
  [GHOST_COLORS.PINK]: GHOST_SPRITES.PINK_GHOST_SPRITE_MAP,
  [GHOST_COLORS.BLUE]: GHOST_SPRITES.BLUE_GHOST_SPRITE_MAP,
  [GHOST_COLORS.ORANGE]: GHOST_SPRITES.ORANGE_GHOST_SPRITE_MAP,
  [GHOST_COLORS.GREEN]: GHOST_SPRITES.GREEN_GHOST_SPRITE_MAP,
  [GHOST_COLORS.PURPLE]: GHOST_SPRITES.PURPLE_GHOST_SPRITE_MAP,
};

export class Ghost extends GameActor {
  constructor({ color = GHOST_COLORS.RED }: TGhostConstructor) {
    super({
      speed: Math.floor(TILE_SIZE / 10),
      spriteMap: COLOR_TO_SPRITE_MAP[color],
      boundingBox: { width: SPRITE_SIZE, height: SPRITE_SIZE, x: 128, y: 0 },
    });
  }
}
