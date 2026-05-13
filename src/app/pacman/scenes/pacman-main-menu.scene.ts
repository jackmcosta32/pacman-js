import { Scene } from '@game-engine/core/scene';
import { MENU_FONT } from '@pacman/config/pacman-asset.config';
import { EntityManager } from '@game-engine/managers/entity.manager';
import { TextEntityFactory } from '@game-engine/factories/text-entity.factory';
import type { IEvent } from '@shared/interfaces/event.interface';
import type { IQueue } from '@shared/interfaces/queue.interface';

// TODO: How can I load a scene dynamically?
export const createPacmanMainMenuScene = (eventQueue: IQueue<IEvent>): Scene => {
  const entities = [
    TextEntityFactory.make({
      color: 'white',
      fontSize: 64,
      fontFamily: MENU_FONT.id,
      innerText: 'Pacman Game',
      position: { x: 480, y: 286 },
      size: { height: 16, width: 100 },
    }),
    TextEntityFactory.make({
      color: 'white',
      fontSize: 32,
      fontFamily: MENU_FONT.id,
      innerText: 'Start',
      position: { x: 640, y: 352 },
      size: { height: 16, width: 100 },
    }),
    TextEntityFactory.make({
      color: 'white',
      fontSize: 32,
      fontFamily: MENU_FONT.id,
      innerText: 'Exit',
      position: { x: 644, y: 416 },
      size: { height: 16, width: 100 },
    }),
  ];

  return new Scene({
    eventQueue,
    id: 'main-menu',
    size: { width: 1280, height: 720 },
    viewport: { width: 1280, height: 720 },
    entityManager: new EntityManager({ entities }),
  });
};
