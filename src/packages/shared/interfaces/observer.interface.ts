import type { Callback } from '@shared/types/util.type';

export interface IObserver<Listener = Callback> {
  subscribe(listener: Listener): void;
  unsubscribe(listener: Listener): void;
}

export interface IMultiSubjectObserver<Event = string, Listener = Callback> {
  subscribe(event: Event, listener: Listener): void;
  unsubscribe(event: Event, listener: Listener): void;
}
