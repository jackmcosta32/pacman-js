import type { IInputEvent } from '@shared/interfaces/event.interface';
import type { ISerializedEntity } from '@game-engine/interfaces/entity.interface';

export interface IGameState {
  timestamp: number;
  entities: ISerializedEntity[];
}

export interface IGame {
  init(): void;
  start(): void;
  destroy(): void;
  update(inputEvents: IInputEvent[]): IGameState;
}
