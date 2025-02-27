import { Callback } from '@shared/types/util.type';

export interface IObserver<Event extends string = string, Listener extends Callback = Callback> {
  subscribe(event: Event, listener: Listener): void;
  unsubscribe(event: Event, listener: Listener): void;
}
