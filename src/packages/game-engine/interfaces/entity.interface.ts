import type { Constructor } from '@shared/types/util.type';

export interface IComponentConstructor<Component> extends Constructor<Component> {
  type: string;
}

export interface IComponent {
  type: string;
}

export interface IEntity {
  id: string;
  addComponent(component: IComponent): boolean;
  removeComponent<Component extends IComponent>(component: IComponentConstructor<Component>): boolean;
  getComponent<Component extends IComponent>(constructor: IComponentConstructor<Component>): Component | undefined;
}
