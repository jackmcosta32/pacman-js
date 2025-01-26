import { SPRITE_SIZE } from "../config/game.config";
import type { TSpriteMap } from "../models/animation.model";
import { ACTOR_DIRECTION, ACTOR_STATE } from "../models/game-actor.models";

const SPRITE_COL = 846;

export const PACMAN_SPRITE_MAP = {
  [ACTOR_STATE.IDLE]: {
    [ACTOR_DIRECTION.RIGHT]: [
      {
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 4,
      },
    ],
    [ACTOR_DIRECTION.DOWN]: [
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
        y: 304,
      },
    ],
    [ACTOR_DIRECTION.UP]: [
      {
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 454,
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
        y: 54,
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
        y: 54,
      },
    ],
    [ACTOR_DIRECTION.DOWN]: [
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
        y: 204,
      },
    ],
    [ACTOR_DIRECTION.LEFT]: [
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
        y: 404,
      },
      {
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 354,
      },
    ],
    [ACTOR_DIRECTION.UP]: [
      {
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 454,
      },
      {
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 504,
      },
      {
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 554,
      },
      {
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
        x: SPRITE_COL,
        y: 504,
      },
    ],
  },
} as TSpriteMap;
