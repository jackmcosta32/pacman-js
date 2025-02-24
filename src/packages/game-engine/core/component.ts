import type { IComponent, IEntity } from '@game-engine/interfaces/entity.interface';

export abstract class Component implements IComponent {
  public abstract name: string;

  public abstract init(): void;

  public abstract update(timestamp: number, entity: IEntity): void;
}
