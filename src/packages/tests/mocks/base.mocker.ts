import { faker, Faker } from '@faker-js/faker';
import type { IRange } from '@shared/interfaces/util.interface';

export type IMockParams<Model> = Partial<{
  [Key in keyof Model]: Model[Key] | ((factory: Faker) => Model[Key]);
}>;

export abstract class BaseMocker<Model> {
  protected factory = faker;

  protected abstract get model(): Model;

  public mockMany(quantity?: number | IRange, params?: IMockParams<Model>): Model[] {
    let length: number;

    switch (typeof quantity) {
      case 'number':
        length = quantity;
        break;

      case 'object':
        length = this.factory.number.int(quantity);
        break;

      default:
        length = 1;
        break;
    }

    return Array.from({ length }).map(() => this.mock(params));
  }

  public mock(params?: IMockParams<Model>): Model {
    const model = this.model;

    if (!params) return model;

    return Object.entries(params).reduce(
      (acc, [key, value]) => {
        let computedValue = value;

        if (typeof value === 'function') {
          computedValue = value(this.factory);
        }

        acc[key as keyof Model] = computedValue as Model[keyof Model];

        return acc;
      },
      { ...model },
    );
  }
}
