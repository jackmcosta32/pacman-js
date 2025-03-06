import type { ICoordinate } from '@shared/interfaces/coordinate.interface';
import type { IGraphicsDriver } from '@game-client/interfaces/driver.interface';
import type { ISprite, ITypographyOptions } from '@shared/interfaces/graphics.interface';

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

  public drawText(text: string, position: ICoordinate, options: Partial<ITypographyOptions> = {}) {
    const fontSize = options.fontSize ?? 12;
    const fontColor = options.color ?? 'white';
    const fontFamily = options.fontFamily ?? 'serif';

    if (options.textAlign) this.context.textAlign = options.textAlign;
    if (options.textBaseline) this.context.textBaseline = options.textBaseline;
    if (options.textRendering) this.context.textRendering = options.textRendering;

    this.context.fillStyle = fontColor;
    this.context.strokeStyle = fontColor;
    this.context.font = `${fontSize}px ${fontFamily}`;

    this.context.fillText(text, position.x, position.y);
  }

  public clear(position: ICoordinate) {
    const canvas = this.context.canvas;

    this.context.clearRect(position.x, position.y, canvas.width, canvas.height);
  }
}
