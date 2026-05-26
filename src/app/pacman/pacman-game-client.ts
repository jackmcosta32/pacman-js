import type { IGame } from '@shared/interfaces/game.interface';
import { PACMAN_EVENT_TYPE } from './constants/pacman-event.constant';
import { COMPONENT_TYPE } from '@shared/constants/component.constant';
import { KEYBOARD_EVENT_TYPE } from '@shared/constants/event.constant';
import type { IInputEvent } from '@shared/interfaces/event.interface';
import { PACMAN_SCENE } from '@pacman/constants/pacman-scene.constant';
import { ACTOR_SPRITES, MENU_FONT, PACMAN_SOUND_ASSETS } from '@pacman/config/pacman-asset.config';
import type { ISerializedScene } from '@game-engine/interfaces/scene.interface';
import type { IGameClient } from '@game-client/interfaces/game-client.interface';
import type { ISerializedUIComponent } from '@game-engine/components/ui.component';
import type { ISerializedEntity } from '@game-engine/interfaces/entity.interface';
import { SECONDS_PER_FRAME, INPUT_SCHEME } from '@pacman/config/pacman-game.config';
import type { ISerializedSpriteComponent } from '@game-engine/components/sprite.component';
import { PACMAN_ROLE } from '@pacman/constants/pacman-game-state.constant';
import type { ISerializedPositionComponent } from '@game-engine/components/position.component';
import type { IPacmanEvent, IPacmanMovementRequestEvent } from '@pacman/interfaces/pacman-event.interface';
import { PACMAN_TILE_TYPE, PACMAN_COLLECTIBLE_TYPE } from '@pacman/constants/pacman-level.constant';
import { PACMAN_ACTOR_DIRECTION } from './constants/pacman-actor.constant';
import { PACMAN_COMPONENT_TYPE } from '@pacman/constants/pacman-component.constant';
import { PACMAN_MENU_NAVIGATION_DIRECTION } from '@pacman/constants/pacman-menu.constant';
import type { ISerializedPacmanRoleComponent } from '@pacman/components/pacman-role.component';
import type { ISerializedPacmanTileComponent } from '@pacman/components/pacman-tile.component';
import type {
  IAssetsDriver,
  IAudioDriver,
  IGraphicsDriver,
  IInputDriver,
} from '@game-client/interfaces/driver.interface';
import type { IGameClientDebugger } from '@game-client/interfaces/game-client-debugger.interface';
import type { ISerializedPacmanCollectibleComponent } from '@pacman/components/pacman-collectible.component';
import type { ISerializedPacmanGameStateComponent } from '@pacman/components/pacman-game-state.component';

export interface IPacmanGameClientConstructor {
  game: IGame;
  inputDriver: IInputDriver;
  audioDriver: IAudioDriver;
  assetsDriver: IAssetsDriver;
  graphicsDriver: IGraphicsDriver;
  gameClientDebugger?: IGameClientDebugger;
}

export class PacmanGameClient implements IGameClient {
  private readonly game: IGame;
  private currentSceneId?: string;
  private readonly inputDriver: IInputDriver;
  private readonly audioDriver: IAudioDriver;
  private readonly assetsDriver: IAssetsDriver;
  private readonly graphicsDriver: IGraphicsDriver;
  private readonly gameClientDebugger?: IGameClientDebugger;
  private lastTimestamp = performance.now();
  private lastPlayedSoundHookId = 0;
  private lastSoundHookEntityId?: string;
  private lifecycleToken = 0;
  private isRunning = false;
  private isSubscribed = false;
  private pendingStart?: Promise<void>;
  private animationFrameId?: number;
  private readonly sceneListener = (scene: ISerializedScene) => this.syncGameScene(scene);

  constructor(params: IPacmanGameClientConstructor) {
    this.game = params.game;
    this.inputDriver = params.inputDriver;
    this.audioDriver = params.audioDriver;
    this.assetsDriver = params.assetsDriver;
    this.graphicsDriver = params.graphicsDriver;
    this.gameClientDebugger = params.gameClientDebugger;
  }

