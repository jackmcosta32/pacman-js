import type { IAudioDriver, IAssetsDriver } from '@game-client/interfaces/driver.interface';

export interface IAudioDriverConstructor {
  assetsDriver: IAssetsDriver;
}

export class AudioDriver implements IAudioDriver {
  private readonly assetsDriver: IAssetsDriver;

  constructor(params: IAudioDriverConstructor) {
    this.assetsDriver = params.assetsDriver;
  }

  public play(assetId: string): void {
    const asset = this.assetsDriver.getAsset(assetId) as Partial<HTMLAudioElement>;

    if (!asset.play) return;

    asset.currentTime = 0;
    void asset.play()?.catch(() => undefined);
  }
}
