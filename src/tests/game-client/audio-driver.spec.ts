import { describe, expect, it, vi } from 'vitest';
import { AudioDriver } from '@game-client/drivers/audio.driver';
import type { IAssetsDriver } from '@game-client/interfaces/driver.interface';

describe('Game Client - AudioDriver', () => {
  it('should replay cached audio assets by id', () => {
    const audio = {
      currentTime: 5,
      play: vi.fn(() => Promise.resolve()),
    };
    const assetsDriver = {
      getAsset: vi.fn(() => audio),
    } as unknown as IAssetsDriver;
    const sut = new AudioDriver({ assetsDriver });

    sut.play('pellet');

    expect(assetsDriver.getAsset).toHaveBeenCalledWith('pellet');
    expect(audio.currentTime).toBe(0);
    expect(audio.play).toHaveBeenCalledOnce();
  });
});
