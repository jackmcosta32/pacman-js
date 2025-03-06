import type { Callback } from '@shared/types/util.type';
import type { IInputEvent } from '@shared/interfaces/event.interface';
import type { IObserver } from '@shared/interfaces/observer.interface';
import type { ISerializedScene } from '@game-engine/interfaces/scene.interface';

export interface IGame extends IObserver<Callback<ISerializedScene>> {
  init(): void;
  start(): void;
  update(): void;
  destroy(): void;
  readInputs(inputs: IInputEvent[]): void;
}
