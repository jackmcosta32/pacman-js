import { System } from '@game-engine/core/system';
import { PositionComponent } from '@game-engine/components/position.component';
import { PACMAN_SYSTEM } from '@pacman/constants/pacman-system.constant';
import type { ISceneState } from '@game-engine/interfaces/scene.interface';
import { PacmanActorComponent } from '@pacman/components/pacman-actor.component';
import { PacmanGhostComponent } from '@pacman/components/pacman-ghost.component';
import { PACMAN_ACTOR_DIRECTION, PACMAN_ACTOR_MOVEMENT_STATE } from '@pacman/constants/pacman-actor.constant';
import type { IPacmanActorDirection } from '@pacman/interfaces/pacman-actor.interface';
import type { IPacmanGhostTileCoordinate } from '@pacman/interfaces/pacman-ghost.interface';
import type { IPacmanParsedLevel, IPacmanTile } from '@pacman/interfaces/pacman-level.interface';
import { ACTOR_TURN_TOLERANCE } from '@pacman/config/pacman-game.config';
import { PACMAN_TILE_TYPE } from '@pacman/constants/pacman-level.constant';
import { getPacmanGameState, getPacmanGhostEntities, getPacmanPlayerEntity } from '@pacman/utils/pacman-entity.util';
import {
  getNextTile,
  getActorTile,
  getDirectionVector,
  isReverseDirection,
  isActorNearTileCenter,
  isDirectionWalkableFromTile,
} from '@pacman/utils/pacman-movement.util';
import {
  PACMAN_GHOST_ID,
  PACMAN_GHOST_MODE,
  PACMAN_GHOST_CLYDE_CHASE_DISTANCE,
} from '@pacman/constants/pacman-ghost.constant';

export interface IPacmanGhostTargetingSystemConstructor {
  level: IPacmanParsedLevel;
}

const DIRECTION_PRIORITY = [
  PACMAN_ACTOR_DIRECTION.UP,
  PACMAN_ACTOR_DIRECTION.LEFT,
  PACMAN_ACTOR_DIRECTION.DOWN,
  PACMAN_ACTOR_DIRECTION.RIGHT,
] as const;

export class PacmanGhostTargetingSystem extends System {
  public static readonly id = PACMAN_SYSTEM.GHOST_TARGETING;

  private readonly level: IPacmanParsedLevel;

  constructor(params: IPacmanGhostTargetingSystemConstructor) {
    super();

    this.level = params.level;
  }

  public update(sceneState: ISceneState): void {
    const gameStateComponent = getPacmanGameState(sceneState.entityManager);

    if (!gameStateComponent?.isPlaying) return;

    const playerEntity = getPacmanPlayerEntity(sceneState.entityManager);
    const playerPositionComponent = playerEntity?.getComponent(PositionComponent);
    const playerActorComponent = playerEntity?.getComponent(PacmanActorComponent);

    if (!playerPositionComponent || !playerActorComponent) return;

    const playerTile = getActorTile(this.level, playerPositionComponent.position, playerPositionComponent.size);

    if (!playerTile) return;

    getPacmanGhostEntities(sceneState.entityManager).forEach((entity) => {
      const ghostComponent = entity.getComponent(PacmanGhostComponent);
      const actorComponent = entity.getComponent(PacmanActorComponent);
      const positionComponent = entity.getComponent(PositionComponent);

      if (!ghostComponent || !actorComponent || !positionComponent || !ghostComponent.released) return;

      const currentTile = getActorTile(this.level, positionComponent.position, positionComponent.size);

      if (!currentTile) return;
      if (
        actorComponent.movementState === PACMAN_ACTOR_MOVEMENT_STATE.WALKING &&
        !isActorNearTileCenter(positionComponent.position, positionComponent.size, currentTile, ACTOR_TURN_TOLERANCE)
      ) {
        return;
      }

      const validDirections = this.getValidDirections(currentTile, actorComponent, ghostComponent);

      if (!validDirections.length) return;

      const targetTile = this.getTargetTile(
        ghostComponent,
        currentTile,
        playerTile,
        playerActorComponent.currentDirection,
        sceneState,
      );
      const nextDirection =
        ghostComponent.mode === PACMAN_GHOST_MODE.FRIGHTENED
          ? this.getFrightenedDirection(validDirections, currentTile, ghostComponent.ghostId)
          : this.getClosestDirection(validDirections, currentTile, targetTile);

      actorComponent.updateRequestedDirection(nextDirection);
      actorComponent.updateMovementState(PACMAN_ACTOR_MOVEMENT_STATE.WALKING);
    });
  }

