import { afterEach, describe, expect, it, vi } from 'vitest';
import { InputDriver } from '@game-client/drivers/input.driver';
import { KEYBOARD_EVENT_TYPE } from '@shared/constants/event.constant';

type ListenerRecord = {
  type: string;
  listener: EventListener;
  signal?: AbortSignal;
};

const installInputListenersMock = () => {
  const listeners: ListenerRecord[] = [];

  vi.stubGlobal(
    'addEventListener',
    vi.fn((type: string, listener: EventListener, options?: AddEventListenerOptions) => {
      listeners.push({ type, listener, signal: options?.signal });
    }),
  );

  const dispatchKeyboardEvent = (type: string, event: Pick<KeyboardEvent, 'code' | 'repeat'>) => {
    listeners
      .filter((listenerRecord) => listenerRecord.type === type && !listenerRecord.signal?.aborted)
      .forEach((listenerRecord) => listenerRecord.listener(event as KeyboardEvent as Event));
  };

  return { dispatchKeyboardEvent, listeners };
};

describe('Game Client - InputDriver', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should drain buffered keyboard events in insertion order', () => {
    const { dispatchKeyboardEvent } = installInputListenersMock();
    const sut = new InputDriver();

    sut.init();
    dispatchKeyboardEvent('keydown', { code: 'ArrowUp', repeat: false });
    dispatchKeyboardEvent('keydown', { code: 'ArrowLeft', repeat: true });
    dispatchKeyboardEvent('keyup', { code: 'ArrowUp', repeat: false });

    expect(sut.drainInputStream()).toEqual([
      { type: KEYBOARD_EVENT_TYPE.KEY_DOWN, keyCode: 'ArrowUp' },
      { type: KEYBOARD_EVENT_TYPE.KEY_PRESSED, keyCode: 'ArrowLeft' },
      { type: KEYBOARD_EVENT_TYPE.KEY_UP, keyCode: 'ArrowUp' },
    ]);
    expect(sut.drainInputStream()).toEqual([]);
  });

  it('should abort listeners and clear buffered events when destroyed', () => {
    const { dispatchKeyboardEvent } = installInputListenersMock();
    const sut = new InputDriver();

    sut.init();
    dispatchKeyboardEvent('keydown', { code: 'ArrowUp', repeat: false });

    sut.destroy();
    dispatchKeyboardEvent('keyup', { code: 'ArrowUp', repeat: false });

    expect(sut.drainInputStream()).toEqual([]);
  });

  it('should reset listeners and stale input on repeated init calls', () => {
    const { dispatchKeyboardEvent, listeners } = installInputListenersMock();
    const sut = new InputDriver();

    sut.init();
    dispatchKeyboardEvent('keydown', { code: 'ArrowUp', repeat: false });
    sut.init();
    dispatchKeyboardEvent('keyup', { code: 'ArrowUp', repeat: false });

    expect(listeners.slice(0, 2).every((listenerRecord) => listenerRecord.signal?.aborted)).toBe(true);
    expect(sut.drainInputStream()).toEqual([{ type: KEYBOARD_EVENT_TYPE.KEY_UP, keyCode: 'ArrowUp' }]);
  });
});
