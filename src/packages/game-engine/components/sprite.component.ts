import { Component } from '@game-engine/core/component';
import { ISerializedComponent } from '@game-engine/interfaces/entity.interface';
import { COMPONENT_TYPE } from '@shared/constants/component.constant';
import type { ISprite, ISpriteMap } from '@shared/interfaces/graphics.interface';

export interface ISpriteComponentConstructor {
  spriteMap: ISpriteMap<string>;
}

export class SpriteComponent extends Component {
  public static readonly type = COMPONENT_TYPE.RENDER_COMPONENT;

  private animationFrame: number = 0;
  private readonly spriteMap: ISpriteMap<string>;

  constructor(params: ISpriteComponentConstructor) {
    super();

    this.spriteMap = params.spriteMap;
  }

  public resetAnimationFrame() {
    this.animationFrame = 0;
  }

  public getCurrentSprite(sequence: string): ISprite {
    const spriteFrames = this.spriteMap[sequence];

    if (!Array.isArray(spriteFrames)) return spriteFrames;

    const currentSprite = spriteFrames[this.animationFrame];

    return currentSprite;
  }

  public serialize(): ISerializedComponent {
    return {
      type: this.type,
      // I still need to implement a way to get those animations
    };
  }
}
