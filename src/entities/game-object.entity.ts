import type { TSprite } from '../models/animation.model';
import { TBoundingBox } from '../models/bounding-box.model';
import type { TCoordinates } from '../models/position.model';

export interface TGameObjectConstructor {
  position: TCoordinates;
  spriteFrame?: number;
  boundingBox: TBoundingBox;
}

export abstract class GameObject {
  protected spriteFrame: number;
  public position: TCoordinates;
  public boundingBox: TBoundingBox;

  constructor({ position, boundingBox, spriteFrame = 0 }: TGameObjectConstructor) {
    this.position = position;
    this.spriteFrame = spriteFrame;
    this.boundingBox = boundingBox;
  }

  abstract get sprite(): TSprite;

  public get boundingBoxCenterPosition(): TCoordinates {
    return {
      x: this.position.x + this.boundingBox.width / 2,
      y: this.position.y + this.boundingBox.height / 2,
    };
  }
}
