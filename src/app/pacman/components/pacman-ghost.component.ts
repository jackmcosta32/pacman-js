import { Component } from '@game-engine/core/component';
import { PACMAN_COMPONENT_TYPE } from '@pacman/constants/pacman-component.constant';
import { PACMAN_GHOST_MODE } from '@pacman/constants/pacman-ghost.constant';
import type { ISerializedComponent } from '@game-engine/interfaces/component.interface';
import type {
  IPacmanGhostId,
  IPacmanGhostMode,
  IPacmanGhostTileCoordinate,
} from '@pacman/interfaces/pacman-ghost.interface';

export interface IPacmanGhostComponentConstructor {
  ghostId: IPacmanGhostId;
  mode?: IPacmanGhostMode;
  previousMode?: IPacmanGhostMode;
  spawnTile: IPacmanGhostTileCoordinate;
  homeTile: IPacmanGhostTileCoordinate;
  houseEntryTile: IPacmanGhostTileCoordinate;
  houseExitTile: IPacmanGhostTileCoordinate;
  scatterTargetTile: IPacmanGhostTileCoordinate;
  released?: boolean;
  releaseDelayMs: number;
  releaseElapsedMs?: number;
  frightenedWindowId?: number;
}

export interface ISerializedPacmanGhostComponent extends ISerializedComponent {
  ghostId: IPacmanGhostId;
  mode: IPacmanGhostMode;
  previousMode: IPacmanGhostMode;
  spawnTile: IPacmanGhostTileCoordinate;
  homeTile: IPacmanGhostTileCoordinate;
  houseEntryTile: IPacmanGhostTileCoordinate;
  houseExitTile: IPacmanGhostTileCoordinate;
  scatterTargetTile: IPacmanGhostTileCoordinate;
  released: boolean;
  releaseDelayMs: number;
  releaseElapsedMs: number;
  frightenedWindowId: number;
}

export class PacmanGhostComponent extends Component {
  public static readonly type = PACMAN_COMPONENT_TYPE.GHOST_COMPONENT;

  public readonly ghostId: IPacmanGhostId;
  public mode: IPacmanGhostMode;
  public previousMode: IPacmanGhostMode;
  public readonly spawnTile: IPacmanGhostTileCoordinate;
  public readonly homeTile: IPacmanGhostTileCoordinate;
  public readonly houseEntryTile: IPacmanGhostTileCoordinate;
  public readonly houseExitTile: IPacmanGhostTileCoordinate;
  public readonly scatterTargetTile: IPacmanGhostTileCoordinate;
  public released: boolean;
  public readonly releaseDelayMs: number;
  public releaseElapsedMs: number;
  public frightenedWindowId: number;

  constructor(params: IPacmanGhostComponentConstructor) {
    super();

    this.ghostId = params.ghostId;
    this.mode = params.mode ?? PACMAN_GHOST_MODE.SCATTER;
    this.previousMode = params.previousMode ?? PACMAN_GHOST_MODE.SCATTER;
    this.spawnTile = { ...params.spawnTile };
    this.homeTile = { ...params.homeTile };
    this.houseEntryTile = { ...params.houseEntryTile };
    this.houseExitTile = { ...params.houseExitTile };
    this.scatterTargetTile = { ...params.scatterTargetTile };
    this.released = params.released ?? params.releaseDelayMs === 0;
    this.releaseDelayMs = params.releaseDelayMs;
    this.releaseElapsedMs = params.releaseElapsedMs ?? 0;
    this.frightenedWindowId = params.frightenedWindowId ?? 0;
  }

  public setMode(mode: IPacmanGhostMode): void {
    if (this.mode !== PACMAN_GHOST_MODE.FRIGHTENED) {
      this.previousMode = this.mode;
    }

    this.mode = mode;
  }

  public setBaseMode(mode: IPacmanGhostMode): void {
    this.previousMode = mode;

    if (this.mode !== PACMAN_GHOST_MODE.FRIGHTENED && this.mode !== PACMAN_GHOST_MODE.RETURNING_HOME) {
      this.mode = mode;
    }
  }

  public enterFrightenedMode(windowId: number): void {
    if (this.mode === PACMAN_GHOST_MODE.RETURNING_HOME || this.mode === PACMAN_GHOST_MODE.EATEN) return;

    if (this.mode !== PACMAN_GHOST_MODE.FRIGHTENED) {
      this.previousMode = this.mode;
    }

    this.mode = PACMAN_GHOST_MODE.FRIGHTENED;
    this.frightenedWindowId = windowId;
  }

  public exitFrightenedMode(): void {
    if (this.mode !== PACMAN_GHOST_MODE.FRIGHTENED) return;

    this.mode = this.previousMode;
  }

  public markReturningHome(): void {
    this.mode = PACMAN_GHOST_MODE.RETURNING_HOME;
    this.released = true;
  }

  public release(): void {
    this.released = true;
  }

  public updateReleaseTimer(elapsed: number): void {
    if (this.released) return;

    this.releaseElapsedMs += elapsed;

    if (this.releaseElapsedMs >= this.releaseDelayMs) {
      this.release();
    }
  }

  public reset(baseMode = PACMAN_GHOST_MODE.SCATTER): void {
    this.mode = baseMode;
    this.previousMode = baseMode;
    this.released = this.releaseDelayMs === 0;
    this.releaseElapsedMs = 0;
    this.frightenedWindowId = 0;
  }

  public serialize(): ISerializedPacmanGhostComponent {
    return {
      type: this.type,
      ghostId: this.ghostId,
      mode: this.mode,
      previousMode: this.previousMode,
      spawnTile: { ...this.spawnTile },
      homeTile: { ...this.homeTile },
      houseEntryTile: { ...this.houseEntryTile },
      houseExitTile: { ...this.houseExitTile },
      scatterTargetTile: { ...this.scatterTargetTile },
      released: this.released,
      releaseDelayMs: this.releaseDelayMs,
      releaseElapsedMs: this.releaseElapsedMs,
      frightenedWindowId: this.frightenedWindowId,
    };
  }
}
