import { GameActor } from "./game-actor.entity";
import { TILE_SIZE } from "../config/game.config";
import { RED_GHOST_SPRITES_MAP } from "../sprites/red-ghost.sprites";

export class Ghost extends GameActor {
  constructor() {
    super({
      speed: TILE_SIZE / 18,
      position: { x: 128, y: 0 },
      spriteMap: RED_GHOST_SPRITES_MAP,
    });
  }
}
