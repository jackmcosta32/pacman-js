import type { ISize } from '@shared/interfaces/geometry.interface';
import type { IGameState } from '@shared/interfaces/game.interface';
import type { ISystem } from '@game-engine/interfaces/system.interface';
import type { IEntity, IEntityManager } from '@game-engine/interfaces/entity.interface';
import type { IScene, ISerializedScene } from '@game-engine/interfaces/scene.interface';

export interface ISceneConstructor {
  id: string;
  size: ISize;
  viewport: ISize;
  systems?: ISystem[];
  entities?: IEntity[];
  entityManager: IEntityManager;
}

export class Scene implements IScene {
  public readonly id: string;
  protected readonly size: ISize;
  private readonly viewport: ISize;
  protected readonly systems: ISystem[];
  private readonly entityManager: IEntityManager;
  protected lastUpdateTimestamp: number | undefined;

  constructor(params: ISceneConstructor) {
    this.id = params.id;
    this.size = params.size;
    this.viewport = params.viewport;
    this.entityManager = params.entityManager;
    this.systems = params.systems ?? [];
  }

  public update(gameState: IGameState): void {
    const currentTimeStamp = performance.now();

    let elapsed = 0;

    if (this.lastUpdateTimestamp) {
      elapsed = currentTimeStamp - this.lastUpdateTimestamp;
    }

    this.systems.forEach((system) =>
      system.update({
        elapsed,
        eventMap: gameState.eventMap,
        eventQueue: gameState.eventQueue,
        entityManager: this.entityManager,
      }),
    );

    this.lastUpdateTimestamp = currentTimeStamp;
  }

  public destroy() {
    this.entityManager.clear();
  }

  public serialize(): ISerializedScene {
    return {
      id: this.id,
      size: this.size,
      viewport: this.viewport,
      entities: this.entityManager.serialize(),
    };
  }
}
