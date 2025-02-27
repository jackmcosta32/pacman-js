import type { IInputDriver } from '@game-client/interfaces/driver.interface';
import { type IEvent, type IInputEvent, KEYBOARD_EVENT_TYPES } from '@shared/interfaces/event.interface';

const INPUT_THROTTLE = 500;

export interface IInputDriverConstructor {
  keyThrottle?: number;
}

export class InputDriver implements IInputDriver {
  protected keyThrottle: number;
  protected eventBus = new Map<string, IInputEvent>();

  constructor(params?: IInputDriverConstructor) {
    this.keyThrottle = params?.keyThrottle ?? INPUT_THROTTLE;
  }

  public init() {
    const controller = new AbortController();

    addEventListener('keyup', (event) => this.handleOnKeyUp(event), { signal: controller.signal });

    addEventListener('keydown', (event) => this.handleOnKeyDown(event), { signal: controller.signal });
  }

  public readInputStream(): IEvent[] {
    const inputStream = this.eventBus.values();

    return Array.from(inputStream);
  }

  public clearInputStream(): void {
    this.eventBus.clear();
  }

  private handleOnKeyDown(event: KeyboardEvent) {
    const keyCode = event.code;
    const repeat = event.repeat;
    const type = repeat ? KEYBOARD_EVENT_TYPES.KEY_PRESSED : KEYBOARD_EVENT_TYPES.KEY_DOWN;

    this.eventBus.set(`${type}-${keyCode}`, {
      type,
      keyCode,
    });
  }

  private handleOnKeyUp(event: KeyboardEvent) {
    const keyCode = event.code;
    const type = KEYBOARD_EVENT_TYPES.KEY_UP;

    this.eventBus.set(`${type}-${keyCode}`, {
      type,
      keyCode,
    });
  }
}
