import { System } from '@game-engine/core/system';
import { PositionComponent } from '@game-engine/components/position.component';
import { PACMAN_SYSTEM } from '@pacman/constants/pacman-system.constant';
import type { ISceneState } from '@game-engine/interfaces/scene.interface';
import { PacmanActorComponent } from '@pacman/components/pacman-actor.component';
import { PacmanGhostComponent } from '@pacman/components/pacman-ghost.component';
import { intersects2dBoundingBox } from '@game-engine/utils/physics2d/boundingBoxCollision2d';
import {
  PACMAN_GHOST_MODE,
  PACMAN_GHOST_RETURNING_SPEED,
  PACMAN_GHOST_EATEN_SCORE_VALUES,
} from '@pacman/constants/pacman-ghost.constant';
import { getPacmanGameState, getPacmanGhostEntities, getPacmanPlayerEntity } from '@pacman/utils/pacman-entity.util';

export class PacmanGhostCollisionSystem extends System {
  public static readonly id = PACMAN_SYSTEM.GHOST_COLLISION;

  public update(sceneState: ISceneState): void {
    const gameStateComponent = getPacmanGameState(sceneState.entityManager);

    if (!gameStateComponent?.isPlaying) return;

    const playerPositionComponent = getPacmanPlayerEntity(sceneState.entityManager)?.getComponent(PositionComponent);

    if (!playerPositionComponent) return;

    for (const ghostEntity of getPacmanGhostEntities(sceneState.entityManager)) {
      const ghostComponent = ghostEntity.getComponent(PacmanGhostComponent);
      const ghostPositionComponent = ghostEntity.getComponent(PositionComponent);
      const ghostActorComponent = ghostEntity.getComponent(PacmanActorComponent);

      if (!ghostComponent || !ghostPositionComponent || !ghostActorComponent) continue;
      if (!intersects2dBoundingBox(playerPositionComponent.boundingBox, ghostPositionComponent.boundingBox)) continue;
      if (ghostComponent.mode === PACMAN_GHOST_MODE.RETURNING_HOME || ghostComponent.mode === PACMAN_GHOST_MODE.EATEN) {
        continue;
      }

      if (this.isGhostEdible(ghostComponent, gameStateComponent)) {
        ghostComponent.frightenedWindowId = gameStateComponent.frightenedWindowId;
        gameStateComponent.addGhostEatenScore(PACMAN_GHOST_EATEN_SCORE_VALUES);
        ghostComponent.markReturningHome();
        ghostActorComponent.updateSpeed(PACMAN_GHOST_RETURNING_SPEED);
        continue;
      }

      gameStateComponent.beginRespawn();
      return;
    }
  }

  private isGhostEdible(
    ghostComponent: PacmanGhostComponent,
    gameStateComponent: { isFrightenedModeActive: boolean; frightenedWindowId: number },
  ): boolean {
    if (ghostComponent.mode === PACMAN_GHOST_MODE.FRIGHTENED) return true;

    return (
      gameStateComponent.isFrightenedModeActive &&
      ghostComponent.frightenedWindowId !== gameStateComponent.frightenedWindowId
    );
  }
}
