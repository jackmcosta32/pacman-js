import { Component } from '@game-engine/core/component';
import { PositionComponent } from './position.component';
import type { ISize } from '@shared/interfaces/geometry.interface';
import type { IEntity } from '@game-engine/interfaces/entity.interface';
import type { IBoundingBox } from '@shared/interfaces/coordinate.interface';

export interface ICollisionComponentConstructor {
  size: ISize;
  entity: IEntity;
}

export class CollisionComponent extends Component {
  public static readonly type = 'COLLISION_COMPONENT';

  private size: ISize;
  private readonly entity: IEntity;

  constructor(params: ICollisionComponentConstructor) {
    super();

    this.size = params.size;
    this.entity = params.entity;
  }

  public update(size: ISize): void {
    this.size = size;
  }

  public get boundingBox(): IBoundingBox {
    const positionComponent = this.entity.getComponent(PositionComponent)!;

    return {
      width: this.size.width,
      height: this.size.height,
      x: positionComponent.position.x,
      y: positionComponent.position.y,
    };
  }
}
