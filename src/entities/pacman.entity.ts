import { GameActor } from "./game-actor.entity";
import { TILE_SIZE } from "../config/game.config";
import { PACMAN_SPRITES_MAP } from "../sprites/pacman.sprites";

export class Pacman extends GameActor {
  constructor() {
    super({
      speed: TILE_SIZE / 20,
      position: { x: 0, y: 0 },
      spriteMap: PACMAN_SPRITES_MAP,
    });
  }
}
