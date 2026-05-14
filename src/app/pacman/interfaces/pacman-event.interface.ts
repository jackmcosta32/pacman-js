import type { Values } from '@shared/types/util.type';
import type { IEvent } from '@shared/interfaces/event.interface';
import { PACMAN_EVENT_TYPE } from '@pacman/constants/pacman-event.constant';
import type { IPacmanActorDirection, IPacmanActorMovementState } from './pacman-actor.interface';

export type IPacmanEventType = Values<typeof PACMAN_EVENT_TYPE>;

export interface IPacmanMovementEvent extends IEvent {
  type: typeof PACMAN_EVENT_TYPE.MOVEMENT;
  direction: IPacmanActorDirection;
  movementState: IPacmanActorMovementState;
}

export interface IPacmanMovementRequestEvent extends IEvent {
  type: typeof PACMAN_EVENT_TYPE.MOVEMENT_REQUEST;
  direction: IPacmanActorDirection;
}

export type IPacmanEvent = IPacmanMovementEvent | IPacmanMovementRequestEvent;
