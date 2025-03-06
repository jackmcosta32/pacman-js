import { EntityFactory } from './entity.factory';
import { UIComponent, IUIComponentConstructor } from '@game-engine/components/ui.component';
import { PositionComponent, IPositionComponentConstructor } from '@game-engine/components/position.component';

export type IMakeTextEntityParams = IUIComponentConstructor & IPositionComponentConstructor;

export class TextEntityFactory {
  public static make(params: IMakeTextEntityParams) {
    return EntityFactory.with(new UIComponent(params)).with(new PositionComponent(params)).make();
  }
}