  private getValidDirections(
    currentTile: IPacmanTile,
    actorComponent: PacmanActorComponent,
    ghostComponent: PacmanGhostComponent,
  ): IPacmanActorDirection[] {
    const canReverse =
      ghostComponent.mode === PACMAN_GHOST_MODE.FRIGHTENED ||
      ghostComponent.mode === PACMAN_GHOST_MODE.EATEN ||
      ghostComponent.mode === PACMAN_GHOST_MODE.RETURNING_HOME;

    const walkableDirections = DIRECTION_PRIORITY.filter((direction) => {
      if (!isDirectionWalkableFromTile(this.level, currentTile, direction)) return false;

      return canReverse || !isReverseDirection(actorComponent.currentDirection, direction);
    });

    if (walkableDirections.length > 0 || canReverse) return walkableDirections;

    return DIRECTION_PRIORITY.filter((direction) => isDirectionWalkableFromTile(this.level, currentTile, direction));
  }

  private getTargetTile(
    ghostComponent: PacmanGhostComponent,
    currentTile: IPacmanTile,
    playerTile: IPacmanTile,
    playerDirection: IPacmanActorDirection,
    sceneState: ISceneState,
  ): IPacmanGhostTileCoordinate {
    if (ghostComponent.mode === PACMAN_GHOST_MODE.RETURNING_HOME || ghostComponent.mode === PACMAN_GHOST_MODE.EATEN) {
      return ghostComponent.homeTile;
    }
    if (currentTile.type === PACMAN_TILE_TYPE.GHOST_HOUSE) {
      return isSameTile(currentTile, ghostComponent.houseEntryTile)
        ? ghostComponent.houseExitTile
        : ghostComponent.houseEntryTile;
    }
    if (ghostComponent.mode === PACMAN_GHOST_MODE.SCATTER || ghostComponent.mode === PACMAN_GHOST_MODE.FRIGHTENED) {
      return ghostComponent.scatterTargetTile;
    }

    switch (ghostComponent.ghostId) {
      case PACMAN_GHOST_ID.BLINKY:
        return playerTile;
      case PACMAN_GHOST_ID.PINKY:
        return this.getOffsetTile(playerTile, playerDirection, 4);
      case PACMAN_GHOST_ID.INKY:
        return this.getInkyTarget(playerTile, playerDirection, sceneState);
      case PACMAN_GHOST_ID.CLYDE:
        return getTileDistance(currentTile, playerTile) >= PACMAN_GHOST_CLYDE_CHASE_DISTANCE
          ? playerTile
          : ghostComponent.scatterTargetTile;
    }
  }

  private getInkyTarget(
    playerTile: IPacmanTile,
    playerDirection: IPacmanActorDirection,
    sceneState: ISceneState,
  ): IPacmanGhostTileCoordinate {
    const twoAhead = this.getOffsetTile(playerTile, playerDirection, 2);
    const blinkyEntity = getPacmanGhostEntities(sceneState.entityManager).find(
      (entity) => entity.getComponent(PacmanGhostComponent)?.ghostId === PACMAN_GHOST_ID.BLINKY,
    );
    const blinkyPositionComponent = blinkyEntity?.getComponent(PositionComponent);
    const blinkyTile = blinkyPositionComponent
      ? getActorTile(this.level, blinkyPositionComponent.position, blinkyPositionComponent.size)
      : undefined;

    if (!blinkyTile) return twoAhead;

    return {
      row: clampTileCoordinate(twoAhead.row + (twoAhead.row - blinkyTile.row), this.level.height),
      column: clampTileCoordinate(twoAhead.column + (twoAhead.column - blinkyTile.column), this.level.width),
    };
  }

  private getOffsetTile(
    tile: IPacmanTile,
    direction: IPacmanActorDirection,
    distance: number,
  ): IPacmanGhostTileCoordinate {
    const vector = getDirectionVector(direction);

    return {
      row: clampTileCoordinate(tile.row + vector.y * distance, this.level.height),
      column: clampTileCoordinate(tile.column + vector.x * distance, this.level.width),
    };
  }

  private getFrightenedDirection(
    validDirections: IPacmanActorDirection[],
    currentTile: IPacmanTile,
    ghostId: string,
  ): IPacmanActorDirection {
    const directionIndex = (currentTile.row * 7 + currentTile.column * 13 + ghostId.length) % validDirections.length;

    return validDirections[directionIndex];
  }

  private getClosestDirection(
    validDirections: IPacmanActorDirection[],
    currentTile: IPacmanTile,
    targetTile: IPacmanGhostTileCoordinate,
  ): IPacmanActorDirection {
    return validDirections.reduce((bestDirection, direction) => {
      const bestTile = getNextTile(this.level, currentTile, bestDirection) ?? currentTile;
      const nextTile = getNextTile(this.level, currentTile, direction) ?? currentTile;

      return getTileDistance(nextTile, targetTile) < getTileDistance(bestTile, targetTile) ? direction : bestDirection;
    }, validDirections[0]);
  }
}

const clampTileCoordinate = (coordinate: number, size: number): number => {
  return Math.min(size - 1, Math.max(0, coordinate));
};

const getTileDistance = (first: IPacmanGhostTileCoordinate, second: IPacmanGhostTileCoordinate): number => {
  return Math.hypot(first.row - second.row, first.column - second.column);
};

const isSameTile = (first: IPacmanGhostTileCoordinate, second: IPacmanGhostTileCoordinate): boolean => {
  return first.row === second.row && first.column === second.column;
};
