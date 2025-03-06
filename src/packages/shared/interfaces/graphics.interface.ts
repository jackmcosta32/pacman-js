import type { ICoordinate } from './coordinate.interface';

export interface ITypographyOptions {
  color: string;
  fontSize: number;
  maxWidth: number;
  fontFamily: string;
  textAlign: CanvasTextAlign;
  textBaseline: CanvasTextBaseline;
  textRendering: CanvasTextRendering;
}

export interface ISprite extends ICoordinate {
  width: number;
  height: number;
  spriteSheetId: string;
}

export type ISpriteMap<Sequence extends string> = Record<Sequence, ISprite | ISprite[]>;
