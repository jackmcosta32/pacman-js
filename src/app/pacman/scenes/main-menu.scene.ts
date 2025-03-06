import { Scene } from '@game-engine/core/scene';
import { MENU_FONT } from '@pacman/config/asset.configs';
import { TextEntityFactory } from '@game-engine/factories/text-entity.factory';

// TODO: How can I load a scene dynamically?
export const MainMenuScene = new Scene({
  size: { width: 100, height: 100 },
  entities: [
    TextEntityFactory.make({
      color: 'white',
      fontSize: 12,
      fontFamily: MENU_FONT.id,
      innerText: 'Hello World',
      position: { x: 50, y: 50 },
      size: { height: 16, width: 100 },
    }),
  ],
});
