import { EntityFactory } from '@game-engine/factories/entity.factory';
import { PositionComponent, IPositionComponentConstructor } from '@game-engine/components/position.component';
import { SpriteComponent, type ISpriteComponentConstructor } from '@game-engine/components/sprite.component';

export type IMakePlayerEntityParams = ISpriteComponentConstructor & IPositionComponentConstructor;

export class PlayerEntityFactory {
  public static make(params: IMakePlayerEntityParams) {
    return EntityFactory.with(new SpriteComponent(params)).with(new PositionComponent(params)).make();
  }
}
