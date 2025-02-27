import type { Callback, Values } from '@shared/types/util.type';
import type { IScene } from '@game-engine/interfaces/scene.interface';
import type { IObserver } from '@shared/interfaces/observer.interface';
import type { IBoundingBox } from '@shared/interfaces/coordinate.interface';

export const BASE_GAME_EVENTS = {
  DRAW_SPRITE: 'DrawSprite',
  LOAD_SPRITE_SHEET: 'LoadSpriteSheet',
};

export type IBaseGameEvent = Values<typeof BASE_GAME_EVENTS>;

export interface IGame<Events extends string = string, Listener extends Callback = Callback>
  extends IObserver<Events, Listener> {
  init(): void;
  start(): void;
  update(): void;
  destroy(): void;
  getActiveScenes(viewport: IBoundingBox): IScene[];
}
