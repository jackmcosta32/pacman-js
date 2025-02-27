import { IBoundingBox } from '@shared/interfaces/coordinate.interface';
import type { IEntity } from './entity.interface';

export interface IScene {
  update(): void;
  destroy(): void;
  removeEntity(id: string): void;
  addEntity(entity: IEntity): void;
  getSceneSlice(range: IBoundingBox): IEntity[];
}
