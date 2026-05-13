import type { ISize } from '@shared/interfaces/geometry.interface';
import type { ICoordinate } from '@shared/interfaces/coordinate.interface';
import type { ISprite, IPrimitiveDrawStyle, ITypographyOptions } from '@shared/interfaces/graphics.interface';
import type { IAssetsDriver, IGraphicsDriver } from '@game-client/interfaces/driver.interface';

export interface IGraphicsDriverConstructor {
  assetsDriver: IAssetsDriver;
  context: CanvasRenderingContext2D;
}

export class GraphicsDriver implements IGraphicsDriver {
  private readonly assetsDriver: IAssetsDriver;
  private readonly context: CanvasRenderingContext2D;
  private logicalResolution: ISize = { width: 0, height: 0 };

  constructor(params: IGraphicsDriverConstructor) {
    this.context = params.context;
    this.assetsDriver = params.assetsDriver;
  }

  public drawSprite(sprite: ISprite, position: ICoordinate) {
    const asset = this.assetsDriver.getAsset(sprite.spriteSheetId);

    this.context.drawImage(
      asset as HTMLImageElement,
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
    this.context.clearRect(position.x, position.y, this.logicalResolution.width, this.logicalResolution.height);
  }

  public drawRectangle(position: ICoordinate, size: ISize, style: IPrimitiveDrawStyle = {}) {
    this.applyPrimitiveStyle(style);

    if (style.fillColor) {
      this.context.fillRect(position.x, position.y, size.width, size.height);
    }

    if (style.strokeColor) {
      this.context.strokeRect(position.x, position.y, size.width, size.height);
    }
  }

  public drawCircle(center: ICoordinate, radius: number, style: IPrimitiveDrawStyle = {}) {
    this.applyPrimitiveStyle(style);
    this.context.beginPath();
    this.context.arc(center.x, center.y, radius, 0, Math.PI * 2);

    if (style.fillColor) {
      this.context.fill();
    }

    if (style.strokeColor) {
      this.context.stroke();
    }
  }

  public setResolution(resolution: ISize) {
    const pixelRatio = globalThis.devicePixelRatio || 1;
    const canvas = this.context.canvas;

    this.logicalResolution = { ...resolution };
    canvas.width = Math.floor(resolution.width * pixelRatio);
    canvas.height = Math.floor(resolution.height * pixelRatio);
    canvas.style.width = `${resolution.width}px`;
    canvas.style.height = `${resolution.height}px`;

    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.scale(pixelRatio, pixelRatio);
  }

  private applyPrimitiveStyle(style: IPrimitiveDrawStyle) {
    if (style.fillColor) this.context.fillStyle = style.fillColor;
    if (style.strokeColor) this.context.strokeStyle = style.strokeColor;
    if (style.lineWidth !== undefined) this.context.lineWidth = style.lineWidth;
  }
}
