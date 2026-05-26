import type { ISerializedScene } from '@game-engine/interfaces/scene.interface';
import {
  LOG_LEVEL,
  type ILogLevel,
  type IGameClientDebugger,
  type IGameClientDebugTileCoordinate,
  type IGameClientDebugOverlaySnapshot,
} from './interfaces/game-client-debugger.interface';

export interface IGameClientDebuggerConstructor {
  enabled?: boolean;
  logLevel?: ILogLevel;
}

const LOG_LEVEL_PRIORITY: Record<ILogLevel, number> = {
  [LOG_LEVEL.INFO]: 0,
  [LOG_LEVEL.WARNING]: 1,
  [LOG_LEVEL.ERROR]: 2,
};

export class GameClientDebugger implements IGameClientDebugger {
  private enabled: boolean;
  private fps = 0;
  private entityCount = 0;
  private sceneId = 'n/a';
  private playerTile = 'n/a';
  private lastFrameTimestamp?: number;
  private readonly logLevel: ILogLevel;

  constructor(params: IGameClientDebuggerConstructor = {}) {
    this.enabled = params.enabled ?? false;
    this.logLevel = params.logLevel ?? LOG_LEVEL.INFO;
  }

  public toggle(): boolean {
    this.enabled = !this.enabled;

    return this.enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public recordFrame(timestamp: number): void {
    if (this.lastFrameTimestamp !== undefined) {
      const elapsed = timestamp - this.lastFrameTimestamp;

      if (elapsed > 0) {
        this.fps = Math.round(1000 / elapsed);
      }
    }

    this.lastFrameTimestamp = timestamp;
  }

  public recordSceneSnapshot(scene: ISerializedScene, playerTile?: IGameClientDebugTileCoordinate): void {
    this.sceneId = scene.id;
    this.entityCount = scene.entities.length;
    this.playerTile = playerTile ? `${playerTile.row},${playerTile.column}` : 'n/a';
  }

  public getOverlaySnapshot(): IGameClientDebugOverlaySnapshot {
    return {
      fps: this.fps,
      sceneId: this.sceneId,
      entityCount: this.entityCount,
      playerTile: this.playerTile,
    };
  }

  public log(level: ILogLevel, ...args: unknown[]): void {
    if (!this.enabled) return;
    if (LOG_LEVEL_PRIORITY[level] < LOG_LEVEL_PRIORITY[this.logLevel]) return;

    console[level](...args);
  }
}
