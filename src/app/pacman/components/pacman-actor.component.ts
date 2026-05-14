import type {
  IPacmanActorSpriteMap,
  IPacmanActorDirection,
  IPacmanActorMovementState,
} from '@pacman/interfaces/pacman-actor.interface';

import { Component } from '@game-engine/core/component';
import { PACMAN_COMPONENT_TYPE } from '@pacman/constants/pacman-component.constant';
import type { ISerializedComponent } from '@game-engine/interfaces/component.interface';
import { PACMAN_ACTOR_DIRECTION, PACMAN_ACTOR_MOVEMENT_STATE } from '@pacman/constants/pacman-actor.constant';

export interface IPacmanActorComponentConstructor {
  speed: number;
  direction?: IPacmanActorDirection;
  currentDirection?: IPacmanActorDirection;
  requestedDirection?: IPacmanActorDirection;
  actorSpriteMap: IPacmanActorSpriteMap;
  movementState?: IPacmanActorMovementState;
}

export interface ISerializedPacmanActorComponent extends ISerializedComponent {
  speed: number;
  movementState: string;
  direction: IPacmanActorDirection;
  currentDirection: IPacmanActorDirection;
  requestedDirection: IPacmanActorDirection;
}

export class PacmanActorComponent extends Component {
  public static readonly type = PACMAN_COMPONENT_TYPE.ACTOR_COMPONENT;

  public speed: number;
  public currentDirection: IPacmanActorDirection;
  public requestedDirection: IPacmanActorDirection;
  public movementState: IPacmanActorMovementState;
  private readonly actorSpriteMap: IPacmanActorSpriteMap;

  constructor(params: IPacmanActorComponentConstructor) {
    super();

    this.speed = params.speed;
    this.actorSpriteMap = params.actorSpriteMap;
    this.currentDirection = params.currentDirection ?? params.direction ?? PACMAN_ACTOR_DIRECTION.DOWN;
    this.requestedDirection = params.requestedDirection ?? this.currentDirection;
    this.movementState = params.movementState ?? PACMAN_ACTOR_MOVEMENT_STATE.IDLE;
  }

  public get direction(): IPacmanActorDirection {
    return this.currentDirection;
  }

  public updateSpeed(speed: number) {
    this.speed = speed;
  }

  public updateDirection(direction: IPacmanActorDirection) {
    this.updateCurrentDirection(direction);
  }

  public updateCurrentDirection(direction: IPacmanActorDirection) {
    this.currentDirection = direction;
  }

  public updateRequestedDirection(direction: IPacmanActorDirection) {
    this.requestedDirection = direction;
  }

  public updateMovementState(movementState: IPacmanActorMovementState) {
    this.movementState = movementState;
  }

  public get spriteFrames() {
    const stateSpriteFrames = this.actorSpriteMap[this.movementState];

    if (!stateSpriteFrames) return;

    return stateSpriteFrames[this.currentDirection];
  }

  public serialize(): ISerializedPacmanActorComponent {
    return {
      type: this.type,
      speed: this.speed,
      direction: this.currentDirection,
      currentDirection: this.currentDirection,
      requestedDirection: this.requestedDirection,
      movementState: this.movementState,
    };
  }
}
