import { System } from '@game-engine/core/system';
import type { IEntity } from '@game-engine/interfaces/entity.interface';
import { PACMAN_SYSTEM } from '@pacman/constants/pacman-system.constant';
import { ACTOR_CENTER_TOLERANCE, ACTOR_TURN_TOLERANCE } from '@pacman/config/pacman-game.config';
import type { ISceneState } from '@game-engine/interfaces/scene.interface';
import { PACMAN_EVENT_TYPE } from '@pacman/constants/pacman-event.constant';
import { ControlComponent } from '@game-engine/components/control.component';
import { PositionComponent } from '@game-engine/components/position.component';
import { PacmanActorComponent } from '@pacman/components/pacman-actor.component';
import type { IPacmanMovementRequestEvent } from '@pacman/interfaces/pacman-event.interface';
import { PACMAN_ACTOR_MOVEMENT_STATE } from '@pacman/constants/pacman-actor.constant';
import type { IPacmanActorDirection } from '@pacman/interfaces/pacman-actor.interface';
import type { IPacmanParsedLevel, IPacmanTile } from '@pacman/interfaces/pacman-level.interface';
import {
  canExitTunnel,
  getActorTile,
  getNextTile,
  getProjectedBoundingBox,
  getTranslatedPosition,
  getTunnelExitPosition,
  isActorNearTileCenter,
  isBoundingBoxOutsideLevel,
  isDirectionWalkableFromTile,
  isReverseDirection,
  isSameAxisDirection,
  snapActorPerpendicularToTileCenter,
  snapActorToTileCenter,
} from '@pacman/utils/pacman-movement.util';

export interface IPacmanMovementSystemConstructor {
  level: IPacmanParsedLevel;
}

interface IResolvedMovementPosition {
  blocked: boolean;
  position: { x: number; y: number };
}

export class PacmanMovementSystem extends System {
  public static readonly id = PACMAN_SYSTEM.MOVEMENT;

  private readonly level: IPacmanParsedLevel;

  constructor(params: IPacmanMovementSystemConstructor) {
    super();

    this.level = params.level;
  }

  public update(sceneState: ISceneState) {
    const movementRequest = this.getLatestMovementRequest(sceneState);

    sceneState.entityManager.getEntities().forEach((entity) => {
      this.updateEntityMovement(entity, sceneState.elapsed, movementRequest?.direction);
    });
  }

  public updateEntityMovement(entity: IEntity, elapsed: number, requestedDirection?: IPacmanActorDirection): void {
    const controlComponent = entity.getComponent(ControlComponent);

    if (!controlComponent) return;

    const positionComponent = entity.getComponent(PositionComponent);
    const actorComponent = entity.getComponent(PacmanActorComponent);

    if (!positionComponent || !actorComponent) return;

    if (requestedDirection) {
      actorComponent.updateRequestedDirection(requestedDirection);
    }

    let currentTile = getActorTile(this.level, positionComponent.position, positionComponent.size);

    if (!currentTile) {
      actorComponent.updateMovementState(PACMAN_ACTOR_MOVEMENT_STATE.IDLE);

      return;
    }

    const positionAfterTurn = this.applyRequestedDirection(
      actorComponent,
      positionComponent,
      currentTile,
      requestedDirection !== undefined,
    );

    if (positionAfterTurn) {
      positionComponent.updatePosition(positionAfterTurn);
    }

    if (actorComponent.movementState === PACMAN_ACTOR_MOVEMENT_STATE.IDLE || elapsed <= 0) return;

    let remainingDistance = actorComponent.speed * elapsed;

    while (remainingDistance > 0 && actorComponent.movementState === PACMAN_ACTOR_MOVEMENT_STATE.WALKING) {
      currentTile = getActorTile(this.level, positionComponent.position, positionComponent.size);

      if (!currentTile) {
        actorComponent.updateMovementState(PACMAN_ACTOR_MOVEMENT_STATE.IDLE);

        return;
      }

      const positionAfterBufferedTurn = this.applyRequestedDirection(
        actorComponent,
        positionComponent,
        currentTile,
        false,
      );

      if (positionAfterBufferedTurn) {
        positionComponent.updatePosition(positionAfterBufferedTurn);
        currentTile = getActorTile(this.level, positionComponent.position, positionComponent.size);

        if (!currentTile) {
          actorComponent.updateMovementState(PACMAN_ACTOR_MOVEMENT_STATE.IDLE);

          return;
        }
      }

      const stepDistance = Math.min(remainingDistance, this.getMaxMovementStepDistance());
      const alignedPosition = snapActorPerpendicularToTileCenter(
        positionComponent.position,
        positionComponent.size,
        currentTile,
        actorComponent.currentDirection,
        ACTOR_CENTER_TOLERANCE,
      );
      const nextPosition = getTranslatedPosition(alignedPosition, actorComponent.currentDirection, stepDistance);
      const resolvedMovement = this.resolveMovementPosition(
        nextPosition,
        positionComponent.size,
        currentTile,
        actorComponent.currentDirection,
      );

      if (!resolvedMovement) {
        actorComponent.updateMovementState(PACMAN_ACTOR_MOVEMENT_STATE.IDLE);

        return;
      }

      positionComponent.updatePosition(resolvedMovement.position);

      if (resolvedMovement.blocked) {
        actorComponent.updateMovementState(PACMAN_ACTOR_MOVEMENT_STATE.IDLE);
      }

      remainingDistance -= stepDistance;
    }
  }

