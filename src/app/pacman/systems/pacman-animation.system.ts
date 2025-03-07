import type { IEntity } from '@game-engine/interfaces/entity.interface';
import { SpriteComponent } from '@game-engine/components/sprite.component';
import { PacmanActorComponent } from '@pacman/components/pacman-actor.component';

export class PacmanAnimationSystem {
  public update(entity: IEntity) {
    const spriteComponent = entity.getComponent(SpriteComponent);

    if (!spriteComponent) return;

    const actorComponent = entity.getComponent(PacmanActorComponent);

    if (actorComponent?.spriteFrames) {
      spriteComponent.updateSpriteFrames(actorComponent.spriteFrames);
    }

    spriteComponent.updateAnimationFrame();
  }
}
