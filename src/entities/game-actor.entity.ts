import type { TSprite, TSpriteMap } from '@/models/animation.model';
import { ACTOR_DIRECTION, ACTOR_STATE } from '@/models/game-actor.models';
import { GameObject, type TGameObjectConstructor } from './game-object.entity';

export interface TGameActorConstructor extends TGameObjectConstructor {
  speed: number;
  state?: ACTOR_STATE;
  spriteMap: TSpriteMap;
  direction?: ACTOR_DIRECTION;
}

export abstract class GameActor extends GameObject {
  protected speed;
  protected state;
  protected spriteMap;
  protected direction;

  constructor(props: TGameActorConstructor) {
    super(props);

    this.speed = props.speed;
    this.spriteMap = props.spriteMap;
    this.state = props.state ?? ACTOR_STATE.IDLE;
    this.direction = props.direction ?? ACTOR_DIRECTION.DOWN;
  }

  public move(direction: ACTOR_DIRECTION) {
    switch (direction) {
      case ACTOR_DIRECTION.UP:
        this.boundingBox.y -= this.speed;
        break;
      case ACTOR_DIRECTION.DOWN:
        this.boundingBox.y += this.speed;
        break;
      case ACTOR_DIRECTION.LEFT:
        this.boundingBox.x -= this.speed;
        break;
      case ACTOR_DIRECTION.RIGHT:
        this.boundingBox.x += this.speed;
        break;
    }

    this.direction = direction;
    this.state = ACTOR_STATE.WALKING;
  }

  public idle() {
    if (this.state === ACTOR_STATE.DESTROYED) return;

    this.spriteFrame = 0;
    this.state = ACTOR_STATE.IDLE;
  }

  // TODO: Refactor
  public get sprite(): TSprite {
    const nextSpriteGroup = this.spriteMap[this.state];

    if ('width' in nextSpriteGroup && 'height' in nextSpriteGroup) {
      return nextSpriteGroup as TSprite;
    }

    const sprites = nextSpriteGroup[this.direction];
    const nextSprite = sprites[this.spriteFrame];

    this.spriteFrame += 1;

    if (this.spriteFrame >= sprites.length) {
      this.spriteFrame = 0;
    }

    return nextSprite;
  }
}
