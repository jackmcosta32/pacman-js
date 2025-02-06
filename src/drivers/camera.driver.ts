import { BaseDriver } from './base.driver';
import type { TCoordinates } from '../models/position.model';
import type { GameObject } from '../entities/game-object.entity';

export interface TCameraDriverConstructor {
  position: TCoordinates;
  context: CanvasRenderingContext2D;
}

export class CameraDriver extends BaseDriver {
  public position;
  private context;
  private target?: GameObject;

  constructor({ position, context }: TCameraDriverConstructor) {
    super();

    this.context = context;
    this.position = position;
  }

  public init() {
    this.context.save();
  }

  public unFollow() {
    this.target = undefined;
  }

  public follow(target: GameObject) {
    this.target = target;
  }

  public move(targetPosition: TCoordinates, damping?: number) {
    const canvas = this.context.canvas;

    this.position.x = Math.floor(canvas.width / 2 - targetPosition.x);
    this.position.y = Math.floor(canvas.height / 2 - targetPosition.y);

    // TODO: Add camera damping option
  }

  public update() {
    this.context.resetTransform();

    if (this.target) {
      this.move(this.target.boundingBoxCenterPosition);
    }

    this.context.translate(this.position.x, this.position.y);
  }
}
