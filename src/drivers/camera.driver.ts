import { BaseDriver } from './base.driver';
import type { TCoordinates } from '@/models/position.model';
import { CAMERA_DEFAULT_DAMPING } from '@/config/game.config';
import type { GameObject } from '@/entities/game-object.entity';
import type { TBoundingBox } from '@/models/bounding-box.model';

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

  public move(position: TCoordinates, damping?: number) {
    const canvas = this.context.canvas;

    const targetX = Math.floor(position.x - canvas.width / 2);
    const targetY = Math.floor(position.y - canvas.height / 2);

    if (damping && this.position) {
      this.position.x += Math.floor((targetX - this.position.x) * damping);
      this.position.y += Math.floor((targetY - this.position.y) * damping);
    } else {
      this.position.x = targetX;
      this.position.y = targetY;
    }
  }

  public update() {
    this.context.resetTransform();

    if (this.target) {
      this.move(this.target.centerPosition, CAMERA_DEFAULT_DAMPING);
    }

    this.context.translate(-this.position.x, -this.position.y);
  }

  public get boundingBox(): TBoundingBox {
    return {
      x: this.position.x,
      y: this.position.y,
      width: this.context.canvas.width,
      height: this.context.canvas.height,
    };
  }
}