  private getLatestMovementRequest(sceneState: ISceneState): IPacmanMovementRequestEvent | undefined {
    const movementRequests = sceneState.eventMap[PACMAN_EVENT_TYPE.MOVEMENT_REQUEST] as
      | IPacmanMovementRequestEvent[]
      | undefined;

    return movementRequests?.[movementRequests.length - 1];
  }

  private applyRequestedDirection(
    actorComponent: PacmanActorComponent,
    positionComponent: PositionComponent,
    currentTile: IPacmanTile,
    hasNewRequest: boolean,
  ) {
    if (actorComponent.movementState === PACMAN_ACTOR_MOVEMENT_STATE.IDLE && !hasNewRequest) return;

    const requestedDirection = actorComponent.requestedDirection;
    const canReverse = isReverseDirection(actorComponent.currentDirection, requestedDirection);
    const canContinueSameAxis = isSameAxisDirection(actorComponent.currentDirection, requestedDirection);
    const canTurnFromCenter = isActorNearTileCenter(
      positionComponent.position,
      positionComponent.size,
      currentTile,
      ACTOR_TURN_TOLERANCE,
    );
    const canUseRequestedDirection =
      isDirectionWalkableFromTile(this.level, currentTile, requestedDirection) &&
      (canReverse || canContinueSameAxis || canTurnFromCenter);

    if (!canUseRequestedDirection) return;

    actorComponent.updateCurrentDirection(requestedDirection);
    actorComponent.updateMovementState(PACMAN_ACTOR_MOVEMENT_STATE.WALKING);

    if (canReverse || canContinueSameAxis) return;

    return snapActorToTileCenter(positionComponent.size, currentTile);
  }

  private resolveMovementPosition(
    nextPosition: { x: number; y: number },
    size: { width: number; height: number },
    currentTile: IPacmanTile,
    direction: IPacmanActorDirection,
  ): IResolvedMovementPosition | undefined {
    const boundingBox = getProjectedBoundingBox(nextPosition, size);

    if (isBoundingBoxOutsideLevel(this.level, boundingBox)) {
      if (!canExitTunnel(this.level, currentTile, direction)) return;

      const tunnelExitPosition = getTunnelExitPosition(this.level, currentTile, size);

      if (!tunnelExitPosition) return;

      return { blocked: false, position: tunnelExitPosition };
    }

    if (this.level.getBlockingTilesForBoundingBox(boundingBox).length === 0) {
      return { blocked: false, position: nextPosition };
    }

    const nextTile = getNextTile(this.level, currentTile, direction);

    if (!nextTile) return;

    return {
      blocked: true,
      position: this.getClampedPositionBeforeTile(nextPosition, size, nextTile, direction),
    };
  }

  private getMaxMovementStepDistance(): number {
    return Math.max(1, this.level.tileSize / 2);
  }

  private getClampedPositionBeforeTile(
    nextPosition: { x: number; y: number },
    size: { width: number; height: number },
    blockingTile: IPacmanTile,
    direction: IPacmanActorDirection,
  ) {
    switch (direction) {
      case 'up':
        return { ...nextPosition, y: blockingTile.position.y + blockingTile.size.height };
      case 'down':
        return { ...nextPosition, y: blockingTile.position.y - size.height };
      case 'left':
        return { ...nextPosition, x: blockingTile.position.x + blockingTile.size.width };
      case 'right':
        return { ...nextPosition, x: blockingTile.position.x - size.width };
    }
  }
}
