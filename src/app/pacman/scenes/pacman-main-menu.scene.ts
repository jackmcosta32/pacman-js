import { Scene } from '@game-engine/core/scene';
import { UIComponent } from '@game-engine/components/ui.component';
import { MENU_FONT } from '@pacman/config/pacman-asset.config';
import { EntityFactory } from '@game-engine/factories/entity.factory';
import { EntityManager } from '@game-engine/managers/entity.manager';
import { TextEntityFactory } from '@game-engine/factories/text-entity.factory';
import { PACMAN_SCENE } from '@pacman/constants/pacman-scene.constant';
import { PositionComponent } from '@game-engine/components/position.component';
import { PacmanMenuSystem } from '@pacman/systems/pacman-menu.system';
import { PacmanMenuItemComponent } from '@pacman/components/pacman-menu-item.component';
import { PACMAN_MENU_ACTION, PACMAN_MENU_ITEM } from '@pacman/constants/pacman-menu.constant';
import type { IEvent } from '@shared/interfaces/event.interface';
import type { IQueue } from '@shared/interfaces/queue.interface';

export const createPacmanMainMenuScene = (eventQueue: IQueue<IEvent>): Scene => {
  const entities = [
    TextEntityFactory.make({
      color: 'white',
      fontSize: 64,
      fontFamily: MENU_FONT.id,
      innerText: 'PAC-MAN',
      textAlign: 'center',
      position: { x: 640, y: 220 },
      size: { height: 64, width: 320 },
    }),
    TextEntityFactory.make({
      color: '#f8e6b0',
      fontSize: 18,
      fontFamily: MENU_FONT.id,
      innerText: 'ARROWS SELECT   ENTER START',
      textAlign: 'center',
      position: { x: 640, y: 286 },
      size: { height: 24, width: 360 },
    }),
    EntityFactory.with(
      new PacmanMenuItemComponent({
        order: 0,
        selected: true,
        label: 'START GAME',
        menuItem: PACMAN_MENU_ITEM.START_GAME,
        action: PACMAN_MENU_ACTION.START_MATCH,
      }),
    )
      .with(new UIComponent({ color: 'white', fontSize: 32, fontFamily: MENU_FONT.id, innerText: '> START GAME <' }))
      .with(new PositionComponent({ position: { x: 520, y: 364 }, size: { height: 36, width: 240 } }))
      .make(),
    EntityFactory.with(
      new PacmanMenuItemComponent({
        order: 1,
        label: 'RESET',
        menuItem: PACMAN_MENU_ITEM.RESET,
        action: PACMAN_MENU_ACTION.RESET_MENU,
      }),
    )
      .with(new UIComponent({ color: 'white', fontSize: 32, fontFamily: MENU_FONT.id, innerText: 'RESET' }))
      .with(new PositionComponent({ position: { x: 590, y: 426 }, size: { height: 36, width: 120 } }))
      .make(),
  ];

  return new Scene({
    eventQueue,
    systems: [new PacmanMenuSystem()],
    id: PACMAN_SCENE.MAIN_MENU,
    size: { width: 1280, height: 720 },
    viewport: { width: 1280, height: 720 },
    entityManager: new EntityManager({ entities }),
  });
};
