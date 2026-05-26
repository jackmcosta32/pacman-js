import type { Values } from '@shared/types/util.type';
import type { ISerializedScene } from '@game-engine/interfaces/scene.interface';

export const LOG_LEVEL = {
  INFO: 'info',
  WARNING: 'warn',
  ERROR: 'error',
} as const;

export type ILogLevel = Values<typeof LOG_LEVEL>;

export interface IGameClientDebugTileCoordinate {
  row: number;
  column: number;
}

export interface IGameClientDebugOverlaySnapshot {
  fps: number;
  sceneId: string;
  entityCount: number;
  playerTile: string;
}

export interface IGameClientDebugger {
  toggle(): boolean;
  isEnabled(): boolean;
  recordFrame(timestamp: number): void;
  recordSceneSnapshot(scene: ISerializedScene, playerTile?: IGameClientDebugTileCoordinate): void;
  getOverlaySnapshot(): IGameClientDebugOverlaySnapshot;
  log(level: ILogLevel, ...args: unknown[]): void;
}
