import type { IAsset } from '@shared/interfaces/asset.interface';
import type { IEvent } from '@shared/interfaces/event.interface';
import type { ISprite } from '@shared/interfaces/graphics.interface';
import type { ICoordinate } from '@shared/interfaces/coordinate.interface';

export interface IAssetsDriver {
  loadSpriteSheet(spriteSheet: IAsset): Promise<void>;
}

export interface IInputDriver {
  init(): void;
  clearInputStream(): void;
  readInputStream(): IEvent[];
}

export interface IGraphicsDriver {
  clear(position: ICoordinate): void;
  drawSprite(sprite: ISprite, position: ICoordinate): void;
}
