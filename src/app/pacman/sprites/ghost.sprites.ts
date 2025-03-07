import { SPRITE_SIZE } from '@pacman/config/game.config';
import { ACTOR_SPRITES } from '@pacman/config/asset.config';
import type { IPacmanActorSpriteMap } from '@pacman/interfaces/pacman-actor.interface';
import { PACMAN_ACTOR_DIRECTION, PACMAN_ACTOR_MOVEMENT_STATE } from '@pacman/constants/pacman-actor.constant';

const RED_GHOST_SPRITE_COL = 0;
const PINK_GHOST_SPRITE_COL = 50;
const BLUE_GHOST_SPRITE_COL = 100;
const ORANGE_GHOST_SPRITE_COL = 150;
const GREEN_GHOST_SPRITE_COL = 200;
const PURPLE_GHOST_SPRITE_COL = 250;

const getGhostSpritesMap = (spriteColumn: number) => {
  return {
    [PACMAN_ACTOR_MOVEMENT_STATE.IDLE]: {
      [PACMAN_ACTOR_DIRECTION.RIGHT]: [
        {
          spriteSheetId: ACTOR_SPRITES.id,
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 4,
        },
        {
          spriteSheetId: ACTOR_SPRITES.id,
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 4,
        },
        {
          spriteSheetId: ACTOR_SPRITES.id,
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 54,
        },
        {
          spriteSheetId: ACTOR_SPRITES.id,
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 54,
        },
      ],
      [PACMAN_ACTOR_DIRECTION.DOWN]: [
        {
          spriteSheetId: ACTOR_SPRITES.id,
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 104,
        },
        {
          spriteSheetId: ACTOR_SPRITES.id,
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 104,
        },
        {
          spriteSheetId: ACTOR_SPRITES.id,
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 154,
        },
        {
          spriteSheetId: ACTOR_SPRITES.id,
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 154,
        },
      ],
      [PACMAN_ACTOR_DIRECTION.LEFT]: [
        {
          spriteSheetId: ACTOR_SPRITES.id,
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 204,
        },
        {
          spriteSheetId: ACTOR_SPRITES.id,
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 204,
        },
        {
          spriteSheetId: ACTOR_SPRITES.id,
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 254,
        },
        {
          spriteSheetId: ACTOR_SPRITES.id,
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 254,
        },
      ],
      [PACMAN_ACTOR_DIRECTION.UP]: [
        {
          spriteSheetId: ACTOR_SPRITES.id,
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 304,
        },
        {
          spriteSheetId: ACTOR_SPRITES.id,
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 304,
        },
        {
          spriteSheetId: ACTOR_SPRITES.id,
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 354,
        },
        {
          spriteSheetId: ACTOR_SPRITES.id,
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 354,
        },
      ],
    },

    [PACMAN_ACTOR_MOVEMENT_STATE.WALKING]: {
      [PACMAN_ACTOR_DIRECTION.RIGHT]: [
        {
          spriteSheetId: ACTOR_SPRITES.id,
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 4,
        },
        {
          spriteSheetId: ACTOR_SPRITES.id,
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 4,
        },
        {
          spriteSheetId: ACTOR_SPRITES.id,
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 54,
        },
        {
          spriteSheetId: ACTOR_SPRITES.id,
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 54,
        },
      ],
      [PACMAN_ACTOR_DIRECTION.DOWN]: [
        {
          spriteSheetId: ACTOR_SPRITES.id,
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 104,
        },
        {
          spriteSheetId: ACTOR_SPRITES.id,
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 104,
        },
        {
          spriteSheetId: ACTOR_SPRITES.id,
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 154,
        },
        {
          spriteSheetId: ACTOR_SPRITES.id,
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 154,
        },
      ],
      [PACMAN_ACTOR_DIRECTION.LEFT]: [
        {
          spriteSheetId: ACTOR_SPRITES.id,
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 204,
        },
        {
          spriteSheetId: ACTOR_SPRITES.id,
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 204,
        },
        {
          spriteSheetId: ACTOR_SPRITES.id,
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 254,
        },
        {
          spriteSheetId: ACTOR_SPRITES.id,
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 254,
        },
      ],
      [PACMAN_ACTOR_DIRECTION.UP]: [
        {
          spriteSheetId: ACTOR_SPRITES.id,
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 304,
        },
        {
          spriteSheetId: ACTOR_SPRITES.id,
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 304,
        },
        {
          spriteSheetId: ACTOR_SPRITES.id,
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 354,
        },
        {
          spriteSheetId: ACTOR_SPRITES.id,
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 354,
        },
      ],
    },
  } satisfies IPacmanActorSpriteMap;
};

export const RED_GHOST_SPRITE_MAP = getGhostSpritesMap(RED_GHOST_SPRITE_COL);

export const PINK_GHOST_SPRITE_MAP = getGhostSpritesMap(PINK_GHOST_SPRITE_COL);

export const BLUE_GHOST_SPRITE_MAP = getGhostSpritesMap(BLUE_GHOST_SPRITE_COL);

export const ORANGE_GHOST_SPRITE_MAP = getGhostSpritesMap(ORANGE_GHOST_SPRITE_COL);

export const GREEN_GHOST_SPRITE_MAP = getGhostSpritesMap(GREEN_GHOST_SPRITE_COL);

export const PURPLE_GHOST_SPRITE_MAP = getGhostSpritesMap(PURPLE_GHOST_SPRITE_COL);
