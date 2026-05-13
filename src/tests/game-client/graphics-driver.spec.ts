import { afterEach, describe, expect, it, vi } from 'vitest';
import { GraphicsDriver } from '@game-client/drivers/graphics.driver';
import type { IAssetsDriver } from '@game-client/interfaces/driver.interface';

const makeContext = () => {
  const canvas = {
    width: 0,
    height: 0,
    style: {
      width: '',
      height: '',
    },
  } as HTMLCanvasElement;

  return {
    canvas,
    scale: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    beginPath: vi.fn(),
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    fillText: vi.fn(),
    drawImage: vi.fn(),
    arc: vi.fn(),
    clearRect: vi.fn(),
    setTransform: vi.fn(),
  } as unknown as CanvasRenderingContext2D;
};

describe('Game Client - GraphicsDriver', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should apply device pixel ratio while preserving logical canvas size', () => {
    vi.stubGlobal('devicePixelRatio', 2);

    const context = makeContext();
    const assetsDriver = { getAsset: vi.fn() } as unknown as IAssetsDriver;
    const sut = new GraphicsDriver({ context, assetsDriver });

    sut.setResolution({ width: 224, height: 288 });

    expect(context.canvas.width).toBe(448);
    expect(context.canvas.height).toBe(576);
    expect(context.canvas.style.width).toBe('224px');
    expect(context.canvas.style.height).toBe('288px');
    expect(context.setTransform).toHaveBeenCalledWith(1, 0, 0, 1, 0, 0);
    expect(context.scale).toHaveBeenCalledWith(2, 2);
  });

  it('should clear logical resolution after scaling', () => {
    vi.stubGlobal('devicePixelRatio', 3);

    const context = makeContext();
    const assetsDriver = { getAsset: vi.fn() } as unknown as IAssetsDriver;
    const sut = new GraphicsDriver({ context, assetsDriver });

    sut.setResolution({ width: 100, height: 50 });
    sut.clear({ x: 4, y: 8 });

    expect(context.clearRect).toHaveBeenCalledWith(4, 8, 100, 50);
  });

  it('should draw styled rectangles', () => {
    const context = makeContext();
    const assetsDriver = { getAsset: vi.fn() } as unknown as IAssetsDriver;
    const sut = new GraphicsDriver({ context, assetsDriver });

    sut.drawRectangle({ x: 10, y: 12 }, { width: 20, height: 24 }, { fillColor: 'blue', strokeColor: 'white', lineWidth: 2 });

    expect(context.fillStyle).toBe('blue');
    expect(context.strokeStyle).toBe('white');
    expect(context.lineWidth).toBe(2);
    expect(context.fillRect).toHaveBeenCalledWith(10, 12, 20, 24);
    expect(context.strokeRect).toHaveBeenCalledWith(10, 12, 20, 24);
  });

  it('should draw styled circles', () => {
    const context = makeContext();
    const assetsDriver = { getAsset: vi.fn() } as unknown as IAssetsDriver;
    const sut = new GraphicsDriver({ context, assetsDriver });

    sut.drawCircle({ x: 30, y: 32 }, 6, { fillColor: 'yellow' });

    expect(context.fillStyle).toBe('yellow');
    expect(context.beginPath).toHaveBeenCalled();
    expect(context.arc).toHaveBeenCalledWith(30, 32, 6, 0, Math.PI * 2);
    expect(context.fill).toHaveBeenCalled();
    expect(context.stroke).not.toHaveBeenCalled();
  });
});
