import { SPRITE_SIZE } from '@pacman/config/pacman-game.config';
import { ACTOR_SPRITES } from '@pacman/config/pacman-asset.config';
import type { IPacmanActorSpriteMap } from '@pacman/interfaces/pacman-actor.interface';
import { PACMAN_ACTOR_DIRECTION, PACMAN_ACTOR_MOVEMENT_STATE } from '@pacman/constants/pacman-actor.constant';

const SPRITE_COL = 846;

export const PACMAN_SPRITE_MAP = {
  [PACMAN_ACTOR_MOVEMENT_STATE.IDLE]: {
    [PACMAN_ACTOR_DIRECTION.RIGHT]: [
      {
        spriteSheetId: ACTOR_SPRITES.id,
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 4,
      },
    ],
    [PACMAN_ACTOR_DIRECTION.DOWN]: [
      {
        spriteSheetId: ACTOR_SPRITES.id,
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 154,
      },
    ],
    [PACMAN_ACTOR_DIRECTION.LEFT]: [
      {
        spriteSheetId: ACTOR_SPRITES.id,
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 304,
      },
    ],
    [PACMAN_ACTOR_DIRECTION.UP]: [
      {
        spriteSheetId: ACTOR_SPRITES.id,
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 454,
      },
    ],
  },

  [PACMAN_ACTOR_MOVEMENT_STATE.WALKING]: {
    [PACMAN_ACTOR_DIRECTION.RIGHT]: [
      {
        spriteSheetId: ACTOR_SPRITES.id,
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 4,
      },
      {
        spriteSheetId: ACTOR_SPRITES.id,
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 54,
      },
      {
        spriteSheetId: ACTOR_SPRITES.id,
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 104,
      },
      {
        spriteSheetId: ACTOR_SPRITES.id,
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 54,
      },
    ],
    [PACMAN_ACTOR_DIRECTION.DOWN]: [
      {
        spriteSheetId: ACTOR_SPRITES.id,
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 154,
      },
      {
        spriteSheetId: ACTOR_SPRITES.id,
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 204,
      },
      {
        spriteSheetId: ACTOR_SPRITES.id,
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 254,
      },
      {
        spriteSheetId: ACTOR_SPRITES.id,
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 204,
      },
    ],
    [PACMAN_ACTOR_DIRECTION.LEFT]: [
      {
        spriteSheetId: ACTOR_SPRITES.id,
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 304,
      },
      {
        spriteSheetId: ACTOR_SPRITES.id,
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 354,
      },
      {
        spriteSheetId: ACTOR_SPRITES.id,
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 404,
      },
      {
        spriteSheetId: ACTOR_SPRITES.id,
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 354,
      },
    ],
    [PACMAN_ACTOR_DIRECTION.UP]: [
      {
        spriteSheetId: ACTOR_SPRITES.id,
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 454,
      },
      {
        spriteSheetId: ACTOR_SPRITES.id,
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 504,
      },
      {
        spriteSheetId: ACTOR_SPRITES.id,
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 554,
      },
      {
        spriteSheetId: ACTOR_SPRITES.id,
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 504,
      },
    ],
  },
} satisfies IPacmanActorSpriteMap;
