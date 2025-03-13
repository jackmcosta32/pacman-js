import type {
  IPacmanActorSpriteMap,
  IPacmanActorDirection,
  IPacmanActorMovementState,
} from '@pacman/interfaces/pacman-actor.interface';

import { Component } from '@game-engine/core/component';
import { PACMAN_COMPONENT_TYPE } from '@pacman/constants/pacman-component.constant';
import type { ISerializedComponent } from '@game-engine/interfaces/component.interface';
import { PACMAN_ACTOR_DIRECTION, PACMAN_ACTOR_MOVEMENT_STATE } from '@pacman/constants/pacman-actor.constant';

// TODO: Split this component into smaller components

export interface IPacmanActorComponentConstructor {
  speed: number;
  direction?: IPacmanActorDirection;
  actorSpriteMap: IPacmanActorSpriteMap;
  movementState?: IPacmanActorMovementState;
}

export interface ISerializedPacmanActorComponent extends ISerializedComponent {
  speed: number;
  movementState: string;
  direction: IPacmanActorDirection;
}

export class PacmanActorComponent extends Component {
  public static readonly type = PACMAN_COMPONENT_TYPE.ACTOR_COMPONENT;

  public speed: number;
  public direction: IPacmanActorDirection;
  public movementState: IPacmanActorMovementState;
  private readonly actorSpriteMap: IPacmanActorSpriteMap;

  constructor(params: IPacmanActorComponentConstructor) {
    super();

    this.speed = params.speed;
    this.actorSpriteMap = params.actorSpriteMap;
    this.direction = params.direction ?? PACMAN_ACTOR_DIRECTION.DOWN;
    this.movementState = params.movementState ?? PACMAN_ACTOR_MOVEMENT_STATE.IDLE;
  }

  public updateSpeed(speed: number) {
    this.speed = speed;
  }

  public updateDirection(direction: IPacmanActorDirection) {
    this.direction = direction;
  }

  public updateMovementState(movementState: IPacmanActorMovementState) {
    this.movementState = movementState;
  }

  public get spriteFrames() {
    const stateSpriteFrames = this.actorSpriteMap[this.movementState];

    if (!stateSpriteFrames) return;

    return stateSpriteFrames[this.direction];
  }

  public serialize(): ISerializedPacmanActorComponent {
    return {
      type: this.type,
      speed: this.speed,
      direction: this.direction,
      movementState: this.movementState,
    };
  }
}
