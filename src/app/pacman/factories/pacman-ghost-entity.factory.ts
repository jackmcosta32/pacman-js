import { EntityFactory } from '@game-engine/factories/entity.factory';
import { PACMAN_ROLE } from '@pacman/constants/pacman-game-state.constant';
import { PacmanRoleComponent } from '@pacman/components/pacman-role.component';
import { SpriteComponent, type ISpriteComponentConstructor } from '@game-engine/components/sprite.component';
import { PositionComponent, type IPositionComponentConstructor } from '@game-engine/components/position.component';
import { PacmanActorComponent, type IPacmanActorComponentConstructor } from '@pacman/components/pacman-actor.component';
import { PacmanGhostComponent, type IPacmanGhostComponentConstructor } from '@pacman/components/pacman-ghost.component';

export type IMakePacmanGhostEntityParams = ISpriteComponentConstructor &
  IPositionComponentConstructor &
  IPacmanActorComponentConstructor &
  IPacmanGhostComponentConstructor;

export class PacmanGhostEntityFactory {
  public static make(params: IMakePacmanGhostEntityParams) {
    return EntityFactory.with(new PacmanActorComponent(params))
      .with(new PacmanGhostComponent(params))
      .with(new PacmanRoleComponent({ role: PACMAN_ROLE.GHOST }))
      .with(new SpriteComponent(params))
      .with(new PositionComponent(params))
      .make();
  }
}
