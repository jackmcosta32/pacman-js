import type { IGame } from '@shared/interfaces/game.interface';
import { PACMAN_EVENT_TYPE } from './constants/pacman-event.constant';
import { COMPONENT_TYPE } from '@shared/constants/component.constant';
import { KEYBOARD_EVENT_TYPE } from '@shared/constants/event.constant';
import type { IInputEvent } from '@shared/interfaces/event.interface';
import { ACTOR_SPRITES, MENU_FONT } from '@pacman/config/pacman-asset.config';
import type { ISerializedScene } from '@game-engine/interfaces/scene.interface';
import type { IGameClient } from '@game-client/interfaces/game-client.interface';
import type { ISerializedUIComponent } from '@game-engine/components/ui.component';
import { SECONDS_PER_FRAME, INPUT_SCHEME } from '@pacman/config/pacman-game.config';
import type { ISerializedSpriteComponent } from '@game-engine/components/sprite.component';
import type { ISerializedPositionComponent } from '@game-engine/components/position.component';
import type { IPacmanEvent, IPacmanMovementEvent } from '@pacman/interfaces/pacman-event.interface';
import { PACMAN_ACTOR_DIRECTION, PACMAN_ACTOR_MOVEMENT_STATE } from './constants/pacman-actor.constant';
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
  private lifecycleToken = 0;
  private isRunning = false;
  private isSubscribed = false;
  private pendingStart?: Promise<void>;
  private animationFrameId?: number;
  private readonly sceneListener = (scene: ISerializedScene) => this.syncGameScene(scene);

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

  private mapInputEvent(input: IInputEvent): IPacmanEvent | undefined {
    if (input.type === KEYBOARD_EVENT_TYPE.KEY_DOWN || input.type === KEYBOARD_EVENT_TYPE.KEY_PRESSED) {
      switch (input.keyCode) {
        case INPUT_SCHEME.UP:
          return {
            type: PACMAN_EVENT_TYPE.MOVEMENT,
            direction: PACMAN_ACTOR_DIRECTION.UP,
            movementState: PACMAN_ACTOR_MOVEMENT_STATE.WALKING,
          } as IPacmanMovementEvent;
        case INPUT_SCHEME.DOWN:
          return {
            type: PACMAN_EVENT_TYPE.MOVEMENT,
            direction: PACMAN_ACTOR_DIRECTION.DOWN,
            movementState: PACMAN_ACTOR_MOVEMENT_STATE.WALKING,
          } as IPacmanMovementEvent;
        case INPUT_SCHEME.LEFT:
          return {
            type: PACMAN_EVENT_TYPE.MOVEMENT,
            direction: PACMAN_ACTOR_DIRECTION.LEFT,
            movementState: PACMAN_ACTOR_MOVEMENT_STATE.WALKING,
          } as IPacmanMovementEvent;
        case INPUT_SCHEME.RIGHT:
          return {
            type: PACMAN_EVENT_TYPE.MOVEMENT,
            direction: PACMAN_ACTOR_DIRECTION.RIGHT,
            movementState: PACMAN_ACTOR_MOVEMENT_STATE.WALKING,
          } as IPacmanMovementEvent;
      }
    }

    if (input.type === KEYBOARD_EVENT_TYPE.KEY_UP) {
      switch (input.keyCode) {
        case INPUT_SCHEME.UP:
          return {
            type: PACMAN_EVENT_TYPE.MOVEMENT,
            direction: PACMAN_ACTOR_DIRECTION.UP,
            movementState: PACMAN_ACTOR_MOVEMENT_STATE.IDLE,
          } as IPacmanMovementEvent;
        case INPUT_SCHEME.DOWN:
          return {
            type: PACMAN_EVENT_TYPE.MOVEMENT,
            direction: PACMAN_ACTOR_DIRECTION.DOWN,
            movementState: PACMAN_ACTOR_MOVEMENT_STATE.IDLE,
          } as IPacmanMovementEvent;
        case INPUT_SCHEME.LEFT:
          return {
            type: PACMAN_EVENT_TYPE.MOVEMENT,
            direction: PACMAN_ACTOR_DIRECTION.LEFT,
            movementState: PACMAN_ACTOR_MOVEMENT_STATE.IDLE,
          } as IPacmanMovementEvent;
        case INPUT_SCHEME.RIGHT:
          return {
            type: PACMAN_EVENT_TYPE.MOVEMENT,
            direction: PACMAN_ACTOR_DIRECTION.RIGHT,
            movementState: PACMAN_ACTOR_MOVEMENT_STATE.IDLE,
          } as IPacmanMovementEvent;
      }
    }
  }

  private update(timestamp?: number) {
    if (!this.isRunning) return;

    this.animationFrameId = requestAnimationFrame((timestamp) => this.update(timestamp));

    if (timestamp) {
      const elapsed = timestamp - this.lastTimestamp;

      if (elapsed < SECONDS_PER_FRAME) return;

      this.lastTimestamp = timestamp - (elapsed % SECONDS_PER_FRAME);
    }

    const inputEvents = this.inputDriver.drainInputStream();

    inputEvents.forEach((inputEvent) => {
      const pacmanEvent = this.mapInputEvent(inputEvent);

      if (pacmanEvent) {
        this.game.readClientEvent(pacmanEvent);
      }
    });

    this.game.update();
  }

  public start(): Promise<void> {
    if (this.isRunning) return Promise.resolve();
    if (this.pendingStart) return this.pendingStart;

    const startToken = ++this.lifecycleToken;
    const pendingStart = this.startRuntime(startToken).finally(() => {
      if (this.pendingStart === pendingStart) {
        this.pendingStart = undefined;
      }
    });

    this.pendingStart = pendingStart;

    return pendingStart;
  }

  public stop(): void {
    this.lifecycleToken += 1;
    this.isRunning = false;

    if (this.animationFrameId !== undefined) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }

    if (this.isSubscribed) {
      this.game.unsubscribe(this.sceneListener);
      this.isSubscribed = false;
    }

    this.inputDriver.destroy();
    this.game.destroy();

    this.pendingStart = undefined;
    this.currentSceneId = undefined;
    this.lastTimestamp = performance.now();
  }

  private async startRuntime(startToken: number): Promise<void> {
    this.inputDriver.init();

    try {
      await Promise.all([
        this.assetsDriver.loadSpriteSheet(ACTOR_SPRITES),
        this.assetsDriver.loadFontFace(MENU_FONT.id, MENU_FONT),
      ]);

      if (startToken !== this.lifecycleToken) return;

      this.currentSceneId = undefined;
      this.lastTimestamp = performance.now();
      this.game.subscribe(this.sceneListener);
      this.isSubscribed = true;
      this.game.start();
      this.isRunning = true;

      this.update();
    } catch (error) {
      if (startToken !== this.lifecycleToken) return;

      this.stop();

      throw error;
    }
  }
}
