import { EntityMocker } from './entity.mocker';
import { BaseMocker, type IMockParams } from './base.mocker';
import { CollisionComponent, type ICollisionComponentConstructor } from '@game-engine/components/collision.component';

export class CollisionComponentMocker extends BaseMocker<ICollisionComponentConstructor> {
  private readonly entityMocker = new EntityMocker();

  protected get model(): ICollisionComponentConstructor {
    return {
      entity: this.entityMocker.mock(),
      size: {
        height: this.factory.number.int({ min: 48 }),
        width: this.factory.number.int({ min: 48 }),
      },
    };
  }

  public override mock(params?: IMockParams<ICollisionComponentConstructor>): CollisionComponent {
    const constructor = super.mock(params);

    return new CollisionComponent(constructor);
  }
}
