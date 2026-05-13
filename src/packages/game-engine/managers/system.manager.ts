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

  public getSystem<System extends ISystem>(constructor: ISystemConstructor<System>): System | undefined {
    return this.systems.get(constructor.id) as System | undefined;
  }

  public addSystem(system: ISystem) {
    if (this.systems.has(system.id)) return false;

    this.systems.set(system.id, system);

    return true;
  }

  public removeSystem<System extends ISystem>(constructor: ISystemConstructor<System>) {
    if (!this.systems.has(constructor.id)) return false;

    this.systems.delete(constructor.id);

    return true;
  }

  public forEachSystem(callback: (system: ISystem) => void) {
    return this.systems.forEach((system) => callback(system));
  }

  public clear() {
    this.systems.clear();
  }

  public serialize(): ISerializedSystem[] {
    const serializedSystems = [];

    for (const system of this.systems.values()) {
      serializedSystems.push(system.serialize());
    }

    return serializedSystems;
  }
}
