import type { Values } from '@shared/types/util.type';
import type { IEvent } from '@shared/interfaces/event.interface';
import { PACMAN_EVENT_TYPE } from '@pacman/constants/pacman-event.constant';
import type { IPacmanActorDirection, IPacmanActorMovementState } from './pacman-actor.interface';
import type { IPacmanMenuNavigationDirection } from './pacman-menu.interface';

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

export interface IPacmanPauseToggleEvent extends IEvent {
  type: typeof PACMAN_EVENT_TYPE.PAUSE_TOGGLE;
}

export interface IPacmanRestartRequestEvent extends IEvent {
  type: typeof PACMAN_EVENT_TYPE.RESTART_REQUEST;
}

export interface IPacmanStartMatchRequestEvent extends IEvent {
  type: typeof PACMAN_EVENT_TYPE.START_MATCH_REQUEST;
}

export interface IPacmanReturnToMenuRequestEvent extends IEvent {
  type: typeof PACMAN_EVENT_TYPE.RETURN_TO_MENU_REQUEST;
}

export interface IPacmanMenuNavigateEvent extends IEvent {
  type: typeof PACMAN_EVENT_TYPE.MENU_NAVIGATE;
  direction: IPacmanMenuNavigationDirection;
}

export interface IPacmanMenuSelectEvent extends IEvent {
  type: typeof PACMAN_EVENT_TYPE.MENU_SELECT;
}

export type IPacmanEvent =
  | IPacmanMovementEvent
  | IPacmanMovementRequestEvent
  | IPacmanPauseToggleEvent
  | IPacmanStartMatchRequestEvent
  | IPacmanRestartRequestEvent
  | IPacmanReturnToMenuRequestEvent
  | IPacmanMenuNavigateEvent
  | IPacmanMenuSelectEvent;
