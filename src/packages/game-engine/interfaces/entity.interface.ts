import type { ISerializedComponent, IComponent, IComponentConstructor } from './component.interface';

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

export interface IEntityManager {
  clear(): void;
  getEntities(): Array<IEntity>;
  hasEntity(id: string): boolean;
  serialize(): ISerializedEntity[];
  removeEntity(id: string): boolean;
  addEntity(entity: IEntity): boolean;
  getEntity(id: string): IEntity | undefined;
  forEachEntity(callback: (entity: IEntity) => void): void;
}
