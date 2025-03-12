import type { ISceneState } from '@game-engine/interfaces/scene.interface';
import type { ISystemConstructor, ISerializedSystem, ISystem } from '@game-engine/interfaces/system.interface';

export abstract class System implements ISystem {
  public static readonly id: string;
  protected enabled = true;

  public get id() {
    return (this.constructor as ISystemConstructor<ISystem>).id;
  }

  public abstract update(sceneState: ISceneState): void;

  public serialize(): ISerializedSystem {
    return {
      id: this.id,
    };
  }
}
