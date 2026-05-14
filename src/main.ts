import './style.css';
import { PacmanGame } from '@pacman/pacman-game';
import { PacmanGameClient } from '@pacman/pacman-game-client';
import { InputDriver } from '@game-client/drivers/input.driver';
import { AudioDriver } from '@game-client/drivers/audio.driver';
import { AssetsDriver } from '@game-client/drivers/assets.driver';
import { GraphicsDriver } from '@game-client/drivers/graphics.driver';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const context = canvas.getContext('2d');

if (context) {
  const inputDriver = new InputDriver();
  const assetsDriver = new AssetsDriver();
  const audioDriver = new AudioDriver({ assetsDriver });
  const graphicsDriver = new GraphicsDriver({ context, assetsDriver });

  const pacmanGame = new PacmanGame();

  const gameClient = new PacmanGameClient({
    inputDriver,
    audioDriver,
    assetsDriver,
    graphicsDriver,
    game: pacmanGame,
  });

  gameClient.start();
}
