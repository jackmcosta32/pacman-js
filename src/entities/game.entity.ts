import { Ghost } from './ghost.entity';
import { Player } from './player.entity';
import { Pacman } from './pacman.entity';
import { GHOST_COLORS } from '../models/ghost.model';
import { InputDriver } from '../drivers/input.driver';
import { CameraDriver } from '../drivers/camera.driver';
import { SECONDS_PER_FRAME } from '../config/game.config';
import { DisplayDriver } from '../drivers/display.driver';

export interface TGameConstructor {
  context: CanvasRenderingContext2D;
}

export class Game {
  private player: Player;
  private lastTimestamp: number;
  private inputDriver: InputDriver;
  private cameraDriver: CameraDriver;
  private displayDriver: DisplayDriver;

  constructor({ context }: TGameConstructor) {
    const pacman = new Pacman();
    const ghost = new Ghost({ color: GHOST_COLORS.RED });
    const actors = [ghost, pacman];

    this.lastTimestamp = performance.now();

    this.player = new Player({ nickname: 'Jack', actor: ghost });

    this.cameraDriver = new CameraDriver({ context, position: { x: 0, y: 0 } });

    this.displayDriver = new DisplayDriver({ context, actors });

    this.inputDriver = new InputDriver({
      onIdle: () => this.player.actor.idle(),
      onMove: (direction) => this.player.actor.move(direction),
    });
  }

  private async init() {
    await this.displayDriver.init();

    this.cameraDriver.init();
    this.inputDriver.init();
  }

  private update(timestamp?: number) {
    requestAnimationFrame((timestamp) => this.update(timestamp));

    if (timestamp) {
      const elapsed = timestamp - this.lastTimestamp;

      if (elapsed < SECONDS_PER_FRAME) return;

      this.lastTimestamp = timestamp - (elapsed % SECONDS_PER_FRAME);
    }

    this.inputDriver.update();
    this.cameraDriver.update();

    this.displayDriver.clear(this.cameraDriver.position);

    this.displayDriver.update();
  }

  public async run() {
    await this.init();

    this.cameraDriver.move(this.player.actor.boundingBoxCenterPosition);
    this.cameraDriver.follow(this.player.actor);
    this.update(this.lastTimestamp);
  }
}
