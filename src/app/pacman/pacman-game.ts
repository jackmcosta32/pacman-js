// TODO: Scenes need to be loaded dynamically
import { PacmanGameScene } from './scenes/pacman-game.scene';
import { PacmanMainMenuScene } from './scenes/pacman-main-menu.scene';

import { Observer } from '@shared/patterns/observer';
import type { Callback } from '@shared/types/util.type';
import type { IGame } from '@shared/interfaces/game.interface';
import type { IEvent } from '@shared/interfaces/event.interface';
import type { IScene, ISerializedScene } from '@game-engine/interfaces/scene.interface';

// The game has one or more scenes
// Each scene has one or more entities
// Each scene has one or more systems
// Each entity has one or more components
// A system should be able to modify a entity

export class PacmanGame extends Observer<Callback<ISerializedScene>> implements IGame {
  private currentScene: IScene | undefined;
  private eventBus: Array<IEvent> = [];

  public loadScene(id: string): void {
    this.currentScene = PacmanGameScene;
  }

  public init(): void {
    throw new Error('Method not implemented.');
  }

  public start(): void {
    this.currentScene = PacmanGameScene;
  }

  public update(): void {
    if (!this.currentScene) {
      throw new Error('Scene not initialized');
    }

    this.currentScene.update({
      events: this.eventBus,
    });

    this.notify(this.currentScene.serialize());
    this.eventBus = [];
  }

  public readClientEvent(event?: IEvent): void {
    if (!event) return;

    this.eventBus.push(event);
  }

  public destroy(): void {
    this.currentScene?.destroy();
  }
}
