import type { IEntity, IEntityManager } from '@game-engine/interfaces/entity.interface';

export class EntityManger implements IEntityManager {
  protected readonly entities = new Map<string, IEntity>();

  public hasEntity(id: string) {
    return this.entities.has(id);
  }

  public addEntity(entity: IEntity) {
    if (this.entities.has(entity.id)) return false;

    this.entities.set(entity.id, entity);

    return true;
  }

  public removeEntity(id: string) {
    if (!this.entities.has(id)) return false;

    this.entities.delete(id);

    return true;
  }

  public getEntities() {
    return this.entities.values();
  }

  public clear() {
    this.entities.clear();
  }
}
