import type { Constructor } from '@shared/types/util.type';
import type { ISceneState } from '@game-engine/interfaces/scene.interface';
import type { IEntityManager } from '@game-engine/interfaces/entity.interface';

export interface ISystemConstructor<Component> extends Constructor<Component> {
  id: string;
  entityManager: IEntityManager;
}

export interface ISerializedSystem {
  id: string;
  [key: string]: unknown;
}

export interface ISystem {
  id: string;
  enabled: boolean;
  serialize(): ISerializedSystem;
  init?: (sceneState: ISceneState) => void;
  update?: (sceneState: ISceneState) => void;
  destroy?: (sceneState: ISceneState) => void;
}

export interface ISerializedSystem {
  id: string;
}

export interface ISystemManager {
  clear(): void;
  serialize(): ISerializedSystem[];
  addSystem(system: ISystem): boolean;
  forEachSystem(callback: (system: ISystem) => void): void;
  removeSystem<Component extends ISystem>(system: ISystemConstructor<Component>): boolean;
  getSystem<Component extends ISystem>(constructor: ISystemConstructor<Component>): Component | undefined;
}
