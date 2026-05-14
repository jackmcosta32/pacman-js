import groupBy from 'lodash/groupBy';
import { Observer } from '@shared/patterns/observer';
import { Queue } from '@shared/data-structures/queue';
import { PACMAN_SCENE } from '@pacman/constants/pacman-scene.constant';
import { PACMAN_EVENT_TYPE } from '@pacman/constants/pacman-event.constant';
import { createPacmanGameScene } from '@pacman/scenes/pacman-game.scene';
import type { Callback } from '@shared/types/util.type';
import type { IGame } from '@shared/interfaces/game.interface';
import type { IEvent } from '@shared/interfaces/event.interface';
import type { IQueue } from '@shared/interfaces/queue.interface';
import type { IScene, ISerializedScene } from '@game-engine/interfaces/scene.interface';

// The game has one or more scenes
// Each scene has one or more entities
// Each scene has one or more systems
// Each entity has one or more components
// A system should be able to modify a entity

const EVENT_QUEUE_MAX_LENGTH = 100;

export class PacmanGame extends Observer<Callback<ISerializedScene>> implements IGame {
  private currentScene: IScene | undefined;
  private readonly eventQueue: IQueue<IEvent>;

  constructor() {
    super();

    this.eventQueue = new Queue<IEvent>({ maxLength: EVENT_QUEUE_MAX_LENGTH });
  }

  public loadScene(id: string): void {
    if (id === PACMAN_SCENE.CLASSIC_MATCH) {
      this.currentScene = createPacmanGameScene(this.eventQueue);
    }
  }

  public start(): void {
    this.loadScene(PACMAN_SCENE.CLASSIC_MATCH);

    if (!this.currentScene) {
      throw new Error('Scene not initialized');
    }

    this.currentScene.init();
  }

  public update(): void {
    if (!this.currentScene) {
      throw new Error('Scene not initialized');
    }

    const events = this.eventQueue.drain();

    if (events.some((event) => event.type === PACMAN_EVENT_TYPE.RESTART_REQUEST)) {
      this.currentScene.destroy();
      this.loadScene(PACMAN_SCENE.CLASSIC_MATCH);

      if (!this.currentScene) {
        throw new Error('Scene not initialized');
      }

      this.currentScene.init();
      this.notify(this.currentScene.serialize());

      return;
    }

    this.currentScene.update({
      eventQueue: this.eventQueue,
      eventMap: groupBy(events, 'type'),
    });

    this.notify(this.currentScene.serialize());
  }

  public readClientEvent(event?: IEvent): void {
    if (!event) return;

    this.eventQueue.enqueue(event);
  }

  public destroy(): void {
    this.currentScene?.destroy();
  }
}
