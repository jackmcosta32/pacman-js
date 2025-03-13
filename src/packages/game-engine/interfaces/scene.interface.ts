import type { IEvent } from '@shared/interfaces/event.interface';
import type { IQueue } from '@shared/interfaces/queue.interface';
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
  eventQueue: IQueue<IEvent>;
  entityManager: IEntityManager;
  eventMap: Record<string, IEvent[]>;
}

export interface IScene {
  id: string;
  destroy(): void;
  serialize(): ISerializedScene;
  update(gameState: IGameState): void;
}
