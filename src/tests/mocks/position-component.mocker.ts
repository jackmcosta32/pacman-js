import { BaseMocker, type IMockParams } from './base.mocker';
import { PositionComponent, type IPositionComponentConstructor } from '@game-engine/components/position.component';

export class PositionComponentMocker extends BaseMocker<IPositionComponentConstructor> {
  protected get model(): IPositionComponentConstructor {
    return {
      size: {
        width: this.factory.number.int({ min: 48 }),
        height: this.factory.number.int({ min: 48 }),
      },
      position: {
        x: this.factory.number.int(),
        y: this.factory.number.int(),
      },
    };
  }

  public override mock(params?: IMockParams<IPositionComponentConstructor>) {
    const constructor = super.mock(params);

    return new PositionComponent(constructor);
  }
}
