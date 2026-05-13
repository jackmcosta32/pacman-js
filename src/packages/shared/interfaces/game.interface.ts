import type { Callback } from '@shared/types/util.type';
import type { IQueue } from '@shared/interfaces/queue.interface';
import type { IEvent } from '@shared/interfaces/event.interface';
import type { IObserver } from '@shared/interfaces/observer.interface';
import type { ISerializedScene } from '@game-engine/interfaces/scene.interface';

export interface IGameState {
  eventQueue: IQueue<IEvent>;
  eventMap: Record<string, IEvent[]>;
}

export interface IGame extends IObserver<Callback<ISerializedScene>> {
  start(): void;
  update(): void;
  destroy(): void;
  readClientEvent(event?: IEvent): void;
}
