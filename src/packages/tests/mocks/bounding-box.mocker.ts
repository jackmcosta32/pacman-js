import { BaseMocker } from './base.mocker';
import type { IBoundingBox } from '@shared/interfaces/coordinate.interface';

export class BoundingBoxMocker extends BaseMocker<IBoundingBox> {
  protected get model(): IBoundingBox {
    return {
      x: this.factory.number.int({ max: 100, min: 0 }),
      y: this.factory.number.int({ max: 100, min: 0 }),
      width: this.factory.number.int({ max: 100, min: 50 }),
      height: this.factory.number.int({ max: 100, min: 50 }),
    };
  }
}
