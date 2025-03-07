import { QuadTree } from '@shared/data-structures/quad-tree';
import type { ISize } from '@shared/interfaces/geometry.interface';
import type { IEntity } from '@game-engine/interfaces/entity.interface';
import type { IBoundingBox } from '@shared/interfaces/coordinate.interface';
import { PositionComponent } from '@game-engine/components/position.component';
import type { IScene, ISerializedScene } from '@game-engine/interfaces/scene.interface';

export interface ISceneConstructor {
  id: string;
  size: ISize;
  entities?: IEntity[];
}

export class Scene implements IScene {
  public readonly id: string;
  protected readonly size: ISize;
  protected readonly quadTree: QuadTree;
  protected readonly entities = new Map<string, IEntity>();

  constructor(params: ISceneConstructor) {
    this.id = params.id;
    this.size = params.size;

    this.quadTree = new QuadTree({
      branchCapacity: 50,
      boundingBox: {
        x: 0,
        y: 0,
        width: params.size.width,
        height: params.size.height,
      },
    });

    params.entities?.forEach((entity) => this.addEntity(entity));
  }

  public addEntity(entity: IEntity) {
    if (this.entities.has(entity.id)) return false;

    const positionComponent = entity.getComponent(PositionComponent);

    if (!positionComponent) return false;

    this.entities.set(entity.id, entity);
    this.quadTree.insertNode(entity.id, positionComponent.boundingBox);

    return true;
  }

  public removeEntity(id: string) {
    this.entities.delete(id);
    this.quadTree.deleteNode(id);
  }

  public destroy() {
    this.entities.clear();
  }

  public update() {
    // TODO: Consider moving the quad tree collision logic to an external system or to the entity manager
    this.entities.forEach((entity) => {
      const positionComponent = entity.getComponent(PositionComponent);

      if (!positionComponent) return;

      this.quadTree.updateNode(entity.id, positionComponent.boundingBox);
    });
  }

  public getSceneSlice(viewport: IBoundingBox) {
    const sceneEntitiesIds = this.quadTree.query(viewport);

    return sceneEntitiesIds.map((id) => this.entities.get(id)!);
  }

  public serialize(): ISerializedScene {
    const serializedEntities = [];

    for (const entity of this.entities.values()) {
      serializedEntities.push(entity.serialize());
    }

    return {
      id: this.id,
      size: this.size,
      entities: serializedEntities,
    };
  }
}
