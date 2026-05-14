import { EntityFactory } from '@game-engine/factories/entity.factory';
import { ControlComponent } from '@game-engine/components/control.component';
import { PACMAN_ROLE } from '@pacman/constants/pacman-game-state.constant';
import { PacmanRoleComponent } from '@pacman/components/pacman-role.component';
import { SpriteComponent, type ISpriteComponentConstructor } from '@game-engine/components/sprite.component';
import { PositionComponent, IPositionComponentConstructor } from '@game-engine/components/position.component';
import { PacmanActorComponent, type IPacmanActorComponentConstructor } from '@pacman/components/pacman-actor.component';

export type IMakePacmanPlayerEntityParams = ISpriteComponentConstructor &
  IPositionComponentConstructor &
  IPacmanActorComponentConstructor;

export class PacmanPlayerEntityFactory {
  public static make(params: IMakePacmanPlayerEntityParams) {
    return EntityFactory.with(new PacmanActorComponent(params))
      .with(new PacmanRoleComponent({ role: PACMAN_ROLE.PLAYER }))
      .with(new SpriteComponent(params))
      .with(new PositionComponent(params))
      .with(new ControlComponent())
      .make();
  }
}
