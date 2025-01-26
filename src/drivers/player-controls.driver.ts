import {
  PLAYER_MOVEMENT_KEYS,
  PLAYER_KEYS_DEBOUNCE,
} from "../config/player-controls.config";

import debounce from "lodash/debounce";
import { BaseDriver } from "./base.driver";
import { ACTOR_DIRECTION } from "../models/game-actor.models";

export interface TPlayerControlsDriverConstructor {
  keyDebounce?: number;
  onIdle?: VoidFunction;
  onMove?: (direction: ACTOR_DIRECTION) => void;
}

export class PlayerControlsDriver extends BaseDriver {
  protected onMove;
  protected onIdle;
  protected keyDebounce;

  constructor({
    onMove,
    onIdle,
    keyDebounce,
  }: TPlayerControlsDriverConstructor) {
    super();

    this.onMove = onMove;
    this.onIdle = onIdle;
    this.keyDebounce = keyDebounce;
  }

  public init() {
    const controller = new AbortController();

    addEventListener(
      "keyup",
      debounce((event) => this.handleOnKeyUp(event), this.keyDebounce),
      { signal: controller.signal }
    );

    addEventListener(
      "keydown",
      debounce((event) => this.handleOnKeyDown(event), this.keyDebounce),
      { signal: controller.signal }
    );
  }

  private handleOnKeyDown(event: KeyboardEvent) {
    if (typeof this.onMove !== "function") return;

    switch (event.code) {
      case PLAYER_MOVEMENT_KEYS.UP:
        this.onMove(ACTOR_DIRECTION.UP);
        break;
      case PLAYER_MOVEMENT_KEYS.DOWN:
        this.onMove(ACTOR_DIRECTION.DOWN);
        break;
      case PLAYER_MOVEMENT_KEYS.LEFT:
        this.onMove(ACTOR_DIRECTION.LEFT);
        break;
      case PLAYER_MOVEMENT_KEYS.RIGHT:
        this.onMove(ACTOR_DIRECTION.RIGHT);
        break;
    }
  }

  private handleOnKeyUp(event: KeyboardEvent) {
    if (typeof this.onIdle !== "function") return;

    this.onIdle();
  }
}
