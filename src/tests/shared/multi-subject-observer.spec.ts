import { describe, expect, it, vi } from 'vitest';
import { MultiSubjectObserver } from '@shared/patterns/multi-subject-observer';
import type { Callback } from '@shared/types/util.type';

class TestObserver extends MultiSubjectObserver {
  protected subscriptions = new Map<string, Set<Callback>>();

  public publish(event: string, ...data: Parameters<Callback>) {
    this.notify(event, ...data);
  }
}

describe('Shared - MultiSubjectObserver', () => {
  it('should subscribe and notify listeners by event', () => {
    const sut = new TestObserver();
    const listener = vi.fn();

    expect(sut.subscribe('ready', listener)).toBe(true);

    sut.publish('ready', 'payload', 1);
    sut.publish('other', 'ignored');

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith('payload', 1);
  });

  it('should ignore duplicate subscriptions and unsubscribe existing listeners', () => {
    const sut = new TestObserver();
    const listener = vi.fn();

    expect(sut.subscribe('ready', listener)).toBe(true);
    expect(sut.subscribe('ready', listener)).toBe(false);
    expect(sut.unsubscribe('ready', listener)).toBe(true);

    sut.publish('ready');

    expect(listener).not.toHaveBeenCalled();
    expect(sut.unsubscribe('ready', listener)).toBe(false);
  });
});
