import { System } from '@game-engine/core/system';
import { PositionComponent } from '@game-engine/components/position.component';
import { PACMAN_SYSTEM } from '@pacman/constants/pacman-system.constant';
import type { ISceneState } from '@game-engine/interfaces/scene.interface';
import { getPacmanGameState, getPacmanGhostEntities, getPacmanPlayerEntity } from '@pacman/utils/pacman-entity.util';
import { intersects2dBoundingBox } from '@game-engine/utils/physics2d/boundingBoxCollision2d';

export class PacmanDeathSystem extends System {
  public static readonly id = PACMAN_SYSTEM.DEATH;

  public update(sceneState: ISceneState): void {
    const gameStateComponent = getPacmanGameState(sceneState.entityManager);

    if (!gameStateComponent?.isPlaying || gameStateComponent.isFrightenedModeActive) return;

    const playerPositionComponent = getPacmanPlayerEntity(sceneState.entityManager)?.getComponent(PositionComponent);

    if (!playerPositionComponent) return;

    const isTouchingGhost = getPacmanGhostEntities(sceneState.entityManager).some((entity) => {
      const ghostPositionComponent = entity.getComponent(PositionComponent);

      return (
        ghostPositionComponent &&
        intersects2dBoundingBox(playerPositionComponent.boundingBox, ghostPositionComponent.boundingBox)
      );
    });

    if (isTouchingGhost) {
      gameStateComponent.beginRespawn();
    }
  }
}
