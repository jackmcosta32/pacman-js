import { describe, expect, it } from 'vitest';
import { Queue } from '@shared/data-structures/queue';
import { COMPONENT_TYPE } from '@shared/constants/component.constant';
import { createPacmanGameScene } from '@pacman/scenes/pacman-game.scene';
import { PACMAN_CLASSIC_LEVEL } from '@pacman/levels/classic-level';
import { createPacmanMainMenuScene } from '@pacman/scenes/pacman-main-menu.scene';
import type { IEvent } from '@shared/interfaces/event.interface';
import { parsePacmanLevel } from '@pacman/levels/pacman-level.parser';
import { PACMAN_COMPONENT_TYPE } from '@pacman/constants/pacman-component.constant';
import { PACMAN_TILE_TYPE } from '@pacman/constants/pacman-level.constant';

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

  it('should generate classic match scene entities from level data', () => {
    const eventQueue = makeEventQueue();
    const level = parsePacmanLevel(PACMAN_CLASSIC_LEVEL);
    const sut = createPacmanGameScene(eventQueue);
    const serializedScene = sut.serialize();
    const wallEntities = serializedScene.entities.filter(
      (entity) => entity.components[PACMAN_COMPONENT_TYPE.TILE_COMPONENT]?.tileType === PACMAN_TILE_TYPE.WALL,
    );
    const collectibleEntities = serializedScene.entities.filter(
      (entity) => entity.components[PACMAN_COMPONENT_TYPE.COLLECTIBLE_COMPONENT],
    );
    const playerEntity = serializedScene.entities.find((entity) => entity.components[COMPONENT_TYPE.CONTROL_COMPONENT]);
    const botEntity = serializedScene.entities.find(
      (entity) => entity.components[COMPONENT_TYPE.SPRITE_COMPONENT] && !entity.components[COMPONENT_TYPE.CONTROL_COMPONENT],
    );

    expect(serializedScene.size).toEqual(level.size);
    expect(serializedScene.viewport).toEqual(level.size);
    expect(wallEntities.length).toBe(level.getTilesByType(PACMAN_TILE_TYPE.WALL).length);
    expect(collectibleEntities.length).toBe(
      level.getTilesByType(PACMAN_TILE_TYPE.PELLET).length + level.getTilesByType(PACMAN_TILE_TYPE.POWER_PELLET).length,
    );
    expect(playerEntity?.components[COMPONENT_TYPE.POSITION_COMPONENT]?.position).toEqual(level.playerSpawn.position);
    expect(botEntity?.components[COMPONENT_TYPE.POSITION_COMPONENT]?.position).toEqual(level.ghostSpawns[0].position);
    expect(playerEntity?.components[COMPONENT_TYPE.POSITION_COMPONENT]?.position).not.toEqual({ x: 50, y: 50 });
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
