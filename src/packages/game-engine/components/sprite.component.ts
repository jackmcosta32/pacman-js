import { Component } from '@game-engine/core/component';
import { COMPONENT_TYPE } from '@shared/constants/component.constant';
import type { ISprite, ISpriteMap } from '@shared/interfaces/graphics.interface';
import type { ISerializedComponent } from '@game-engine/interfaces/entity.interface';

export interface ISpriteComponentConstructor {
  animationSequence: string;
  spriteMap: ISpriteMap<string>;
}

export interface ISerializedSpriteComponent extends ISerializedComponent {
  sprite: ISprite;
}

export class SpriteComponent extends Component {
  public static readonly type = COMPONENT_TYPE.SPRITE_COMPONENT;

  private animationSequence: string;
  private animationFrame: number = 0;
  private readonly spriteMap: ISpriteMap<string>;

  constructor(params: ISpriteComponentConstructor) {
    super();

    this.spriteMap = params.spriteMap;
    this.animationSequence = params.animationSequence;
  }

  public resetAnimationFrame() {
    this.animationFrame = 0;
  }

  public updateAnimationFrame() {
    const nextAnimationFrame = this.animationFrame + 1;
    const spriteFrames = this.spriteMap[this.animationSequence];

    if (!Array.isArray(spriteFrames) || !spriteFrames.length) this.animationFrame = 0;
    else if (nextAnimationFrame < spriteFrames.length) this.animationFrame += 1;
    else this.animationFrame = 0;
  }

  public updateAnimationSequence(animationSequence: string) {
    this.animationSequence = animationSequence;
  }

  public get sprite(): ISprite {
    const spriteFrames = this.spriteMap[this.animationSequence];

    if (!Array.isArray(spriteFrames)) return spriteFrames;

    const currentSprite = spriteFrames[this.animationFrame];

    return currentSprite;
  }

  public serialize(): ISerializedComponent {
    return {
      type: this.type,
      sprite: this.sprite,
    };
  }
}