  private syncGameScene(scene: ISerializedScene) {
    if (this.currentSceneId !== scene.id) {
      this.graphicsDriver.setResolution(scene.viewport);
      this.currentSceneId = scene.id;
      this.lastPlayedSoundHookId = 0;
      this.lastSoundHookEntityId = undefined;
    }

    this.graphicsDriver.clear({ x: 0, y: 0 });

    if (!scene.entities) return;

    const playerTile = this.findPlayerTileCoordinate(scene.entities);

    this.gameClientDebugger?.recordSceneSnapshot(scene, playerTile);

    scene.entities.forEach((entity) => this.drawWallEntity(entity));
    scene.entities.forEach((entity) => this.drawCollectibleEntity(entity));
    scene.entities.forEach((entity) => this.drawSpriteOrTextEntity(entity));
    this.drawDebugLayer(scene.entities);
    scene.entities.forEach((entity) => this.playSoundHooks(entity));
  }

  private drawDebugLayer(entities: ISerializedEntity[]): void {
    if (!this.gameClientDebugger?.isEnabled()) return;

    entities.forEach((entity) => this.drawDebugCollisionBox(entity));
    entities.forEach((entity) => this.drawDebugTileBoundary(entity));
    this.drawDebugOverlay();
  }

  private drawDebugCollisionBox(entity: ISerializedEntity): void {
    const positionComponent = entity.components[COMPONENT_TYPE.POSITION_COMPONENT] as ISerializedPositionComponent;
    const uiComponent = entity.components[COMPONENT_TYPE.UI_COMPONENT] as ISerializedUIComponent;

    if (!positionComponent || uiComponent) return;

    this.graphicsDriver.drawRectangle(positionComponent.position, positionComponent.boundingBox, {
      strokeColor: 'rgba(255, 64, 64, 0.85)',
      lineWidth: 1,
    });
  }

  private drawDebugTileBoundary(entity: ISerializedEntity): void {
    const tileComponent = entity.components[PACMAN_COMPONENT_TYPE.TILE_COMPONENT] as ISerializedPacmanTileComponent;
    const positionComponent = entity.components[COMPONENT_TYPE.POSITION_COMPONENT] as ISerializedPositionComponent;

    if (!tileComponent || !positionComponent) return;

    this.graphicsDriver.drawRectangle(positionComponent.position, positionComponent.boundingBox, {
      strokeColor: 'rgba(95, 221, 255, 0.45)',
      lineWidth: 1,
    });
    this.graphicsDriver.drawText(`${tileComponent.row},${tileComponent.column}`, {
      x: positionComponent.position.x + 3,
      y: positionComponent.position.y + 10,
    }, {
      color: 'rgba(255, 255, 255, 0.75)',
      fontFamily: 'monospace',
      fontSize: 8,
    });
  }

  private drawDebugOverlay(): void {
    const snapshot = this.gameClientDebugger?.getOverlaySnapshot();

    if (!snapshot) return;

    const position = { x: 8, y: 40 };
    const lines = [
      `FPS ${snapshot.fps}`,
      `SCENE ${snapshot.sceneId}`,
      `ENTITIES ${snapshot.entityCount}`,
      `PLAYER TILE ${snapshot.playerTile}`,
    ];

    this.graphicsDriver.drawRectangle({ x: position.x - 4, y: position.y - 18 }, { width: 210, height: 72 }, {
      fillColor: 'rgba(0, 0, 0, 0.7)',
      strokeColor: 'rgba(255, 255, 255, 0.45)',
      lineWidth: 1,
    });

    lines.forEach((line, index) => {
      this.graphicsDriver.drawText(line, { x: position.x, y: position.y + index * 14 }, {
        color: '#8cffb2',
        fontFamily: 'monospace',
        fontSize: 11,
      });
    });
  }

  private findPlayerTileCoordinate(entities: ISerializedEntity[]) {
    const player = entities.find((entity) => {
      const roleComponent = entity.components[PACMAN_COMPONENT_TYPE.ROLE_COMPONENT] as ISerializedPacmanRoleComponent;

      return roleComponent?.role === PACMAN_ROLE.PLAYER;
    });
    const playerPosition = player?.components[COMPONENT_TYPE.POSITION_COMPONENT] as ISerializedPositionComponent | undefined;

    if (!playerPosition) return;

    const tileEntity = entities.find((entity) => {
      const tileComponent = entity.components[PACMAN_COMPONENT_TYPE.TILE_COMPONENT] as ISerializedPacmanTileComponent;
      const positionComponent = entity.components[COMPONENT_TYPE.POSITION_COMPONENT] as ISerializedPositionComponent;

      return Boolean(tileComponent && positionComponent && this.isPointInsideBoundingBox(playerPosition.centerPosition, positionComponent.boundingBox));
    });
    const tileComponent = tileEntity?.components[PACMAN_COMPONENT_TYPE.TILE_COMPONENT] as ISerializedPacmanTileComponent | undefined;

    if (!tileComponent) return;

    return { row: tileComponent.row, column: tileComponent.column };
  }

