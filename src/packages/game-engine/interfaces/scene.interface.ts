import type { ISize } from '@shared/interfaces/geometry.interface';
import type { IBoundingBox } from '@shared/interfaces/coordinate.interface';
import type { IEntity, ISerializedEntity } from '@game-engine/interfaces/entity.interface';

export interface ISerializedScene {
  size: ISize;
  entities: ISerializedEntity[];
}

export interface IScene {
  update(): void;
  destroy(): void;
  removeEntity(id: string): void;
  addEntity(entity: IEntity): void;
  getSceneSlice(range: IBoundingBox): IEntity[];
  serialize(): ISerializedScene;
}
