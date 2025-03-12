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
