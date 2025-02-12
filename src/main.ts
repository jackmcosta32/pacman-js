import './style.css';
import { GameClient } from './entities/game-client.entity';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const context = canvas.getContext('2d');

if (context) {
  const gameClient = new GameClient({ context });

  gameClient.run();
}
