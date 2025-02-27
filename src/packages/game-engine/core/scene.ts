import { QuadTree } from '@shared/data-structures/quad-tree';
import type { ISize } from '@shared/interfaces/geometry.interface';
import type { IScene } from '@game-engine/interfaces/scene.interface';
import type { IEntity } from '@game-engine/interfaces/entity.interface';
import type { IBoundingBox } from '@shared/interfaces/coordinate.interface';
import { PositionComponent } from '@game-engine/components/position.component';

export interface ISceneConstructor {
  size: ISize;
  entities?: IEntity[];
}

export class Scene implements IScene {
  protected readonly quadTree;
  protected readonly entities = new Map<string, IEntity>();

  constructor(params: ISceneConstructor) {
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
    this.entities.forEach((entity) => {
      const positionComponent = entity.getComponent(PositionComponent);

      if (!positionComponent) return;

      this.quadTree.updateNode(entity.id, positionComponent.boundingBox);
    });
  }

  public getSceneSlice(range: IBoundingBox) {
    const sceneEntitiesIds = this.quadTree.query(range);

    return sceneEntitiesIds.map((id) => this.entities.get(id)!);
  }
}
