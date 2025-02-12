import { GameWorld } from './game-world.entity';
import { InputDriver } from '@/drivers/input.driver';
import { CameraDriver } from '@/drivers/camera.driver';
import { DisplayDriver } from '@/drivers/display.driver';
import { SECONDS_PER_FRAME } from '@/config/game.config';

export interface TGameClientConstructor {
  context: CanvasRenderingContext2D;
}

export class GameClient {
  private gameWorld: GameWorld;
  private lastTimestamp: number;
  private inputDriver: InputDriver;
  private cameraDriver: CameraDriver;
  private displayDriver: DisplayDriver;

  constructor({ context }: TGameClientConstructor) {
    this.lastTimestamp = performance.now();

    // TODO: offload game logic to a web worker
    this.gameWorld = new GameWorld({ boundingBox: { x: 0, y: 0, height: 1000, width: 1000 } });

    this.cameraDriver = new CameraDriver({ context, position: { x: 0, y: 0 } });

    this.displayDriver = new DisplayDriver({ context });

    this.inputDriver = new InputDriver({
      onIdle: () => this.gameWorld.player!.actor.idle(),
      onMove: (direction) => this.gameWorld.player!.actor.move(direction),
    });
  }

  private async init() {
    await this.displayDriver.init();

    this.cameraDriver.init();
    this.inputDriver.init();
    this.gameWorld.init();
  }

  private update(timestamp?: number) {
    requestAnimationFrame((timestamp) => this.update(timestamp));

    if (timestamp) {
      const elapsed = timestamp - this.lastTimestamp;

      if (elapsed < SECONDS_PER_FRAME) return;

      this.lastTimestamp = timestamp - (elapsed % SECONDS_PER_FRAME);
    }

    this.gameWorld.update();
    this.cameraDriver.update();
    this.inputDriver.update();

    this.displayDriver.clear(this.cameraDriver.position);

    const visibleActors = this.gameWorld.queryVisibleActors(this.cameraDriver.boundingBox);

    visibleActors.forEach((actor) => this.displayDriver.draw(actor.sprite, actor.position));
  }

  public async run() {
    await this.init();

    this.cameraDriver.move(this.gameWorld.player!.actor.centerPosition);
    this.cameraDriver.follow(this.gameWorld.player!.actor);

    this.update(this.lastTimestamp);
  }
}
