import type {
  ISystem,
  ISystemManager,
  ISerializedSystem,
  ISystemConstructor,
} from '@game-engine/interfaces/system.interface';

interface ISystemManagerConstructor {
  systems?: ISystem[];
}

export class SystemManager implements ISystemManager {
  protected readonly systems = new Map<string, ISystem>();

  constructor(params?: ISystemManagerConstructor) {
    params?.systems?.forEach((system) => this.addSystem(system));
  }

  public getSystem<System extends ISystem>(constructor: ISystemConstructor<System>): System {
    return this.systems.get(constructor.id) as System;
  }

  public addSystem(entity: ISystem) {
    if (this.systems.has(entity.id)) return false;

    this.systems.set(entity.id, entity);

    return true;
  }

  public removeSystem<System extends ISystem>(constructor: ISystemConstructor<System>) {
    if (!this.systems.has(constructor.id)) return false;

    this.systems.delete(constructor.id);

    return true;
  }

  public forEachSystem(callback: (entity: ISystem) => void) {
    return this.systems.forEach(callback);
  }

  public clear() {
    this.systems.clear();
  }

  public serialize(): ISerializedSystem[] {
    const serializedSystems = [];

    for (const entity of this.systems.values()) {
      serializedSystems.push(entity.serialize());
    }

    return serializedSystems;
  }
}
