import { Component } from '@game-engine/core/component';
import { COMPONENT_TYPE } from '@shared/constants/component.constant';
import type { ISprite, ISpriteFrames } from '@shared/interfaces/graphics.interface';
import type { ISerializedComponent } from '@game-engine/interfaces/entity.interface';

export interface ISpriteComponentConstructor {
  spriteFrames: ISpriteFrames;
}

export interface ISerializedSpriteComponent extends ISerializedComponent {
  sprite: ISprite;
}

export class SpriteComponent extends Component {
  public static readonly type = COMPONENT_TYPE.SPRITE_COMPONENT;

  private animationFrame: number = 0;
  private spriteFrames: ISpriteFrames;

  constructor(params: ISpriteComponentConstructor) {
    super();

    this.spriteFrames = params.spriteFrames;
  }

  public resetAnimationFrame() {
    this.animationFrame = 0;
  }

  public updateSpriteFrames(spriteFrames: ISpriteFrames) {
    this.spriteFrames = spriteFrames;
  }

  public updateAnimationFrame() {
    const nextAnimationFrame = this.animationFrame + 1;

    if (!Array.isArray(this.spriteFrames) || !this.spriteFrames.length) this.animationFrame = 0;
    else if (nextAnimationFrame < this.spriteFrames.length) this.animationFrame += 1;
    else this.animationFrame = 0;
  }

  public get sprite(): ISprite {
    if (!Array.isArray(this.spriteFrames)) return this.spriteFrames;

    const currentSprite = this.spriteFrames[this.animationFrame];

    return currentSprite;
  }

  public serialize(): ISerializedComponent {
    return {
      type: this.type,
      sprite: this.sprite,
    };
  }
}
