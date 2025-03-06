import uniqueId from 'lodash/uniqueId';
import { Entity } from '@game-engine/core/entity';
import type { IComponent } from '@game-engine/interfaces/entity.interface';

export class EntityFactory {
  private static components: IComponent[] = [];

  private constructor() {}

  public static with(component: IComponent) {
    this.components.push(component);

    return this;
  }

  public static make() {
    const entity = new Entity({
      id: uniqueId(),
      components: this.components,
    });

    this.components = [];

    return entity;
  }
}
