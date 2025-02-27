import type { IGame } from '@shared/interfaces/game.interface';
import type { IGameClient } from '@game-client/interfaces/game-client.interface';

export abstract class GameClient implements IGameClient {
  protected abstract game: IGame;
  protected abstract secondsPerFrame: number;
  protected lastTimestamp = performance.now();

  public abstract start(): void | Promise<void>;

  protected abstract update(timestamp?: number): void;

  protected tick(timestamp?: number) {
    requestAnimationFrame((timestamp) => this.tick(timestamp));

    if (timestamp) {
      const elapsed = timestamp - this.lastTimestamp;

      if (elapsed < this.secondsPerFrame) return;

      this.lastTimestamp = timestamp - (elapsed % this.secondsPerFrame);
    }

    this.update(timestamp);
  }
}
