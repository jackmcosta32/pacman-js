import type { IAsset } from '@shared/interfaces/asset.interface';
import type { IAssetsDriver } from '@game-client/interfaces/driver.interface';

export class AssetsDriver implements IAssetsDriver {
  private readonly assets = new Map<string, HTMLElement | FontFace>();

  public getAsset(id: string) {
    const asset = this.assets.get(id);

    if (!asset) throw new Error(`Could not find an asset with ID ${id}`);

    return asset;
  }

  public async loadSpriteSheet(asset: IAsset): Promise<boolean> {
    if (this.assets.has(asset.id)) return false;

    return new Promise<boolean>((resolve, reject) => {
      const image = new Image();

      image.onload = () => {
        this.assets.set(asset.id, image);

        resolve(true);
      };

      image.onerror = () => reject(new Error(`Could not load sprite sheet asset ${asset.id}`));

      image.src = asset.pathname;
    });
  }

  public async loadAudio(asset: IAsset): Promise<boolean> {
    if (this.assets.has(asset.id)) return false;

    return new Promise<boolean>((resolve, reject) => {
      const audio = new Audio();

      audio.oncanplaythrough = () => {
        this.assets.set(asset.id, audio);

        resolve(true);
      };

      audio.onerror = () => reject(new Error(`Could not load audio asset ${asset.id}`));

      audio.src = asset.pathname;
    });
  }

  public async loadFontFace(family: string, asset: IAsset): Promise<boolean> {
    if (this.assets.has(asset.id)) return false;

    const fontFace = new FontFace(family, `url(${asset.pathname})`);

    await fontFace.load();

    this.assets.set(asset.id, fontFace);

    return true;
  }
}
