import type { Constructor } from '@shared/types/util.type';

export interface IComponentConstructor<Component> extends Constructor<Component> {
  type: string;
}

export interface ISerializedComponent {
  type: string;
  [key: string]: unknown;
}

export interface IComponent {
  type: string;
  serialize(): ISerializedComponent;
}

export interface ISerializedEntity {
  id: string;
  components: Record<string, ISerializedComponent>;
}

export interface IEntity {
  id: string;
  serialize(): ISerializedEntity;
  addComponent(component: IComponent): boolean;
  removeComponent<Component extends IComponent>(component: IComponentConstructor<Component>): boolean;
  getComponent<Component extends IComponent>(constructor: IComponentConstructor<Component>): Component | undefined;
}