  private isPointInsideBoundingBox(
    point: ISerializedPositionComponent['centerPosition'],
    boundingBox: ISerializedPositionComponent['boundingBox'],
  ): boolean {
    return (
      point.x >= boundingBox.x &&
      point.x < boundingBox.x + boundingBox.width &&
      point.y >= boundingBox.y &&
      point.y < boundingBox.y + boundingBox.height
    );
  }

  private playSoundHooks(entity: ISerializedEntity): void {
    const gameStateComponent = entity.components[
      PACMAN_COMPONENT_TYPE.GAME_STATE_COMPONENT
    ] as ISerializedPacmanGameStateComponent;

    if (!gameStateComponent) return;

    if (this.lastSoundHookEntityId !== entity.id) {
      this.lastPlayedSoundHookId = 0;
      this.lastSoundHookEntityId = entity.id;
    }

    const sortedSoundHooks = [...gameStateComponent.soundHooks].sort((left, right) => left.id - right.id);
    const latestSoundHook = sortedSoundHooks[sortedSoundHooks.length - 1];

    if (latestSoundHook && latestSoundHook.id < this.lastPlayedSoundHookId) {
      this.lastPlayedSoundHookId = 0;
    }

    sortedSoundHooks.forEach((soundHook) => {
      if (soundHook.id <= this.lastPlayedSoundHookId) return;

      this.audioDriver.play(soundHook.soundEffect);
      this.lastPlayedSoundHookId = soundHook.id;
    });
  }

  private drawWallEntity(entity: ISerializedEntity): void {
    const tileComponent = entity.components[PACMAN_COMPONENT_TYPE.TILE_COMPONENT] as ISerializedPacmanTileComponent;
    const positionComponent = entity.components[COMPONENT_TYPE.POSITION_COMPONENT] as ISerializedPositionComponent;

    if (!tileComponent || !positionComponent || tileComponent.tileType !== PACMAN_TILE_TYPE.WALL) return;

    this.graphicsDriver.drawRectangle(positionComponent.position, positionComponent.boundingBox, {
      fillColor: '#0b35f0',
      strokeColor: '#5c8dff',
      lineWidth: 2,
    });
  }

  private drawCollectibleEntity(entity: ISerializedEntity): void {
    const collectibleComponent = entity.components[
      PACMAN_COMPONENT_TYPE.COLLECTIBLE_COMPONENT
    ] as ISerializedPacmanCollectibleComponent;
    const positionComponent = entity.components[COMPONENT_TYPE.POSITION_COMPONENT] as ISerializedPositionComponent;

    if (!collectibleComponent || !positionComponent) return;

    const center = positionComponent.centerPosition;
    const tileRadius = Math.min(positionComponent.boundingBox.width, positionComponent.boundingBox.height);
    const radius =
      collectibleComponent.collectibleType === PACMAN_COLLECTIBLE_TYPE.POWER_PELLET
        ? Math.max(6, tileRadius * 0.2)
        : Math.max(3, tileRadius * 0.08);

    this.graphicsDriver.drawCircle(center, radius, { fillColor: '#f8e6b0' });
  }

  private drawSpriteOrTextEntity(entity: ISerializedEntity): void {
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
  }

