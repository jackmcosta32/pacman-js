import { SPRITE_SIZE } from '@/config/game.config';
import type { TSpriteMap } from '@/models/animation.model';
import { ACTOR_DIRECTION, ACTOR_STATE } from '@/models/game-actor.models';

const RED_GHOST_SPRITE_COL = 0;
const PINK_GHOST_SPRITE_COL = 50;
const BLUE_GHOST_SPRITE_COL = 100;
const ORANGE_GHOST_SPRITE_COL = 150;
const GREEN_GHOST_SPRITE_COL = 200;
const PURPLE_GHOST_SPRITE_COL = 250;

const getGhostSpritesMap = (spriteColumn: number) => {
  return {
    [ACTOR_STATE.IDLE]: {
      [ACTOR_DIRECTION.RIGHT]: [
        {
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 4,
        },
        {
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 4,
        },
        {
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 54,
        },
        {
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 54,
        },
      ],
      [ACTOR_DIRECTION.DOWN]: [
        {
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 104,
        },
        {
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 104,
        },
        {
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 154,
        },
        {
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 154,
        },
      ],
      [ACTOR_DIRECTION.LEFT]: [
        {
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 204,
        },
        {
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 204,
        },
        {
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 254,
        },
        {
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 254,
        },
      ],
      [ACTOR_DIRECTION.UP]: [
        {
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 304,
        },
        {
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 304,
        },
        {
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 354,
        },
        {
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 354,
        },
      ],
    },
    [ACTOR_STATE.WALKING]: {
      [ACTOR_DIRECTION.RIGHT]: [
        {
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 4,
        },
        {
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 4,
        },
        {
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 54,
        },
        {
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 54,
        },
      ],
      [ACTOR_DIRECTION.DOWN]: [
        {
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 104,
        },
        {
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 104,
        },
        {
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 154,
        },
        {
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 154,
        },
      ],
      [ACTOR_DIRECTION.LEFT]: [
        {
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 204,
        },
        {
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 204,
        },
        {
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 254,
        },
        {
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 254,
        },
      ],
      [ACTOR_DIRECTION.UP]: [
        {
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 304,
        },
        {
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 304,
        },
        {
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 354,
        },
        {
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          x: spriteColumn,
          y: 354,
        },
      ],
    },
  } as TSpriteMap;
};

export const RED_GHOST_SPRITE_MAP = getGhostSpritesMap(RED_GHOST_SPRITE_COL);

export const PINK_GHOST_SPRITE_MAP = getGhostSpritesMap(PINK_GHOST_SPRITE_COL);

export const BLUE_GHOST_SPRITE_MAP = getGhostSpritesMap(BLUE_GHOST_SPRITE_COL);

export const ORANGE_GHOST_SPRITE_MAP = getGhostSpritesMap(ORANGE_GHOST_SPRITE_COL);

export const GREEN_GHOST_SPRITE_MAP = getGhostSpritesMap(GREEN_GHOST_SPRITE_COL);

export const PURPLE_GHOST_SPRITE_MAP = getGhostSpritesMap(PURPLE_GHOST_SPRITE_COL);
