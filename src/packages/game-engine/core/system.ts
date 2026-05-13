import type { ISystemConstructor, ISerializedSystem, ISystem } from '@game-engine/interfaces/system.interface';

export abstract class System implements ISystem {
  public static readonly id: string;
  protected _enabled = true;

  public get id() {
    return (this.constructor as ISystemConstructor<ISystem>).id;
  }

  public get enabled() {
    return this._enabled;
  }

  public disable() {
    this._enabled = false;
  }

  public enable() {
    this._enabled = true;
  }

  public serialize(): ISerializedSystem {
    return {
      id: this.id,
    };
  }
}
