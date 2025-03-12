import type { IEvent } from './event.interface';
import type { Callback } from '@shared/types/util.type';
import type { IObserver } from '@shared/interfaces/observer.interface';
import type { ISerializedScene } from '@game-engine/interfaces/scene.interface';

export interface IGameState {
  events: IEvent[];
}

export interface IGame extends IObserver<Callback<ISerializedScene>> {
  init(): void;
  start(): void;
  update(): void;
  destroy(): void;
  readClientEvent(event?: IEvent): void;
}
