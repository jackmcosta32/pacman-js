import type { IAsset } from '@shared/interfaces/asset.interface';
import type { IAssetsDriver } from '@game-client/interfaces/driver.interface';

export class AssetsDriver implements IAssetsDriver {
  private readonly assets = new Map<string, HTMLElement>();

  public async init() {}

  public async loadSpriteSheet(asset: IAsset): Promise<void> {
    const image = new Image();
    image.src = asset.pathname;

    const { resolve, promise } = Promise.withResolvers<void>();

    image.onload = () => {
      this.assets.set(asset.id, image);

      resolve();
    };

    return promise;
  }

  public async loadAudio(asset: IAsset): Promise<void> {
    const audio = new Audio();
    audio.src = asset.pathname;

    const { resolve, promise } = Promise.withResolvers<void>();

    audio.onload = () => {
      this.assets.set(asset.id, audio);

      resolve();
    };

    return promise;
  }
}
