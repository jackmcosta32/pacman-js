import { Scene } from '@game-engine/core/scene';
import { MENU_FONT } from '@pacman/config/asset.config';
import { TextEntityFactory } from '@game-engine/factories/text-entity.factory';

// TODO: How can I load a scene dynamically?
export const PacmanMainMenuScene = new Scene({
  id: 'main-menu',
  size: { width: 1280, height: 720 },
  viewport: { width: 1280, height: 720 },
  entities: [
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
  ],
});
