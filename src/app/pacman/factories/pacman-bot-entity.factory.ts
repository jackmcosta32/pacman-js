import { EntityFactory } from '@game-engine/factories/entity.factory';
import { PACMAN_ROLE } from '@pacman/constants/pacman-game-state.constant';
import { PacmanRoleComponent } from '@pacman/components/pacman-role.component';
import { PositionComponent, IPositionComponentConstructor } from '@game-engine/components/position.component';
import { SpriteComponent, type ISpriteComponentConstructor } from '@game-engine/components/sprite.component';

export type IMakePacmanBotEntityParams = ISpriteComponentConstructor & IPositionComponentConstructor;

export class PacmanBotEntityFactory {
  public static make(params: IMakePacmanBotEntityParams) {
    return EntityFactory.with(new PacmanRoleComponent({ role: PACMAN_ROLE.GHOST }))
      .with(new SpriteComponent(params))
      .with(new PositionComponent(params))
      .make();
  }
}
