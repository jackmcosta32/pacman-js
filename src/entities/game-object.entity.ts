import type { TSprite } from "../models/animation.model";
import type { TCoordinates } from "../models/position.model";

export interface TGameObjectConstructor {
  position: TCoordinates;
  spriteFrame?: number;
}

export abstract class GameObject {
  protected spriteFrame: number;
  protected position: TCoordinates;

  constructor({ position, spriteFrame = 0 }: TGameObjectConstructor) {
    this.position = position;
    this.spriteFrame = spriteFrame;
  }

  abstract get sprite(): TSprite;
}
