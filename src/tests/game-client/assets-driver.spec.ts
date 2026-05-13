import { afterEach, describe, expect, it, vi } from 'vitest';
import { AssetsDriver } from '@game-client/drivers/assets.driver';
import type { IAsset } from '@shared/interfaces/asset.interface';

class MockImage {
  public src = '';
  public onload?: () => void;
  public onerror?: () => void;
}

class MockAudio {
  public src = '';
  public onerror?: () => void;
  public oncanplaythrough?: () => void;
}

const asset = (id: string): IAsset => ({
  id,
  pathname: `/assets/${id}.png`,
});

const installImageMock = () => {
  const instances: MockImage[] = [];

  vi.stubGlobal(
    'Image',
    vi.fn(function () {
      const image = new MockImage();

      instances.push(image);

      return image;
    }),
  );

  return instances;
};

const installAudioMock = () => {
  const instances: MockAudio[] = [];

  vi.stubGlobal(
    'Audio',
    vi.fn(function () {
      const audio = new MockAudio();

      instances.push(audio);

      return audio;
    }),
  );

  return instances;
};

const installFontFaceMock = (loadResult: 'resolve' | 'reject' = 'resolve') => {
  const loadedFontFaces: MockFontFace[] = [];

  class MockFontFace {
    public readonly family: string;
    public readonly source: string;

    constructor(family: string, source: string) {
      this.family = family;
      this.source = source;
      loadedFontFaces.push(this);
    }

    public load() {
      if (loadResult === 'reject') return Promise.reject(new Error('Font failed'));

      return Promise.resolve(this);
    }
  }

  const fonts = { add: vi.fn() };

  vi.stubGlobal('FontFace', MockFontFace);
  vi.stubGlobal('document', { fonts });

  return { fonts, loadedFontFaces };
};

describe('Game Client - AssetsDriver', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('should load and cache sprite sheets', async () => {
    const images = installImageMock();
    const sut = new AssetsDriver();
    const spriteAsset = asset('sprites');

    const result = sut.loadSpriteSheet(spriteAsset);

    images[0].onload?.();

    await expect(result).resolves.toBe(true);
    await expect(sut.loadSpriteSheet(spriteAsset)).resolves.toBe(false);
    expect(sut.getAsset(spriteAsset.id)).toBe(images[0]);
  });

  it('should reject sprite sheet failures with asset context', async () => {
    const images = installImageMock();
    const sut = new AssetsDriver();
    const spriteAsset = asset('missing-sprites');

    const result = sut.loadSpriteSheet(spriteAsset);

    images[0].onerror?.();

    await expect(result).rejects.toThrow('Could not load sprite sheet asset missing-sprites from /assets/missing-sprites.png');
  });

  it('should reuse in-flight sprite sheet loads', async () => {
    const images = installImageMock();
    const sut = new AssetsDriver();
    const spriteAsset = asset('shared-sprites');

    const firstLoad = sut.loadSpriteSheet(spriteAsset);
    const secondLoad = sut.loadSpriteSheet(spriteAsset);

    expect(firstLoad).toBe(secondLoad);
    expect(images).toHaveLength(1);

    images[0].onload?.();

    await expect(firstLoad).resolves.toBe(true);
    await expect(secondLoad).resolves.toBe(true);
  });

  it('should reject asset loads that time out', async () => {
    vi.useFakeTimers();

    installImageMock();

    const sut = new AssetsDriver();
    const spriteAsset = asset('slow-sprites');
    const result = sut.loadSpriteSheet(spriteAsset);
    const expectation = expect(result).rejects.toThrow(
      'Timed out loading sprite sheet asset slow-sprites from /assets/slow-sprites.png after 10000ms',
    );

    vi.advanceTimersByTime(10000);

    await expectation;
  });

  it('should reject synchronous loader failures and clear the timeout path', async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'Image',
      vi.fn(function () {
        throw new Error('Image constructor unavailable');
      }),
    );

    const sut = new AssetsDriver();
    const spriteAsset = asset('constructor-error');

    await expect(sut.loadSpriteSheet(spriteAsset)).rejects.toThrow(
      'Could not load sprite sheet asset constructor-error from /assets/constructor-error.png: Image constructor unavailable',
    );
    expect(vi.getTimerCount()).toBe(0);
  });

  it('should load audio assets', async () => {
    const audios = installAudioMock();
    const sut = new AssetsDriver();
    const audioAsset = asset('waka');

    const result = sut.loadAudio(audioAsset);

    audios[0].oncanplaythrough?.();

    await expect(result).resolves.toBe(true);
    expect(sut.getAsset(audioAsset.id)).toBe(audios[0]);
  });

  it('should reject audio load failures with asset context', async () => {
    const audios = installAudioMock();
    const sut = new AssetsDriver();
    const audioAsset = asset('missing-audio');

    const result = sut.loadAudio(audioAsset);

    audios[0].onerror?.();

    await expect(result).rejects.toThrow('Could not load audio asset missing-audio from /assets/missing-audio.png');
  });

  it('should load and register font faces', async () => {
    const { fonts, loadedFontFaces } = installFontFaceMock();
    const sut = new AssetsDriver();
    const fontAsset = asset('menu-font');

    await expect(sut.loadFontFace('Press Start', fontAsset)).resolves.toBe(true);

    expect(fonts.add).toHaveBeenCalledWith(loadedFontFaces[0]);
    expect(sut.getAsset(fontAsset.id)).toBe(loadedFontFaces[0]);
  });

  it('should reject font load failures with asset context', async () => {
    installFontFaceMock('reject');

    const sut = new AssetsDriver();
    const fontAsset = asset('missing-font');

    await expect(sut.loadFontFace('Press Start', fontAsset)).rejects.toThrow(
      'Could not load font face asset missing-font from /assets/missing-font.png',
    );
  });
});
