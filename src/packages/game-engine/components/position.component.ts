import { Component } from '@game-engine/core/component';
import type { ISize } from '@shared/interfaces/geometry.interface';
import { COMPONENT_TYPE } from '@shared/constants/component.constant';
import type { ISerializedComponent } from '@game-engine/interfaces/component.interface';
import type { IBoundingBox, ICoordinate } from '@shared/interfaces/coordinate.interface';

export interface IPositionComponentConstructor {
  size: ISize;
  position: ICoordinate;
}

export interface ISerializedPositionComponent extends ISerializedComponent {
  position: ICoordinate;
  boundingBox: IBoundingBox;
  centerPosition: ICoordinate;
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

  public updatePosition(position: ICoordinate): void {
    this.position.x = Math.floor(position.x);
    this.position.y = Math.floor(position.y);
  }

  public serialize(): ISerializedPositionComponent {
    return {
      type: this.type,
      position: { ...this.position },
      boundingBox: { ...this.boundingBox },
      centerPosition: { ...this.centerPosition },
    };
  }
}
