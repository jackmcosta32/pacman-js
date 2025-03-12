import type {
  IComponent,
  ISerializedComponent,
  IComponentConstructor,
} from '@game-engine/interfaces/component.interface';

export abstract class Component implements IComponent {
  public static readonly type: string;

  public get type() {
    return (this.constructor as IComponentConstructor<IComponent>).type;
  }

  public abstract serialize(): ISerializedComponent;
}
