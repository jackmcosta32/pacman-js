import { System } from '@game-engine/core/system';
import { PositionComponent } from '@game-engine/components/position.component';
import { PACMAN_SYSTEM } from '@pacman/constants/pacman-system.constant';
import type { ISceneState } from '@game-engine/interfaces/scene.interface';
import { PacmanActorComponent } from '@pacman/components/pacman-actor.component';
import { PacmanGhostComponent } from '@pacman/components/pacman-ghost.component';
import { PACMAN_ROUND_STATUS } from '@pacman/constants/pacman-game-state.constant';
import { PACMAN_ACTOR_MOVEMENT_STATE } from '@pacman/constants/pacman-actor.constant';
import type { IPacmanGhostMode } from '@pacman/interfaces/pacman-ghost.interface';
import type { IPacmanParsedLevel, IPacmanTileCoordinate } from '@pacman/interfaces/pacman-level.interface';
import { getReverseDirection, getActorTile } from '@pacman/utils/pacman-movement.util';
import { getPacmanGameState, getPacmanGhostEntities } from '@pacman/utils/pacman-entity.util';
import {
  PACMAN_GHOST_MODE,
  PACMAN_GHOST_BASE_SPEED,
  PACMAN_GHOST_MODE_PHASES,
  PACMAN_GHOST_RETURNING_SPEED,
  PACMAN_GHOST_FRIGHTENED_SPEED,
} from '@pacman/constants/pacman-ghost.constant';

export interface IPacmanGhostModeSystemConstructor {
  level: IPacmanParsedLevel;
}

export class PacmanGhostModeSystem extends System {
  public static readonly id = PACMAN_SYSTEM.GHOST_MODE;

  private readonly level: IPacmanParsedLevel;
  private phaseIndex = 0;
  private phaseElapsedMs = 0;

  constructor(params: IPacmanGhostModeSystemConstructor) {
    super();

    this.level = params.level;
  }

  public update(sceneState: ISceneState): void {
    const gameStateComponent = getPacmanGameState(sceneState.entityManager);

    if (!gameStateComponent) return;

    if (!gameStateComponent.isPlaying) {
      if (gameStateComponent.status === PACMAN_ROUND_STATUS.RESPAWNING) {
        this.reset();
      }

      return;
    }

    this.updateBaseMode(sceneState.elapsed);

    getPacmanGhostEntities(sceneState.entityManager).forEach((entity) => {
      const ghostComponent = entity.getComponent(PacmanGhostComponent);
      const actorComponent = entity.getComponent(PacmanActorComponent);
      const positionComponent = entity.getComponent(PositionComponent);

      if (!ghostComponent || !actorComponent || !positionComponent) return;

      ghostComponent.updateReleaseTimer(sceneState.elapsed);
      this.restoreReturningGhostAtHome(ghostComponent, actorComponent, positionComponent);
      ghostComponent.setBaseMode(this.currentBaseMode);
      this.syncFrightenedMode(ghostComponent, actorComponent, gameStateComponent);
      this.syncActorState(ghostComponent, actorComponent);
    });
  }

  public reset(): void {
    this.phaseIndex = 0;
    this.phaseElapsedMs = 0;
  }

  private get currentBaseMode(): IPacmanGhostMode {
    return PACMAN_GHOST_MODE_PHASES[this.phaseIndex]?.mode ?? PACMAN_GHOST_MODE.CHASE;
  }

  private updateBaseMode(elapsed: number): void {
    this.phaseElapsedMs += elapsed;

    let phase = PACMAN_GHOST_MODE_PHASES[this.phaseIndex];

    while (phase && this.phaseElapsedMs >= phase.durationMs && this.phaseIndex < PACMAN_GHOST_MODE_PHASES.length - 1) {
      this.phaseElapsedMs -= phase.durationMs;
      this.phaseIndex += 1;
      phase = PACMAN_GHOST_MODE_PHASES[this.phaseIndex];
    }
  }

  private restoreReturningGhostAtHome(
    ghostComponent: PacmanGhostComponent,
    actorComponent: PacmanActorComponent,
    positionComponent: PositionComponent,
  ): void {
    if (ghostComponent.mode !== PACMAN_GHOST_MODE.RETURNING_HOME) return;

    const currentTile = getActorTile(this.level, positionComponent.position, positionComponent.size);

    if (!currentTile || !isSameTile(currentTile, ghostComponent.homeTile)) return;

    ghostComponent.mode = this.currentBaseMode;
    ghostComponent.previousMode = this.currentBaseMode;
    ghostComponent.release();
    actorComponent.updateMovementState(PACMAN_ACTOR_MOVEMENT_STATE.WALKING);
  }

  private syncFrightenedMode(
    ghostComponent: PacmanGhostComponent,
    actorComponent: PacmanActorComponent,
    gameStateComponent: { isFrightenedModeActive: boolean; frightenedWindowId: number },
  ): void {
    if (gameStateComponent.isFrightenedModeActive) {
      if (ghostComponent.frightenedWindowId === gameStateComponent.frightenedWindowId) return;
      if (ghostComponent.mode === PACMAN_GHOST_MODE.RETURNING_HOME || ghostComponent.mode === PACMAN_GHOST_MODE.EATEN) return;

      const reverseDirection = getReverseDirection(actorComponent.currentDirection);

      actorComponent.updateCurrentDirection(reverseDirection);
      actorComponent.updateRequestedDirection(reverseDirection);
      actorComponent.updateMovementState(PACMAN_ACTOR_MOVEMENT_STATE.WALKING);
      ghostComponent.enterFrightenedMode(gameStateComponent.frightenedWindowId);

      return;
    }

    ghostComponent.exitFrightenedMode();
  }

  private syncActorState(ghostComponent: PacmanGhostComponent, actorComponent: PacmanActorComponent): void {
    if (!ghostComponent.released) {
      actorComponent.updateMovementState(PACMAN_ACTOR_MOVEMENT_STATE.IDLE);
      actorComponent.updateSpeed(PACMAN_GHOST_BASE_SPEED);
      return;
    }

    if (ghostComponent.mode === PACMAN_GHOST_MODE.FRIGHTENED) {
      actorComponent.updateSpeed(PACMAN_GHOST_FRIGHTENED_SPEED);
      actorComponent.updateMovementState(PACMAN_ACTOR_MOVEMENT_STATE.WALKING);
      return;
    }

    if (ghostComponent.mode === PACMAN_GHOST_MODE.RETURNING_HOME || ghostComponent.mode === PACMAN_GHOST_MODE.EATEN) {
      actorComponent.updateSpeed(PACMAN_GHOST_RETURNING_SPEED);
      actorComponent.updateMovementState(PACMAN_ACTOR_MOVEMENT_STATE.WALKING);
      return;
    }

    actorComponent.updateSpeed(PACMAN_GHOST_BASE_SPEED);
    actorComponent.updateMovementState(PACMAN_ACTOR_MOVEMENT_STATE.WALKING);
  }
}

const isSameTile = (first: IPacmanTileCoordinate, second: IPacmanTileCoordinate): boolean => {
  return first.row === second.row && first.column === second.column;
};
