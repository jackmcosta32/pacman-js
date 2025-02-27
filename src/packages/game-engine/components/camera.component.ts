import { Component } from '@game-engine/core/component';
import type { IBoundingBox, ICoordinate } from '@shared/interfaces/coordinate.interface';

export interface ICameraComponentConstructor {
  viewport: IBoundingBox;
}

export class CameraComponent extends Component {
  public readonly viewport: IBoundingBox;

  constructor(params: ICameraComponentConstructor) {
    super();

    this.viewport = params.viewport;
  }

  public move(position: ICoordinate, damping?: number) {
    const targetX = position.x - Math.floor(this.viewport.width / 2);
    const targetY = position.y - Math.floor(this.viewport.height / 2);

    if (damping) {
      this.viewport.x += Math.floor((targetX - this.viewport.x) * damping);
      this.viewport.y += Math.floor((targetY - this.viewport.y) * damping);
    } else {
      this.viewport.x = targetX;
      this.viewport.y = targetY;
    }
  }
}
