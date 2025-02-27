import type { Values } from '@shared/types/util.type';
import { SPRITE_SIZE } from '@pacman/config/game.config';
import { ACTOR_SPRITES } from '@pacman/config/asset.configs';
import { ACTOR_STATE } from '@pacman/constants/actor.constant';
import type { ISpriteMap } from '@shared/interfaces/graphics.interface';

const RED_GHOST_SPRITE_COL = 0;
const PINK_GHOST_SPRITE_COL = 50;
const BLUE_GHOST_SPRITE_COL = 100;
const ORANGE_GHOST_SPRITE_COL = 150;
const GREEN_GHOST_SPRITE_COL = 200;
const PURPLE_GHOST_SPRITE_COL = 250;

const getGhostSpritesMap = (spriteColumn: number) => {
  return {
    [ACTOR_STATE.IDLE_RIGHT]: [
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
    [ACTOR_STATE.IDLE_DOWN]: [
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
    [ACTOR_STATE.IDLE_LEFT]: [
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
    [ACTOR_STATE.IDLE_UP]: [
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
    [ACTOR_STATE.WALKING_RIGHT]: [
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
    [ACTOR_STATE.WALKING_DOWN]: [
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
    [ACTOR_STATE.WALKING_LEFT]: [
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
    [ACTOR_STATE.WALKING_UP]: [
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
  } satisfies Partial<ISpriteMap<Values<typeof ACTOR_STATE>>>;
};

export const RED_GHOST_SPRITE_MAP = getGhostSpritesMap(RED_GHOST_SPRITE_COL);

export const PINK_GHOST_SPRITE_MAP = getGhostSpritesMap(PINK_GHOST_SPRITE_COL);

export const BLUE_GHOST_SPRITE_MAP = getGhostSpritesMap(BLUE_GHOST_SPRITE_COL);

export const ORANGE_GHOST_SPRITE_MAP = getGhostSpritesMap(ORANGE_GHOST_SPRITE_COL);

export const GREEN_GHOST_SPRITE_MAP = getGhostSpritesMap(GREEN_GHOST_SPRITE_COL);

export const PURPLE_GHOST_SPRITE_MAP = getGhostSpritesMap(PURPLE_GHOST_SPRITE_COL);