  private mapInputEvent(input: IInputEvent): IPacmanEvent | undefined {
    if (input.type === KEYBOARD_EVENT_TYPE.KEY_DOWN || input.type === KEYBOARD_EVENT_TYPE.KEY_PRESSED) {
      if (this.currentSceneId === PACMAN_SCENE.MAIN_MENU) {
        switch (input.keyCode) {
          case INPUT_SCHEME.UP:
          case INPUT_SCHEME.LEFT:
            return {
              type: PACMAN_EVENT_TYPE.MENU_NAVIGATE,
              direction: PACMAN_MENU_NAVIGATION_DIRECTION.PREVIOUS,
            };
          case INPUT_SCHEME.DOWN:
          case INPUT_SCHEME.RIGHT:
            return {
              type: PACMAN_EVENT_TYPE.MENU_NAVIGATE,
              direction: PACMAN_MENU_NAVIGATION_DIRECTION.NEXT,
            };
          case INPUT_SCHEME.MENU_SELECT:
          case INPUT_SCHEME.MENU_SELECT_ALT:
            return {
              type: PACMAN_EVENT_TYPE.MENU_SELECT,
            };
        }
      }

      switch (input.keyCode) {
        case INPUT_SCHEME.UP:
          return {
            type: PACMAN_EVENT_TYPE.MOVEMENT_REQUEST,
            direction: PACMAN_ACTOR_DIRECTION.UP,
          } as IPacmanMovementRequestEvent;
        case INPUT_SCHEME.DOWN:
          return {
            type: PACMAN_EVENT_TYPE.MOVEMENT_REQUEST,
            direction: PACMAN_ACTOR_DIRECTION.DOWN,
          } as IPacmanMovementRequestEvent;
        case INPUT_SCHEME.LEFT:
          return {
            type: PACMAN_EVENT_TYPE.MOVEMENT_REQUEST,
            direction: PACMAN_ACTOR_DIRECTION.LEFT,
          } as IPacmanMovementRequestEvent;
        case INPUT_SCHEME.RIGHT:
          return {
            type: PACMAN_EVENT_TYPE.MOVEMENT_REQUEST,
            direction: PACMAN_ACTOR_DIRECTION.RIGHT,
          } as IPacmanMovementRequestEvent;
        case INPUT_SCHEME.PAUSE:
          return {
            type: PACMAN_EVENT_TYPE.PAUSE_TOGGLE,
          };
        case INPUT_SCHEME.RESTART:
          return {
            type: PACMAN_EVENT_TYPE.RESTART_REQUEST,
          };
        case INPUT_SCHEME.RETURN_TO_MENU:
          return {
            type: PACMAN_EVENT_TYPE.RETURN_TO_MENU_REQUEST,
          };
      }
    }
  }

  private handleDebugInput(input: IInputEvent): boolean {
    if (input.type !== KEYBOARD_EVENT_TYPE.KEY_DOWN || input.keyCode !== INPUT_SCHEME.DEBUG_TOGGLE) return false;

    const enabled = this.gameClientDebugger?.toggle();

    this.gameClientDebugger?.log('info', `Debug overlay ${enabled ? 'enabled' : 'disabled'}`);

    return true;
  }

  private update(timestamp?: number) {
    if (!this.isRunning) return;

    this.animationFrameId = requestAnimationFrame((timestamp) => this.update(timestamp));
    this.gameClientDebugger?.recordFrame(timestamp ?? performance.now());

    if (timestamp) {
      const elapsed = timestamp - this.lastTimestamp;

      if (elapsed < SECONDS_PER_FRAME) return;

      this.lastTimestamp = timestamp - (elapsed % SECONDS_PER_FRAME);
    }

    const inputEvents = this.inputDriver.drainInputStream();

    inputEvents.forEach((inputEvent) => {
      if (this.handleDebugInput(inputEvent)) return;

      const pacmanEvent = this.mapInputEvent(inputEvent);

      if (pacmanEvent) {
        if (pacmanEvent.type === PACMAN_EVENT_TYPE.RESTART_REQUEST) {
          this.lastPlayedSoundHookId = 0;
        }

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
    this.lastSoundHookEntityId = undefined;
    this.lastPlayedSoundHookId = 0;
    this.lastTimestamp = performance.now();
  }

  private async startRuntime(startToken: number): Promise<void> {
    this.inputDriver.init();

    try {
      await Promise.all([
        this.assetsDriver.loadSpriteSheet(ACTOR_SPRITES),
        this.assetsDriver.loadFontFace(MENU_FONT.id, MENU_FONT),
        ...Object.values(PACMAN_SOUND_ASSETS).map((asset) => this.assetsDriver.loadAudio(asset)),
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
