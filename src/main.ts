import "./style.css";
import { Game } from "./entities/game.entity";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const context = canvas.getContext("2d");

if (context) {
  const game = new Game({ context });

  game.run();
}
