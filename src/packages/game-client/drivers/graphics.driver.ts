import type { ISprite } from '@shared/interfaces/graphics.interface';
import type { ICoordinate } from '@shared/interfaces/coordinate.interface';
import type { IGraphicsDriver } from '@game-client/interfaces/driver.interface';

export interface IGraphicsDriverConstructor {
  context: CanvasRenderingContext2D;
}

export class GraphicsDriver implements IGraphicsDriver {
  private readonly context: CanvasRenderingContext2D;
  private readonly assets = new Map<string, HTMLImageElement>();

  constructor(params: IGraphicsDriverConstructor) {
    this.context = params.context;
  }

  // TODO: Handle pixel ratio
  public drawSprite(sprite: ISprite, position: ICoordinate) {
    const asset = this.assets.get(sprite.spriteSheetId);

    if (!asset) {
      throw new Error(`Could not find an asset with ID ${sprite.spriteSheetId}`);
    }

    this.context.drawImage(
      asset,
      sprite.x,
      sprite.y,
      sprite.width,
      sprite.height,
      position.x,
      position.y,
      sprite.width,
      sprite.height,
    );
  }

  public clear(position: ICoordinate) {
    const canvas = this.context.canvas;

    this.context.clearRect(position.x, position.y, canvas.width, canvas.height);
  }
}
