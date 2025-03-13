import { RingBuffer } from '@shared/data-structures/ring-buffer';
import type { IInputEvent } from '@shared/interfaces/event.interface';
import { KEYBOARD_EVENT_TYPE } from '@shared/constants/event.constant';
import type { IRingBuffer } from '@shared/interfaces/ring-buffer.interface';
import type { IInputDriver } from '@game-client/interfaces/driver.interface';

const INPUT_THROTTLE = 500;
const EVENT_BUFFER_MAX_LENGTH = 50;

// TODO: Move the eventBuffer to outside of the input driver

export interface IInputDriverConstructor {
  keyThrottle?: number;
}

export class InputDriver implements IInputDriver {
  protected pointer: number = 0;
  protected keyThrottle: number;
  protected eventBuffer: IRingBuffer<IInputEvent>;

  constructor(params?: IInputDriverConstructor) {
    this.keyThrottle = params?.keyThrottle ?? INPUT_THROTTLE;
    this.eventBuffer = new RingBuffer({ maxLength: EVENT_BUFFER_MAX_LENGTH });
  }

  public init() {
    const controller = new AbortController();

    addEventListener('keyup', (event) => this.handleOnKeyUp(event), { signal: controller.signal });
    addEventListener('keydown', (event) => this.handleOnKeyDown(event), { signal: controller.signal });
  }

  public readInputStream(): IInputEvent | undefined {
    return this.eventBuffer.pop();
  }

  public clearInputStream(): void {
    this.eventBuffer.clear();
  }

  private handleOnKeyDown(event: KeyboardEvent) {
    const keyCode = event.code;
    const repeat = event.repeat;
    const type = repeat ? KEYBOARD_EVENT_TYPE.KEY_PRESSED : KEYBOARD_EVENT_TYPE.KEY_DOWN;

    this.eventBuffer.push({
      type,
      keyCode,
    });
  }

  private handleOnKeyUp(event: KeyboardEvent) {
    const keyCode = event.code;
    const type = KEYBOARD_EVENT_TYPE.KEY_UP;

    this.eventBuffer.push({
      type,
      keyCode,
    });
  }
}
