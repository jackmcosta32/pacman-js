import type { Callback } from '@shared/types/util.type';
import type { IObserver } from '@shared/interfaces/observer.interface';

export abstract class Observer implements IObserver {
  protected abstract subscriptions: Set<Callback>;

  public subscribe(listener: Callback) {
    if (this.subscriptions.has(listener)) return false;

    this.subscriptions.add(listener);

    return true;
  }

  public unsubscribe(listener: Callback) {
    if (!this.subscriptions.has(listener)) return false;

    this.subscriptions.delete(listener);

    return true;
  }

  protected notify(data: Parameters<Callback>) {
    this.subscriptions.forEach((listener) => listener(data));
  }
}
