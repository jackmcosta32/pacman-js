import type { IEvent } from '@shared/interfaces/event.interface';
import type { ISize } from '@shared/interfaces/geometry.interface';
import type { IGameState } from '@shared/interfaces/game.interface';
import type { IEntityManager, ISerializedEntity } from '@game-engine/interfaces/entity.interface';

export interface ISerializedScene {
  id: string;
  size: ISize;
  viewport: ISize;
  entities: ISerializedEntity[];
}

export interface ISceneState {
  elapsed: number;
  events: IEvent[];
  entityManager: IEntityManager;
}

export interface IScene {
  id: string;
  destroy(): void;
  serialize(): ISerializedScene;
  update(gameState: IGameState): void;
}
