import type { Callback } from '@shared/types/util.type';
import type { IObserver } from '@shared/interfaces/observer.interface';

export class Observer<Listener extends Callback = Callback> implements IObserver<Listener> {
  private subscriptions = new Set<Listener>();

  public subscribe(listener: Listener) {
    if (this.subscriptions.has(listener)) return false;

    this.subscriptions.add(listener);

    return true;
  }

  public unsubscribe(listener: Listener) {
    if (!this.subscriptions.has(listener)) return false;

    this.subscriptions.delete(listener);

    return true;
  }

  protected notify(...data: Parameters<Listener>) {
    this.subscriptions.forEach((listener) => listener(...data));
  }
}
