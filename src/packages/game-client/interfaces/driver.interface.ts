import type { IAsset } from '@shared/interfaces/asset.interface';
import type { ISize } from '@shared/interfaces/geometry.interface';
import type { IInputEvent } from '@shared/interfaces/event.interface';
import type { ICoordinate } from '@shared/interfaces/coordinate.interface';
import type { ISprite, ITypographyOptions } from '@shared/interfaces/graphics.interface';

export interface IAssetsDriver {
  getAsset(id: string): HTMLElement | FontFace;
  loadAudio(asset: IAsset): Promise<boolean>;
  loadSpriteSheet(asset: IAsset): Promise<boolean>;
  loadFontFace(family: string, asset: IAsset): Promise<boolean>;
}

export interface IInputDriver {
  init(): void;
  clearInputStream(): void;
  readInputStream(): IInputEvent | undefined;
}

export interface IGraphicsDriver {
  clear(position: ICoordinate): void;
  setResolution(resolution: ISize): void;
  drawSprite(sprite: ISprite, position: ICoordinate): void;
  drawText(text: string, position: ICoordinate, options?: Partial<ITypographyOptions>): void;
}
