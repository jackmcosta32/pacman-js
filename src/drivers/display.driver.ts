import { BaseDriver } from "./base.driver";
import type { TSprite } from "../models/animation.model";
import { GameActor } from "../entities/game-actor.entity";
import type { TCoordinates } from "../models/position.model";
import { DriverNotReadyError } from "../errors/driver-not-ready.error";
import { SECONDS_PER_FRAME, SPRITES_IMAGE_SRC } from "../config/game.config";

export interface TDisplayDriverConstructor {
  actors: GameActor[];
  context: CanvasRenderingContext2D;
}

export class DisplayDriver extends BaseDriver {
  private actors: GameActor[];
  private lastTimestamp: number;
  private sprites?: HTMLImageElement;
  private context: CanvasRenderingContext2D;

  constructor({ actors, context }: TDisplayDriverConstructor) {
    super();

    this.actors = actors;
    this.context = context;
    this.lastTimestamp = performance.now();
  }

  public async init() {
    this.sprites = new Image();
    this.sprites.src = SPRITES_IMAGE_SRC;

    const { resolve, promise } = Promise.withResolvers<void>();

    this.sprites.onload = () => resolve();

    return promise;
  }

  // TODO: Handle pixel ratio
  public draw(sprite: TSprite, position: TCoordinates) {
    if (!this.sprites) {
      throw new DriverNotReadyError({ driverName: "Display Driver" });
    }

    this.context.drawImage(
      this.sprites,
      sprite.x,
      sprite.y,
      sprite.width,
      sprite.height,
      position.x,
      position.y,
      sprite.width,
      sprite.height
    );
  }

  protected clearDisplay() {
    const canvas = this.context.canvas;

    this.context.clearRect(0, 0, canvas.width, canvas.height);
  }

  public updateDisplay(timestamp?: number) {
    requestAnimationFrame((timestamp) => this.updateDisplay(timestamp));

    if (timestamp) {
      const elapsed = timestamp - this.lastTimestamp;

      if (elapsed < SECONDS_PER_FRAME) return;

      this.lastTimestamp = timestamp - (elapsed % SECONDS_PER_FRAME);
    }

    this.clearDisplay();

    this.actors.forEach((actor) => this.draw(actor.sprite, actor.position));
  }
}
