import { Component } from '@game-engine/core/component';
import type { ISprite, ISpriteMap } from '@shared/interfaces/graphics.interface';

export interface IRenderComponentConstructor {
  spriteMap: ISpriteMap<string>;
}

export class RenderComponent extends Component {
  public static readonly type = 'RENDER_COMPONENT';

  private animationFrame: number = 0;
  private readonly spriteMap: ISpriteMap<string>;

  constructor(params: IRenderComponentConstructor) {
    super();

    this.spriteMap = params.spriteMap;
  }

  public resetAnimationFrame() {
    this.animationFrame = 0;
  }

  public getCurrentSprite(state: string): ISprite {
    const spriteFrames = this.spriteMap[state];

    if (!Array.isArray(spriteFrames)) return spriteFrames;

    const currentSprite = spriteFrames[this.animationFrame];

    return currentSprite;
  }
}
