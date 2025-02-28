import { ACTOR_SPRITES } from './config/asset.configs';
import { SECONDS_PER_FRAME } from './config/game.config';
import type { IGame } from '@shared/interfaces/game.interface';
import type { IGameClient } from '@game-client/interfaces/game-client.interface';
import type { IAssetsDriver, IGraphicsDriver, IInputDriver } from '@game-client/interfaces/driver.interface';
import { COMPONENT_TYPE } from '@game-engine/constants/component.constant';

export interface IPacmanGameClientConstructor {
  game: IGame;
  inputDriver: IInputDriver;
  assetsDriver: IAssetsDriver;
  graphicsDriver: IGraphicsDriver;
}

export class PacmanGameClient implements IGameClient {
  private readonly game: IGame;
  private readonly inputDriver: IInputDriver;
  private readonly assetsDriver: IAssetsDriver;
  private readonly graphicsDriver: IGraphicsDriver;
  private lastTimestamp = performance.now();

  constructor(params: IPacmanGameClientConstructor) {
    this.game = params.game;
    this.inputDriver = params.inputDriver;
    this.assetsDriver = params.assetsDriver;
    this.graphicsDriver = params.graphicsDriver;
  }

  protected update(timestamp?: number) {
    if (timestamp) {
      const elapsed = timestamp - this.lastTimestamp;

      if (elapsed < SECONDS_PER_FRAME) return;

      this.lastTimestamp = timestamp - (elapsed % SECONDS_PER_FRAME);
    }

    const inputEvents = this.inputDriver.readInputStream();
    const gameState = this.game.update({ timestamp, inputEvents });

    gameState.entities.forEach((entity) => {
      const renderComponent = entity.components[COMPONENT_TYPE.RENDER_COMPONENT];
      const positionComponent = entity.components[COMPONENT_TYPE.POSITION_COMPONENT];

      if (!renderComponent || !positionComponent) return;

      this.graphicsDriver.drawSprite(sprite, position);
    });

    this.inputDriver.clearInputStream();
  }

  public async start() {
    this.inputDriver.init();

    await this.assetsDriver.loadSpriteSheet(ACTOR_SPRITES);

    this.game.start();
  }
}
