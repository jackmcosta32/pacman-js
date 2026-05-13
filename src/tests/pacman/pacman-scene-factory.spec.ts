import { describe, expect, it } from 'vitest';
import { Queue } from '@shared/data-structures/queue';
import { createPacmanGameScene } from '@pacman/scenes/pacman-game.scene';
import { createPacmanMainMenuScene } from '@pacman/scenes/pacman-main-menu.scene';
import type { IEvent } from '@shared/interfaces/event.interface';

const makeEventQueue = () => new Queue<IEvent>({ maxLength: 10 });

describe('Pac-Man - Scene factories', () => {
  it('should create fresh classic match scene state for each call', () => {
    const eventQueue = makeEventQueue();
    const firstScene = createPacmanGameScene(eventQueue);
    const secondScene = createPacmanGameScene(eventQueue);
    const secondSceneInitialEntities = secondScene.serialize().entities;

    firstScene.destroy();

    expect(firstScene).not.toBe(secondScene);
    expect(secondSceneInitialEntities.length).toBeGreaterThan(0);
    expect(secondScene.serialize().entities).toEqual(secondSceneInitialEntities);
  });

  it('should create fresh main menu scene state for each call', () => {
    const eventQueue = makeEventQueue();
    const firstScene = createPacmanMainMenuScene(eventQueue);
    const secondScene = createPacmanMainMenuScene(eventQueue);
    const secondSceneInitialEntities = secondScene.serialize().entities;

    firstScene.destroy();

    expect(firstScene).not.toBe(secondScene);
    expect(secondSceneInitialEntities.length).toBeGreaterThan(0);
    expect(secondScene.serialize().entities).toEqual(secondSceneInitialEntities);
  });
});
