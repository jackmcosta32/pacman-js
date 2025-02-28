import type { IComponent, IComponentConstructor, ISerializedComponent } from '@game-engine/interfaces/entity.interface';

export abstract class Component implements IComponent {
  public static readonly type: string;

  public get type() {
    return (this.constructor as IComponentConstructor<IComponent>).type;
  }

  public abstract serialize(): ISerializedComponent;
}
