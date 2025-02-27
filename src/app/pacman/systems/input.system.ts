import type { IEntity } from '@game-engine/interfaces/entity.interface';

export class InputSystem {
  private entitiesManager: unknown;
  private movementSystem: unknown;

  private handleGameEvent(event: IPacmanGameEvent, target: IEntity) {
    switch (event.type) {
      case PACMAN_EVENT.MOVE_UP:
        this.movementSystem.move(target, PACMAN_MOVEMENT.UP);
        break;
      case PACMAN_EVENT.MOVE_DOWN:
        this.movementSystem.move(target, PACMAN_MOVEMENT.DOWN);
        break;
      case PACMAN_EVENT.MOVE_LEFT:
        this.movementSystem.move(target, PACMAN_MOVEMENT.LEFT);
        break;
      case PACMAN_EVENT.MOVE_RIGHT:
        this.movementSystem.move(target, PACMAN_MOVEMENT.RIGHT);
        break;
    }
  }

  public update(input: IPacmanGameEvent[]) {
    if (!eventStream.length) return;

    eventStream.forEach((event) => {});
  }
}
