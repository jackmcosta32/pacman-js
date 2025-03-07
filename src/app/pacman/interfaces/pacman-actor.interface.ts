import type { Values } from '@shared/types/util.type';
import type { ISpriteFrames } from '@shared/interfaces/graphics.interface';
import type { PACMAN_ACTOR_DIRECTION, PACMAN_ACTOR_MOVEMENT_STATE } from '@pacman/constants/pacman-actor.constant';

export type IPacmanActorDirection = Values<typeof PACMAN_ACTOR_DIRECTION>;

export type IPacmanActorMovementState = Values<typeof PACMAN_ACTOR_MOVEMENT_STATE>;

export type IPacmanActorSpriteMap = Partial<
  Record<IPacmanActorMovementState, Record<IPacmanActorDirection, ISpriteFrames>>
>;
