import { RingBuffer } from '@shared/data-structures/ring-buffer';
import type { IInputEvent } from '@shared/interfaces/event.interface';
import { KEYBOARD_EVENT_TYPE } from '@shared/constants/event.constant';
import type { IInputDriver } from '@game-client/interfaces/driver.interface';

const INPUT_THROTTLE = 500;

export interface IInputDriverConstructor {
  keyThrottle?: number;
}

export class InputDriver implements IInputDriver {
  protected pointer: number = 0;
  protected keyThrottle: number;
  protected eventBus: RingBuffer<IInputEvent>;

  constructor(params?: IInputDriverConstructor) {
    this.eventBus = new RingBuffer();
    this.keyThrottle = params?.keyThrottle ?? INPUT_THROTTLE;
  }

  public init() {
    const controller = new AbortController();

    addEventListener('keyup', (event) => this.handleOnKeyUp(event), { signal: controller.signal });
    addEventListener('keydown', (event) => this.handleOnKeyDown(event), { signal: controller.signal });
  }

  public readInputStream(): IInputEvent | undefined {
    return this.eventBus.pop();
  }

  public clearInputStream(): void {
    this.eventBus.clear();
  }

  private handleOnKeyDown(event: KeyboardEvent) {
    const keyCode = event.code;
    const repeat = event.repeat;
    const type = repeat ? KEYBOARD_EVENT_TYPE.KEY_PRESSED : KEYBOARD_EVENT_TYPE.KEY_DOWN;

    this.eventBus.push({
      type,
      keyCode,
    });
  }

  private handleOnKeyUp(event: KeyboardEvent) {
    const keyCode = event.code;
    const type = KEYBOARD_EVENT_TYPE.KEY_UP;

    this.eventBus.push({
      type,
      keyCode,
    });
  }
}
