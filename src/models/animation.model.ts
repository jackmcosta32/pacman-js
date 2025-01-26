import { ACTOR_DIRECTION, ACTOR_STATE } from "./game-actor.models";

export interface TSprite {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type TSpriteMap = Record<
  ACTOR_STATE,
  TSprite | Record<ACTOR_DIRECTION, TSprite[]>
>;
