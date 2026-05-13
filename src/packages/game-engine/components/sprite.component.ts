import { Component } from '@game-engine/core/component';
import { COMPONENT_TYPE } from '@shared/constants/component.constant';
import type { ISprite, ISpriteFrames } from '@shared/interfaces/graphics.interface';
import type { ISerializedComponent } from '@game-engine/interfaces/component.interface';

export interface ISpriteComponentConstructor {
  animationSpeed?: number;
  animationDuration?: number;
  spriteFrames: ISpriteFrames;
}

export interface ISerializedSpriteComponent extends ISerializedComponent {
  sprite: ISprite;
}

export class SpriteComponent extends Component {
  public static readonly type = COMPONENT_TYPE.SPRITE_COMPONENT;

  private animationSpeed: number;
  private spriteFrames: ISpriteFrames;
  private readonly animationDuration: number;
  private animationFrame: number = 0;
  private lastAnimationUpdateTimestamp: number = 0;

  constructor(params: ISpriteComponentConstructor) {
    super();

    this.spriteFrames = params.spriteFrames;
    this.animationSpeed = params.animationSpeed ?? 1;
    this.animationDuration = params.animationDuration ?? 0;
  }

  public resetAnimationFrame() {
    this.animationFrame = 0;
  }

  public updateSpriteFrames(spriteFrames: ISpriteFrames) {
    this.spriteFrames = spriteFrames;
  }

  public updateAnimationFrame(elapsed: number) {
    if (!Array.isArray(this.spriteFrames) || this.spriteFrames.length <= 1) {
      this.animationFrame = 0;
      return;
    }

    const frameDuration = this.animationDuration / (this.spriteFrames.length * this.animationSpeed);
    const elapsedAnimationTime = this.lastAnimationUpdateTimestamp + elapsed;

    if (frameDuration > elapsedAnimationTime) {
      this.lastAnimationUpdateTimestamp = elapsedAnimationTime;
      return;
    }

    const nextAnimationFrame = this.animationFrame + 1;

    if (nextAnimationFrame < this.spriteFrames.length - 1) this.animationFrame = nextAnimationFrame;
    else this.animationFrame = 0;

    this.lastAnimationUpdateTimestamp -= frameDuration;
  }

  public get sprite(): ISprite {
    if (!Array.isArray(this.spriteFrames)) return this.spriteFrames;

    const currentSprite = this.spriteFrames[this.animationFrame];

    return currentSprite;
  }

  public serialize(): ISerializedComponent {
    return {
      type: this.type,
      sprite: { ...this.sprite },
    };
  }
}
