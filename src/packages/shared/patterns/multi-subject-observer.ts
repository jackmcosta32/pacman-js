import type { Callback } from '@shared/types/util.type';
import type { IMultiSubjectObserver } from '@shared/interfaces/observer.interface';

export abstract class MultiSubjectObserver implements IMultiSubjectObserver {
  protected abstract subscriptions: Map<string, Set<Callback>>;

  public subscribe(event: string, listener: Callback) {
    const listeners = this.subscriptions.get(event) ?? new Set();

    if (listeners.has(listener)) return false;

    listeners.add(listener);
    this.subscriptions.set(event, listeners);

    return true;
  }

  public unsubscribe(event: string, listener: Callback) {
    const listeners = this.subscriptions.get(event);

    if (!listeners?.has(listener)) return false;

    listeners?.delete(listener);

    return true;
  }

  protected notify(event: string, ...data: Parameters<Callback>) {
    const listeners = this.subscriptions.get(event);

    listeners?.forEach((listener) => listener(...data));
  }
}
