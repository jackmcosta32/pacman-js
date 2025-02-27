import type { Callback } from '@shared/types/util.type';

export abstract class Observer {
  protected abstract subscriptions: Map<string, Set<Callback>>;

  public subscribe(event: string, listener: Callback) {
    const listeners = this.subscriptions.get(event) ?? new Set();

    listeners.add(listener);
  }

  public unsubscribe(event: string, listener: Callback) {
    const listeners = this.subscriptions.get(event);

    listeners?.delete(listener);
  }

  protected notify(event: string, data: Parameters<Callback>) {
    const listeners = this.subscriptions.get(event);

    listeners?.forEach((listener) => listener(data));
  }
}
