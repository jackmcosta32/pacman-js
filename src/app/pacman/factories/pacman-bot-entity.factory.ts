import { EntityFactory } from '@game-engine/factories/entity.factory';
import { PositionComponent, IPositionComponentConstructor } from '@game-engine/components/position.component';
import { SpriteComponent, type ISpriteComponentConstructor } from '@game-engine/components/sprite.component';

export type IMakePacmanBotEntityParams = ISpriteComponentConstructor & IPositionComponentConstructor;

export class PacmanBotEntityFactory {
  public static make(params: IMakePacmanBotEntityParams) {
    return EntityFactory.with(new SpriteComponent(params)).with(new PositionComponent(params)).make();
  }
}
