import './style.css';
import { PacmanGame } from '@pacman/pacman-game';
import { PacmanGameClient } from '@pacman/pacman-game-client';
import { InputDriver } from '@game-client/drivers/input.driver';
import { AssetsDriver } from '@game-client/drivers/assets.driver';
import { GraphicsDriver } from '@game-client/drivers/graphics.driver';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const context = canvas.getContext('2d');

if (context) {
  const pacmanGame = new PacmanGame();

  const gameClient = new PacmanGameClient({
    game: pacmanGame,
    inputDriver: new InputDriver(),
    assetsDriver: new AssetsDriver(),
    graphicsDriver: new GraphicsDriver({ context }),
  });

  gameClient.start();
}
