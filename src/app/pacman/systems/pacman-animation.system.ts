import { System } from '@game-engine/core/system';
import type { IEntity } from '@game-engine/interfaces/entity.interface';
import { PACMAN_SYSTEM } from '@pacman/constants/pacman-system.constant';
import type { ISceneState } from '@game-engine/interfaces/scene.interface';
import { SpriteComponent } from '@game-engine/components/sprite.component';
import { PacmanActorComponent } from '@pacman/components/pacman-actor.component';
import { getPacmanGameState } from '@pacman/utils/pacman-entity.util';

export class PacmanAnimationSystem extends System {
  public static readonly id = PACMAN_SYSTEM.ANIMATION;

  public updateEntityAnimationFrame(entity: IEntity, elapsed: number) {
    const spriteComponent = entity.getComponent(SpriteComponent);

    if (!spriteComponent) return;

    const actorComponent = entity.getComponent(PacmanActorComponent);

    if (actorComponent?.spriteFrames) {
      spriteComponent.updateSpriteFrames(actorComponent.spriteFrames);
    }

    spriteComponent.updateAnimationFrame(elapsed);
  }

  public update(sceneState: ISceneState) {
    const gameStateComponent = getPacmanGameState(sceneState.entityManager);

    if (gameStateComponent && !gameStateComponent.isPlaying) return;

    sceneState.entityManager.forEachEntity((entity) => this.updateEntityAnimationFrame(entity, sceneState.elapsed));
  }
}
