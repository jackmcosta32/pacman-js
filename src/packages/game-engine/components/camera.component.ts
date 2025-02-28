import { Component } from '@game-engine/core/component';
import { COMPONENT_TYPE } from '@game-engine/constants/component.constant';
import type { ISerializedComponent } from '@game-engine/interfaces/entity.interface';
import type { IBoundingBox, ICoordinate } from '@shared/interfaces/coordinate.interface';

export interface ICameraComponentConstructor {
  viewport: IBoundingBox;
}

export class CameraComponent extends Component {
  public static readonly type = COMPONENT_TYPE.CAMERA_COMPONENT;

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

  public serialize(): ISerializedComponent {
    return {
      type: this.type,
      viewport: this.viewport,
    };
  }
}
