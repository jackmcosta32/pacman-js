import type { IEntity, IEntityManager, ISerializedEntity } from '@game-engine/interfaces/entity.interface';

interface IEntityManagerConstructor {
  entities?: IEntity[];
}

export class EntityManager implements IEntityManager {
  protected readonly entities = new Map<string, IEntity>();

  constructor(params?: IEntityManagerConstructor) {
    params?.entities?.forEach((entity) => this.addEntity(entity));
  }

  public hasEntity(id: string) {
    return this.entities.has(id);
  }

  public getEntity(id: string): IEntity | undefined {
    return this.entities.get(id);
  }

  public getEntities() {
    return Array.from(this.entities.values());
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

  public forEachEntity(callback: (entity: IEntity) => void) {
    return this.entities.forEach(callback);
  }

  public clear() {
    this.entities.clear();
  }

  public serialize(): ISerializedEntity[] {
    const serializedEntities = [];

    for (const entity of this.entities.values()) {
      serializedEntities.push(entity.serialize());
    }

    return serializedEntities;
  }
}
