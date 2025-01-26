import { Ghost } from "./ghost.entity";
import { Player } from "./player.entity";
import { Pacman } from "./pacman.entity";
import { DisplayDriver } from "../drivers/display.driver";
import { PlayerControlsDriver } from "../drivers/player-controls.driver";

export interface TGameConstructor {
  context: CanvasRenderingContext2D;
}

export class Game {
  private player: Player;
  private displayDriver: DisplayDriver;
  private playerControlsDriver: PlayerControlsDriver;

  constructor({ context }: TGameConstructor) {
    const ghost = new Ghost();
    const pacman = new Pacman();
    const actors = [ghost, pacman];

    this.player = new Player({ nickname: "Jack", actor: pacman });

    this.displayDriver = new DisplayDriver({ context, actors });

    this.playerControlsDriver = new PlayerControlsDriver({
      onIdle: () => this.player.actor.idle(),
      onMove: (direction) => this.player.actor.move(direction),
    });
  }

  private async init() {
    await this.displayDriver.init();

    this.playerControlsDriver.init();
  }

  public async run() {
    await this.init();

    this.displayDriver.updateDisplay();
  }
}
