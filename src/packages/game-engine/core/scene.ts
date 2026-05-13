import type { IEvent } from '@shared/interfaces/event.interface';
import type { IQueue } from '@shared/interfaces/queue.interface';
import type { ISize } from '@shared/interfaces/geometry.interface';
import type { IGameState } from '@shared/interfaces/game.interface';
import type { ISystem } from '@game-engine/interfaces/system.interface';
import type { IEntityManager } from '@game-engine/interfaces/entity.interface';
import type { IScene, ISerializedScene } from '@game-engine/interfaces/scene.interface';

export interface ISceneConstructor {
  id: string;
  size: ISize;
  viewport: ISize;
  systems?: ISystem[];
  eventQueue: IQueue<IEvent>;
  entityManager: IEntityManager;
}

export class Scene implements IScene {
  public readonly id: string;
  protected readonly size: ISize;
  private readonly viewport: ISize;
  protected readonly systems: ISystem[];
  protected readonly eventQueue: IQueue<IEvent>;
  private readonly entityManager: IEntityManager;
  protected lastUpdateTimestamp: number | undefined;

  constructor(params: ISceneConstructor) {
    this.id = params.id;
    this.size = params.size;
    this.viewport = params.viewport;
    this.eventQueue = params.eventQueue;
    this.entityManager = params.entityManager;
    this.systems = params.systems ?? [];
  }

  public init(): void {
    this.systems.forEach((system) => {
      if (!system.init) return;

      system.init({
        elapsed: 0,
        eventQueue: this.eventQueue,
        entityManager: this.entityManager,
      });
    });
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
    this.systems.forEach((system) => {
      system.destroy({
        elapsed: 0,
        entityManager: this.entityManager,
      });
    });

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
