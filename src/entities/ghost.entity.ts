import type { Keys } from "../types/util.type";
import { GameActor } from "./game-actor.entity";
import { TILE_SIZE } from "../config/game.config";
import { GHOST_COLORS } from "../models/ghost.model";
import * as GHOST_SPRITES from "../sprites/ghost.sprites";

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
      speed: TILE_SIZE / 18,
      position: { x: 128, y: 0 },
      spriteMap: COLOR_TO_SPRITE_MAP[color],
    });
  }
}
