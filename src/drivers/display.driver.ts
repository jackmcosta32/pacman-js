import { BaseDriver } from './base.driver';
import type { TSprite } from '@/models/animation.model';
import { SPRITES_IMAGE_SRC } from '@/config/game.config';
import type { TCoordinates } from '@/models/position.model';
import type { GameActor } from '@/entities/game-actor.entity';
import { DriverNotReadyError } from '@/errors/driver-not-ready.error';

export interface TDisplayDriverConstructor {
  actors: GameActor[];
  context: CanvasRenderingContext2D;
}

export class DisplayDriver extends BaseDriver {
  private actors: GameActor[];
  private sprites?: HTMLImageElement;
  private context: CanvasRenderingContext2D;

  constructor({ actors, context }: TDisplayDriverConstructor) {
    super();

    this.actors = actors;
    this.context = context;
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
      throw new DriverNotReadyError({ driverName: 'Display Driver' });
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
      sprite.height,
    );
  }

  public clear(position: TCoordinates) {
    const canvas = this.context.canvas;

    this.context.clearRect(position.x, position.y, canvas.width, canvas.height);
  }

  // TODO: Draw only visible actors
  public update() {
    this.actors.forEach((actor) => this.draw(actor.sprite, actor.position));
  }
}
