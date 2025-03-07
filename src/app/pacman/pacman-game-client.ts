import { SECONDS_PER_FRAME } from './config/game.config';
import { ACTOR_SPRITES, MENU_FONT } from './config/asset.config';
import { COMPONENT_TYPE } from '@shared/constants/component.constant';
import type { IGame } from '@shared/interfaces/game.interface';
import type { ISerializedScene } from '@game-engine/interfaces/scene.interface';
import type { IGameClient } from '@game-client/interfaces/game-client.interface';
import type { ISerializedUIComponent } from '@game-engine/components/ui.component';
import type { ISerializedSpriteComponent } from '@game-engine/components/sprite.component';
import type { ISerializedPositionComponent } from '@game-engine/components/position.component';
import type { IAssetsDriver, IGraphicsDriver, IInputDriver } from '@game-client/interfaces/driver.interface';

export interface IPacmanGameClientConstructor {
  game: IGame;
  inputDriver: IInputDriver;
  assetsDriver: IAssetsDriver;
  graphicsDriver: IGraphicsDriver;
}

export class PacmanGameClient implements IGameClient {
  private readonly game: IGame;
  private currentSceneId?: string;
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

  private syncGameScene(scene: ISerializedScene) {
    if (this.currentSceneId !== scene.id) {
      this.graphicsDriver.setResolution(scene.viewport);
      this.currentSceneId = scene.id;
    }

    this.graphicsDriver.clear({ x: 0, y: 0 });

    // I will need two states, one that runs in the client
    // and another that runs in the server/isolated
    if (!scene.entities) return;

    scene.entities.forEach((entity) => {
      const uiComponent = entity.components[COMPONENT_TYPE.UI_COMPONENT] as ISerializedUIComponent;
      const spriteComponent = entity.components[COMPONENT_TYPE.SPRITE_COMPONENT] as ISerializedSpriteComponent;
      const positionComponent = entity.components[COMPONENT_TYPE.POSITION_COMPONENT] as ISerializedPositionComponent;

      if (uiComponent && positionComponent) {
        const { innerText, ...typographyOptions } = uiComponent;
        const { position } = positionComponent;

        if (innerText) this.graphicsDriver.drawText(innerText, position, typographyOptions);
      }

      if (spriteComponent && positionComponent) {
        const { sprite } = spriteComponent;
        const { position } = positionComponent;

        this.graphicsDriver.drawSprite(sprite, position);
      }
    });
  }

  private update(timestamp?: number) {
    requestAnimationFrame((timestamp) => this.update(timestamp));

    if (timestamp) {
      const elapsed = timestamp - this.lastTimestamp;

      if (elapsed < SECONDS_PER_FRAME) return;

      this.lastTimestamp = timestamp - (elapsed % SECONDS_PER_FRAME);
    }

    const inputs = this.inputDriver.readInputStream();

    this.game.readInputs(inputs);

    this.inputDriver.clearInputStream();

    this.game.update();
  }

  public async start() {
    this.inputDriver.init();

    await Promise.all([
      this.assetsDriver.loadSpriteSheet(ACTOR_SPRITES),
      this.assetsDriver.loadFontFace(MENU_FONT.id, MENU_FONT),
    ]);

    this.game.subscribe((scene) => this.syncGameScene(scene));
    this.game.start();

    this.update();
  }
}
