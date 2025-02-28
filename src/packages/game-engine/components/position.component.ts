import { Component } from '@game-engine/core/component';
import type { ISize } from '@shared/interfaces/geometry.interface';
import { COMPONENT_TYPE } from '@game-engine/constants/component.constant';
import type { ISerializedComponent } from '@game-engine/interfaces/entity.interface';
import type { IBoundingBox, ICoordinate } from '@shared/interfaces/coordinate.interface';

export interface IPositionComponentConstructor {
  size: ISize;
  position: ICoordinate;
}

export class PositionComponent extends Component {
  public static readonly type = COMPONENT_TYPE.POSITION_COMPONENT;

  public size: ISize;
  public position: ICoordinate;

  constructor(params: IPositionComponentConstructor) {
    super();

    this.size = params.size;
    this.position = params.position;
  }

  public get boundingBox(): IBoundingBox {
    return {
      x: this.position.x,
      y: this.position.y,
      width: this.size.width,
      height: this.size.height,
    };
  }

  public get centerPosition(): ICoordinate {
    return {
      x: this.position.x + Math.floor(this.size.width / 2),
      y: this.position.y + Math.floor(this.size.height / 2),
    };
  }

  public update(params: Partial<IPositionComponentConstructor>): void {
    if (params.size) {
      this.size = params.size;
    }

    if (params.position) {
      this.position = params.position;
    }
  }

  public serialize(): ISerializedComponent {
    return {
      type: this.type,
      position: this.position,
      boundingBox: this.boundingBox,
      centerPosition: this.centerPosition,
    };
  }
}
