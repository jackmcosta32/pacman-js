import { BaseMocker, type IMockParams } from './base.mocker';
import { Entity, IEntityConstructor } from '@game-engine/core/entity';
import type { IEntity } from '@game-engine/interfaces/entity.interface';

export class EntityMocker extends BaseMocker<IEntityConstructor> {
  protected get model(): IEntityConstructor {
    return {
      id: this.factory.string.uuid(),
    };
  }

  public override mock(params?: IMockParams<IEntityConstructor>): IEntity {
    const constructor = super.mock(params);

    return new Entity(constructor);
  }
}
