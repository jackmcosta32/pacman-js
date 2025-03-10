import type { ISystem } from '@game-engine/interfaces/scene.interface';
import type { IEntity } from '@game-engine/interfaces/entity.interface';
import type { ICoordinate } from '@shared/interfaces/coordinate.interface';
import { PositionComponent } from '@game-engine/components/position.component';
import { PacmanActorComponent } from '@pacman/components/pacman-actor.component';
import { PACMAN_ACTOR_DIRECTION, PACMAN_ACTOR_MOVEMENT_STATE } from '@pacman/constants/pacman-actor.constant';

export class PacmanActorMovementSystem implements ISystem {
  public update(entity: IEntity) {
    const positionComponent = entity.getComponent(PositionComponent);
    const actorComponent = entity.getComponent(PacmanActorComponent);

    if (!positionComponent || !actorComponent) return;

    if (actorComponent.movementState === PACMAN_ACTOR_MOVEMENT_STATE.IDLE) return;

    const currentPosition = positionComponent.position;

    let nextPosition: ICoordinate;
    const distance = 0.1;

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

    // TODO: Check collisions
    actorComponent.updateMovementState(PACMAN_ACTOR_MOVEMENT_STATE.WALKING);
    positionComponent.updatePosition(nextPosition);
  }
}
