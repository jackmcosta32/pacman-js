import type { IAsset } from '@shared/interfaces/asset.interface';
import type { IAssetsDriver } from '@game-client/interfaces/driver.interface';

const DEFAULT_ASSET_LOAD_TIMEOUT_MS = 10000;

type AssetElement = HTMLElement | FontFace;
type AssetResolver = (asset: AssetElement) => void;
type AssetRejecter = (error: Error) => void;
type AssetLoader = (resolve: AssetResolver, reject: AssetRejecter) => void;

export class AssetsDriver implements IAssetsDriver {
  private readonly assets = new Map<string, AssetElement>();
  private readonly pendingAssets = new Map<string, Promise<boolean>>();

  public getAsset(id: string) {
    const asset = this.assets.get(id);

    if (!asset) throw new Error(`Could not find an asset with ID ${id}`);

    return asset;
  }

  public loadSpriteSheet(asset: IAsset): Promise<boolean> {
    return this.loadAsset(asset, 'sprite sheet', (resolve, reject) => {
      const image = new Image();

      image.onload = () => resolve(image);
      image.onerror = () => reject(this.createLoadError(asset, 'sprite sheet'));

      image.src = asset.pathname;
    });
  }

  public loadAudio(asset: IAsset): Promise<boolean> {
    return this.loadAsset(asset, 'audio', (resolve, reject) => {
      const audio = new Audio();

      audio.oncanplaythrough = () => resolve(audio);
      audio.onerror = () => reject(this.createLoadError(asset, 'audio'));

      audio.src = asset.pathname;
    });
  }

  public loadFontFace(family: string, asset: IAsset): Promise<boolean> {
    return this.loadAsset(asset, 'font face', (resolve, reject) => {
      const fontFace = new FontFace(family, `url(${asset.pathname})`);

      fontFace
        .load()
        .then((loadedFontFace) => {
          globalThis.document?.fonts?.add(loadedFontFace);

          resolve(loadedFontFace);
        })
        .catch(() => reject(this.createLoadError(asset, 'font face')));
    });
  }

  private loadAsset(asset: IAsset, type: string, loader: AssetLoader): Promise<boolean> {
    if (this.assets.has(asset.id)) return Promise.resolve(false);

    const pendingAsset = this.pendingAssets.get(asset.id);

    if (pendingAsset) return pendingAsset;

    const pendingLoad = new Promise<boolean>((resolve, reject) => {
      let hasSettled = false;
      let timeoutId: ReturnType<typeof setTimeout>;

      const resolveOnce = (loadedAsset: AssetElement) => {
        if (hasSettled) return;

        hasSettled = true;
        clearTimeout(timeoutId);
        this.assets.set(asset.id, loadedAsset);

        resolve(true);
      };

      const rejectOnce = (error: Error) => {
        if (hasSettled) return;

        hasSettled = true;
        clearTimeout(timeoutId);

        reject(error);
      };

      timeoutId = setTimeout(() => {
        rejectOnce(
          new Error(
            `Timed out loading ${type} asset ${asset.id} from ${asset.pathname} after ${DEFAULT_ASSET_LOAD_TIMEOUT_MS}ms`,
          ),
        );
      }, DEFAULT_ASSET_LOAD_TIMEOUT_MS);

      try {
        loader(resolveOnce, rejectOnce);
      } catch (error) {
        rejectOnce(
          error instanceof Error
            ? new Error(`Could not load ${type} asset ${asset.id} from ${asset.pathname}: ${error.message}`)
            : this.createLoadError(asset, type),
        );
      }
    }).finally(() => {
      this.pendingAssets.delete(asset.id);
    });

    this.pendingAssets.set(asset.id, pendingLoad);

    return pendingLoad;
  }

  private createLoadError(asset: IAsset, type: string) {
    return new Error(`Could not load ${type} asset ${asset.id} from ${asset.pathname}`);
  }
}
