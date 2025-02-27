import type { Values } from '@shared/types/util.type';
import { SPRITE_SIZE } from '@pacman/config/game.config';
import { ACTOR_SPRITES } from '@pacman/config/asset.configs';
import { ACTOR_STATE } from '@pacman/constants/actor.constant';
import type { ISpriteMap } from '@shared/interfaces/graphics.interface';

const SPRITE_COL = 846;

export const PACMAN_SPRITE_MAP = {
  [ACTOR_STATE.IDLE_RIGHT]: [
    {
      spriteSheetId: ACTOR_SPRITES.id,
      width: SPRITE_SIZE,
      height: SPRITE_SIZE,
      x: SPRITE_COL,
      y: 4,
    },
  ],
  [ACTOR_STATE.IDLE_DOWN]: [
    {
      spriteSheetId: ACTOR_SPRITES.id,
      width: SPRITE_SIZE,
      height: SPRITE_SIZE,
      x: SPRITE_COL,
      y: 154,
    },
  ],
  [ACTOR_STATE.IDLE_LEFT]: [
    {
      spriteSheetId: ACTOR_SPRITES.id,
      width: SPRITE_SIZE,
      height: SPRITE_SIZE,
      x: SPRITE_COL,
      y: 304,
    },
  ],
  [ACTOR_STATE.IDLE_UP]: [
    {
      spriteSheetId: ACTOR_SPRITES.id,
      width: SPRITE_SIZE,
      height: SPRITE_SIZE,
      x: SPRITE_COL,
      y: 454,
    },
  ],
  [ACTOR_STATE.WALKING_RIGHT]: [
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
  [ACTOR_STATE.WALKING_DOWN]: [
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
  [ACTOR_STATE.WALKING_LEFT]: [
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
  [ACTOR_STATE.WALKING_UP]: [
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
} satisfies Partial<ISpriteMap<Values<typeof ACTOR_STATE>>>;
