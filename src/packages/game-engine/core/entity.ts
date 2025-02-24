import type { IEntity, IComponent } from '@game-engine/interfaces/entity.interface';

export interface IEntityConstructor {
  id: string;
}

export class Entity implements IEntity {
  protected _id: string;
  protected components = new Map<string, IComponent>();

  constructor(params: IEntityConstructor) {
    this._id = params.id;
  }

  public get id() {
    return this._id;
  }

  public update(timestamp: number) {
    for (const component of this.components.values()) {
      component.update(timestamp, this);
    }
  }

  public addComponent(component: IComponent) {
    this.components.set(component.name, component);
  }

  public getComponent(name: string) {
    return this.components.get(name);
  }

  public removeComponent(name: string) {
    this.components.delete(name);
  }
}
