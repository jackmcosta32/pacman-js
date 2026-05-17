import groupBy from 'lodash/groupBy';
import { Observer } from '@shared/patterns/observer';
import { Queue } from '@shared/data-structures/queue';
import { PACMAN_SCENE } from '@pacman/constants/pacman-scene.constant';
import { PACMAN_EVENT_TYPE } from '@pacman/constants/pacman-event.constant';
import { PACMAN_MENU_ACTION, PACMAN_MENU_NAVIGATION_DIRECTION } from '@pacman/constants/pacman-menu.constant';
import { PACMAN_COMPONENT_TYPE } from '@pacman/constants/pacman-component.constant';
import { isPacmanSceneId, PACMAN_SCENE_REGISTRY } from '@pacman/scenes/pacman-scene.registry';
import type { Callback } from '@shared/types/util.type';
import type { IGame } from '@shared/interfaces/game.interface';
import type { IEvent } from '@shared/interfaces/event.interface';
import type { IQueue } from '@shared/interfaces/queue.interface';
import type { IScene, ISerializedScene } from '@game-engine/interfaces/scene.interface';
import type { ISerializedPacmanMenuItemComponent } from '@pacman/components/pacman-menu-item.component';

const EVENT_QUEUE_MAX_LENGTH = 100;

export class PacmanGame extends Observer<Callback<ISerializedScene>> implements IGame {
  private currentScene: IScene | undefined;
  private readonly eventQueue: IQueue<IEvent>;

  constructor() {
    super();

    this.eventQueue = new Queue<IEvent>({ maxLength: EVENT_QUEUE_MAX_LENGTH });
  }

  public loadScene(id: string): void {
    if (!isPacmanSceneId(id)) {
      throw new Error(`Unknown Pac-Man scene id: ${id}`);
    }

    const previousScene = this.currentScene;
    const nextScene = PACMAN_SCENE_REGISTRY[id](this.eventQueue);

    previousScene?.destroy();
    this.eventQueue.clear();

    this.currentScene = nextScene;
    this.currentScene.init();
    this.notify(this.currentScene.serialize());
  }

  public start(): void {
    this.loadScene(PACMAN_SCENE.MAIN_MENU);
  }

  public update(): void {
    if (!this.currentScene) {
      throw new Error('Scene not initialized');
    }

    const events = this.eventQueue.drain();
    const transitionSceneId = this.consumeTransitionSceneId(events);

    if (transitionSceneId) {
      this.loadScene(transitionSceneId);
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
    this.currentScene = undefined;
    this.eventQueue.clear();
  }

  private consumeTransitionSceneId(events: IEvent[]): string | undefined {
    if (events.some((event) => event.type === PACMAN_EVENT_TYPE.RETURN_TO_MENU_REQUEST)) {
      return PACMAN_SCENE.MAIN_MENU;
    }

    if (
      events.some(
        (event) =>
          event.type === PACMAN_EVENT_TYPE.RESTART_REQUEST || event.type === PACMAN_EVENT_TYPE.START_MATCH_REQUEST,
      )
    ) {
      return PACMAN_SCENE.CLASSIC_MATCH;
    }

    if (events.some((event) => event.type === PACMAN_EVENT_TYPE.MENU_SELECT)) {
      return this.getSelectedMenuSceneId(events);
    }
  }

  private getSelectedMenuSceneId(events: IEvent[]): string | undefined {
    if (this.currentScene?.id !== PACMAN_SCENE.MAIN_MENU) return;

    const menuItems = this.currentScene
      .serialize()
      .entities.map(
        (entity) =>
          entity.components[PACMAN_COMPONENT_TYPE.MENU_ITEM_COMPONENT] as
            | ISerializedPacmanMenuItemComponent
            | undefined,
      )
      .filter((component): component is ISerializedPacmanMenuItemComponent => Boolean(component))
      .sort((left, right) => left.order - right.order);

    if (!menuItems.length) return;

    let selectedIndex = Math.max(
      0,
      menuItems.findIndex((component) => component.selected),
    );

    for (const event of events) {
      if (event.type === PACMAN_EVENT_TYPE.MENU_NAVIGATE) {
        const directionDelta = event.direction === PACMAN_MENU_NAVIGATION_DIRECTION.PREVIOUS ? -1 : 1;

        selectedIndex = (selectedIndex + directionDelta + menuItems.length) % menuItems.length;
      }

      if (event.type === PACMAN_EVENT_TYPE.MENU_SELECT) break;
    }

    const selectedMenuItem = menuItems[selectedIndex];

    switch (selectedMenuItem?.action) {
      case PACMAN_MENU_ACTION.START_MATCH:
        return PACMAN_SCENE.CLASSIC_MATCH;
      case PACMAN_MENU_ACTION.RESET_MENU:
        return PACMAN_SCENE.MAIN_MENU;
    }
  }
}
