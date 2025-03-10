import type { Values } from '@shared/types/util.type';
import { PACMAN_EVENT } from '@pacman/constants/pacman-event.constant';
import type { IPacmanActorDirection, IPacmanActorMovementState } from './pacman-actor.interface';

export type IPacmanEventType = Values<typeof PACMAN_EVENT>;

export interface IPacmanMoveEvent {
  type: typeof PACMAN_EVENT.MOVE;
  direction: IPacmanActorDirection;
  movementState: IPacmanActorMovementState;
}

export type IPacmanEvent = IPacmanMoveEvent;
