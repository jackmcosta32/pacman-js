import type { ICoordinate } from './coordinate.interface';

export interface ISprite extends ICoordinate {
  width: number;
  height: number;
  spriteSheetId: string;
}

export type ISpriteMap<States extends string> = Record<States, ISprite | ISprite[]>;
