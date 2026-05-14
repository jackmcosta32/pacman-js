import { System } from '@game-engine/core/system';
import { PositionComponent } from '@game-engine/components/position.component';
import { PACMAN_SYSTEM } from '@pacman/constants/pacman-system.constant';
import { PACMAN_SOUND_EFFECT } from '@pacman/constants/pacman-game-state.constant';
import type { ISceneState } from '@game-engine/interfaces/scene.interface';
import { PACMAN_COLLECTIBLE_TYPE } from '@pacman/constants/pacman-level.constant';
import { getPacmanGameState, getPacmanPlayerEntity } from '@pacman/utils/pacman-entity.util';
import { intersects2dBoundingBox } from '@game-engine/utils/physics2d/boundingBoxCollision2d';
import { PacmanCollectibleComponent } from '@pacman/components/pacman-collectible.component';

export class PacmanCollectionSystem extends System {
  public static readonly id = PACMAN_SYSTEM.COLLECTION;

  public update(sceneState: ISceneState): void {
    const gameStateComponent = getPacmanGameState(sceneState.entityManager);

    if (!gameStateComponent?.isPlaying) return;

    const playerPositionComponent = getPacmanPlayerEntity(sceneState.entityManager)?.getComponent(PositionComponent);

    if (!playerPositionComponent) return;

    sceneState.entityManager.getEntities().forEach((entity) => {
      const collectibleComponent = entity.getComponent(PacmanCollectibleComponent);
      const collectiblePositionComponent = entity.getComponent(PositionComponent);

      if (!collectibleComponent || !collectiblePositionComponent) return;
      if (!intersects2dBoundingBox(playerPositionComponent.boundingBox, collectiblePositionComponent.boundingBox)) return;

      sceneState.entityManager.removeEntity(entity.id);
      gameStateComponent.addScore(collectibleComponent.scoreValue);
      gameStateComponent.collectOne();

      if (collectibleComponent.collectibleType === PACMAN_COLLECTIBLE_TYPE.POWER_PELLET) {
        gameStateComponent.startFrightenedMode();
        gameStateComponent.queueSound(PACMAN_SOUND_EFFECT.POWER_PELLET);
        return;
      }

      gameStateComponent.queueSound(PACMAN_SOUND_EFFECT.PELLET);
    });
  }
}
