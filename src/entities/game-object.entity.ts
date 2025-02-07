import type { TSprite } from '@/models/animation.model';
import type { TCoordinates } from '@/models/position.model';
import type { TBoundingBox } from '@/models/bounding-box.model';

export interface TGameObjectConstructor {
  spriteFrame?: number;
  boundingBox: TBoundingBox;
}

export abstract class GameObject {
  public boundingBox;
  protected spriteFrame;

  constructor({ boundingBox, spriteFrame = 0 }: TGameObjectConstructor) {
    this.spriteFrame = spriteFrame;
    this.boundingBox = boundingBox;
  }

  abstract get sprite(): TSprite;

  public get position(): TCoordinates {
    return {
      x: this.boundingBox.x,
      y: this.boundingBox.y,
    };
  }

  public get centerPosition(): TCoordinates {
    return {
      x: this.boundingBox.x + this.boundingBox.width / 2,
      y: this.boundingBox.y + this.boundingBox.height / 2,
    };
  }
}
