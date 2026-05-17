import { PACMAN_SCENE } from '@pacman/constants/pacman-scene.constant';
import { createPacmanGameScene } from '@pacman/scenes/pacman-game.scene';
import { createPacmanMainMenuScene } from '@pacman/scenes/pacman-main-menu.scene';
import type { Values } from '@shared/types/util.type';
import type { IEvent } from '@shared/interfaces/event.interface';
import type { IQueue } from '@shared/interfaces/queue.interface';
import type { IScene } from '@game-engine/interfaces/scene.interface';

export type IPacmanSceneId = Values<typeof PACMAN_SCENE>;
export type IPacmanSceneFactory = (eventQueue: IQueue<IEvent>) => IScene;

export const PACMAN_SCENE_REGISTRY: Record<IPacmanSceneId, IPacmanSceneFactory> = {
  [PACMAN_SCENE.MAIN_MENU]: createPacmanMainMenuScene,
  [PACMAN_SCENE.CLASSIC_MATCH]: createPacmanGameScene,
};

export const isPacmanSceneId = (id: string): id is IPacmanSceneId => {
  return Object.prototype.hasOwnProperty.call(PACMAN_SCENE_REGISTRY, id);
};
