import { SPRITE_SIZE } from "../config/game.config";
import type { TSpriteMap } from "../models/animation.model";
import { ACTOR_DIRECTION, ACTOR_STATE } from "../models/game-actor.models";

const SPRITE_COL = 648;

export const RED_GHOST_SPRITES_MAP = {
  [ACTOR_STATE.IDLE]: {
    [ACTOR_DIRECTION.RIGHT]: [
      {
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 4,
      },
      {
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 4,
      },
      {
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 54,
      },
      {
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 54,
      },
    ],
    [ACTOR_DIRECTION.DOWN]: [
      {
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 104,
      },
      {
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 104,
      },
      {
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 154,
      },
      {
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 154,
      },
    ],
    [ACTOR_DIRECTION.LEFT]: [
      {
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 204,
      },
      {
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 204,
      },
      {
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 254,
      },
      {
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 254,
      },
    ],
    [ACTOR_DIRECTION.UP]: [
      {
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 304,
      },
      {
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 304,
      },
      {
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 354,
      },
      {
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 354,
      },
    ],
  },
  [ACTOR_STATE.WALKING]: {
    [ACTOR_DIRECTION.RIGHT]: [
      {
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 4,
      },
      {
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 4,
      },
      {
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 54,
      },
      {
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 54,
      },
    ],
    [ACTOR_DIRECTION.DOWN]: [
      {
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 104,
      },
      {
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 104,
      },
      {
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 154,
      },
      {
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 154,
      },
    ],
    [ACTOR_DIRECTION.LEFT]: [
      {
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 204,
      },
      {
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 204,
      },
      {
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 254,
      },
      {
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 254,
      },
    ],
    [ACTOR_DIRECTION.UP]: [
      {
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 304,
      },
      {
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 304,
      },
      {
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 354,
      },
      {
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 354,
      },
    ],
  },
} as TSpriteMap;
