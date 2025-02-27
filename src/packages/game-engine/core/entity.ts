import type { IEntity, IComponent, IComponentConstructor } from '@game-engine/interfaces/entity.interface';

export interface IEntityConstructor {
  id: string;
  components?: IComponent[];
}

export class Entity implements IEntity {
  public readonly id: string;
  protected components = new Map<string, IComponent>();

  constructor(params: IEntityConstructor) {
    this.id = params.id;

    params.components?.forEach((component) => this.addComponent(component));
  }

  public addComponent(component: IComponent) {
    if (this.components.has(component.type)) return false;

    this.components.set(component.type, component);

    return true;
  }

  public getComponent<Component extends IComponent>(constructor: IComponentConstructor<Component>): Component {
    return this.components.get(constructor.type) as Component;
  }

  public removeComponent<Component extends IComponent>(constructor: IComponentConstructor<Component>) {
    if (!this.components.has(constructor.type)) return false;

    this.components.delete(constructor.type);

    return true;
  }
}
