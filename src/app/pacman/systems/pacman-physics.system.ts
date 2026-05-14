import { System } from '@game-engine/core/system';
import { QuadTree } from '@shared/data-structures/quad-tree';
import type { IEntity } from '@game-engine/interfaces/entity.interface';
import { PACMAN_SYSTEM } from '@pacman/constants/pacman-system.constant';
import type { ISceneState } from '@game-engine/interfaces/scene.interface';
import { PACMAN_EVENT_TYPE } from '@pacman/constants/pacman-event.constant';
import { ControlComponent } from '@game-engine/components/control.component';
import { PositionComponent } from '@game-engine/components/position.component';
import { PacmanActorComponent } from '@pacman/components/pacman-actor.component';
import type { IPacmanMovementEvent } from '@pacman/interfaces/pacman-event.interface';
import type { IBoundingBox, ICoordinate } from '@shared/interfaces/coordinate.interface';
import { PACMAN_ACTOR_DIRECTION, PACMAN_ACTOR_MOVEMENT_STATE } from '@pacman/constants/pacman-actor.constant';
import type { IPacmanActorDirection, IPacmanActorMovementState } from '@pacman/interfaces/pacman-actor.interface';
import { intersects2dBoundingBox } from '@game-engine/utils/physics2d/boundingBoxCollision2d';

export interface IPacmanPhysicsSystemConstructor {
  entityTree: QuadTree;
}

export class PacmanPhysicsSystem extends System {
  public static readonly id = PACMAN_SYSTEM.PHYSICS;

  private readonly entityTree: QuadTree;

  constructor(params: IPacmanPhysicsSystemConstructor) {
    super();

    this.entityTree = params.entityTree;
  }

  public init(sceneState: ISceneState) {
    sceneState.entityManager.getEntities().forEach((entity) => {
      const positionComponent = entity.getComponent(PositionComponent);

      if (!positionComponent) return;

      this.entityTree.insertNode(entity.id, positionComponent.boundingBox);
    });
  }

  public updateEntityMovementState(
    entity: IEntity,
    movementState: IPacmanActorMovementState,
    direction: IPacmanActorDirection,
    elapsed: number,
  ) {
    const controlComponent = entity.getComponent(ControlComponent);

    if (!controlComponent) return;

    const positionComponent = entity.getComponent(PositionComponent);
    const actorComponent = entity.getComponent(PacmanActorComponent);

    if (!positionComponent || !actorComponent) return;

    actorComponent.updateDirection(direction);
    actorComponent.updateMovementState(movementState);

    if (movementState === PACMAN_ACTOR_MOVEMENT_STATE.IDLE) return;

    const currentPosition = positionComponent.position;

    let nextPosition: ICoordinate;
    const distance = actorComponent.speed * elapsed;

    switch (actorComponent.direction) {
      case PACMAN_ACTOR_DIRECTION.UP:
        nextPosition = { x: currentPosition.x, y: currentPosition.y - distance };
        break;
      case PACMAN_ACTOR_DIRECTION.DOWN:
        nextPosition = { x: currentPosition.x, y: currentPosition.y + distance };
        break;
      case PACMAN_ACTOR_DIRECTION.LEFT:
        nextPosition = { x: currentPosition.x - distance, y: currentPosition.y };
        break;
      default:
        nextPosition = { x: currentPosition.x + distance, y: currentPosition.y };
        break;
    }

    const boundingBox: IBoundingBox = {
      x: nextPosition.x,
      y: nextPosition.y,
      width: positionComponent.boundingBox.width,
      height: positionComponent.boundingBox.height,
    };

    const collisionCandidatesIds = this.entityTree.query(boundingBox);

    const collides = collisionCandidatesIds.some((id) => {
      const candidateBoundingBox = this.entityTree.getNode(id);

      if (id === entity.id || !candidateBoundingBox) return false;

      return intersects2dBoundingBox(boundingBox, candidateBoundingBox);
    });

    if (collides) return;

    positionComponent.updatePosition(nextPosition);

    this.entityTree.updateNode(entity.id, boundingBox);
  }

  public update(sceneState: ISceneState) {
    if (!sceneState.eventMap) return;

    const moveEvents = sceneState.eventMap[PACMAN_EVENT_TYPE.MOVEMENT] as IPacmanMovementEvent[];

    moveEvents?.forEach((event) => {
      sceneState.entityManager.getEntities().forEach((entity) => {
        this.updateEntityMovementState(entity, event.movementState, event.direction, sceneState.elapsed);
      });
    });
  }
}
