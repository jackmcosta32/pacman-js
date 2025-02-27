import { GameClient } from '@game-client/game-client';
import { ACTOR_SPRITES } from './config/asset.configs';
import type { IGame } from '@shared/interfaces/game.interface';
import type { IAssetsDriver, IGraphicsDriver, IInputDriver } from '@game-client/interfaces/driver.interface';

export interface IPacmanGameClientConstructor {
  game: IGame;
  inputDriver: IInputDriver;
  assetsDriver: IAssetsDriver;
  graphicsDriver: IGraphicsDriver;
}

export class PacmanGameClient extends GameClient {
  protected readonly game;
  private readonly inputDriver;
  private readonly assetsDriver;
  private readonly graphicsDriver;

  constructor(params: IPacmanGameClientConstructor) {
    super();

    this.game = params.game;
    this.inputDriver = params.inputDriver;
    this.assetsDriver = params.assetsDriver;
    this.graphicsDriver = params.graphicsDriver;
  }

  protected update(timestamp?: number) {
    const inputEvents = this.inputDriver.readInputStream();
    const gameState = this.game.update({ timestamp, inputEvents });

    gameState.graphics.forEach(([sprite, position]) => {
      this.graphicsDriver.drawSprite(sprite, position);
    });

    this.inputDriver.clearInputStream();
  }

  public async start() {
    this.inputDriver.init();

    await this.assetsDriver.loadSpriteSheet(ACTOR_SPRITES);

    this.game.start();

    this.tick();
  }
}
