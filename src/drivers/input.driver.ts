import throttle from 'lodash/throttle';
import { BaseDriver } from './base.driver';
import type { TCommand } from '@/models/command.model';
import type { TInputScheme } from '@/models/input.model';
import { ACTOR_DIRECTION } from '@/models/game-actor.models';
import { INPUT_DEFAULT_SCHEME, INPUT_THROTTLE } from '@/config/game.config';

export interface TInputDriverConstructor {
  keyThrottle?: number;
  onIdle?: VoidFunction;
  inputScheme?: TInputScheme;
  onMove?: (direction: ACTOR_DIRECTION) => void;
}

export class InputDriver extends BaseDriver {
  protected onMove;
  protected onIdle;
  protected inputScheme;
  protected keyThrottle;
  protected inputToActorDirectionMap;
  protected nextCommand?: TCommand;

  constructor({
    onMove,
    onIdle,
    keyThrottle = INPUT_THROTTLE,
    inputScheme = INPUT_DEFAULT_SCHEME,
  }: TInputDriverConstructor) {
    super();

    this.onMove = onMove;
    this.onIdle = onIdle;
    this.inputScheme = inputScheme;
    this.keyThrottle = keyThrottle;

    this.inputToActorDirectionMap = {
      [this.inputScheme.UP]: ACTOR_DIRECTION.UP,
      [this.inputScheme.DOWN]: ACTOR_DIRECTION.DOWN,
      [this.inputScheme.LEFT]: ACTOR_DIRECTION.LEFT,
      [this.inputScheme.RIGHT]: ACTOR_DIRECTION.RIGHT,
    };
  }

  public init() {
    const controller = new AbortController();

    addEventListener(
      'keyup',
      throttle((event) => this.handleOnKeyUp(event), this.keyThrottle),
      { signal: controller.signal },
    );

    addEventListener(
      'keydown',
      throttle((event) => this.handleOnKeyDown(event), this.keyThrottle),
      { signal: controller.signal },
    );
  }

  private handleOnKeyDown(event: KeyboardEvent) {
    const eventCode = event.code;

    if (typeof this.onMove !== 'function') return;

    const direction = this.inputToActorDirectionMap[eventCode];

    if (direction === undefined) return;

    const movementCommand: TCommand = {
      execute: () => this.onMove!(direction),
    };

    this.nextCommand = movementCommand;
  }

  private handleOnKeyUp(_: KeyboardEvent) {
    if (typeof this.onIdle !== 'function') return;

    this.onIdle();
  }

  public update() {
    if (!this.nextCommand?.execute) return;

    this.nextCommand.execute();

    this.nextCommand = undefined;
  }
}
