import { describe, expect, it } from 'vitest';
import { Queue } from '@shared/data-structures/queue';
import { COMPONENT_TYPE } from '@shared/constants/component.constant';
import { createPacmanGameScene } from '@pacman/scenes/pacman-game.scene';
import { PACMAN_CLASSIC_LEVEL } from '@pacman/levels/classic-level';
import { createPacmanMainMenuScene } from '@pacman/scenes/pacman-main-menu.scene';
import { PLAYER_SPEED } from '@pacman/config/pacman-game.config';
import { PACMAN_SCENE } from '@pacman/constants/pacman-scene.constant';
import type { IEvent } from '@shared/interfaces/event.interface';
import { parsePacmanLevel } from '@pacman/levels/pacman-level.parser';
import { PACMAN_EVENT_TYPE } from '@pacman/constants/pacman-event.constant';
import { PACMAN_COMPONENT_TYPE } from '@pacman/constants/pacman-component.constant';
import type { ISerializedPacmanMenuItemComponent } from '@pacman/components/pacman-menu-item.component';
import { PACMAN_TILE_TYPE } from '@pacman/constants/pacman-level.constant';
import { PACMAN_GHOST_ID } from '@pacman/constants/pacman-ghost.constant';
import { PACMAN_MENU_ACTION, PACMAN_MENU_NAVIGATION_DIRECTION } from '@pacman/constants/pacman-menu.constant';
import { PACMAN_ROLE, PACMAN_ROUND_STATUS } from '@pacman/constants/pacman-game-state.constant';

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
    const gameStateEntity = serializedScene.entities.find(
      (entity) => entity.components[PACMAN_COMPONENT_TYPE.GAME_STATE_COMPONENT],
    );
    const hudEntities = serializedScene.entities.filter(
      (entity) => entity.components[PACMAN_COMPONENT_TYPE.HUD_COMPONENT],
    );
    const ghostEntities = serializedScene.entities.filter(
      (entity) => entity.components[PACMAN_COMPONENT_TYPE.ROLE_COMPONENT]?.role === PACMAN_ROLE.GHOST,
    );

    expect(serializedScene.size).toEqual(level.size);
    expect(serializedScene.viewport).toEqual(level.size);
    expect(wallEntities.length).toBe(level.getTilesByType(PACMAN_TILE_TYPE.WALL).length);
    expect(collectibleEntities.length).toBe(
      level.getTilesByType(PACMAN_TILE_TYPE.PELLET).length + level.getTilesByType(PACMAN_TILE_TYPE.POWER_PELLET).length,
    );
    expect(gameStateEntity?.components[PACMAN_COMPONENT_TYPE.GAME_STATE_COMPONENT]).toMatchObject({
      score: 0,
      lives: 3,
      status: PACMAN_ROUND_STATUS.PLAYING,
      remainingCollectibles: collectibleEntities.length,
    });
    expect(hudEntities).toHaveLength(5);
    expect(playerEntity?.components[PACMAN_COMPONENT_TYPE.ROLE_COMPONENT]?.role).toBe(PACMAN_ROLE.PLAYER);
    expect(ghostEntities).toHaveLength(4);
    expect(ghostEntities.map((entity) => entity.components[PACMAN_COMPONENT_TYPE.GHOST_COMPONENT]?.ghostId)).toEqual([
      PACMAN_GHOST_ID.BLINKY,
      PACMAN_GHOST_ID.PINKY,
      PACMAN_GHOST_ID.INKY,
      PACMAN_GHOST_ID.CLYDE,
    ]);
    expect(ghostEntities.every((entity) => !entity.components[COMPONENT_TYPE.CONTROL_COMPONENT])).toBe(true);
    expect(playerEntity?.components[PACMAN_COMPONENT_TYPE.ACTOR_COMPONENT]?.speed).toBe(PLAYER_SPEED);
    expect(playerEntity?.components[COMPONENT_TYPE.POSITION_COMPONENT]?.position).toEqual(level.playerSpawn.position);
    expect(ghostEntities[0].components[COMPONENT_TYPE.POSITION_COMPONENT]?.position).toEqual(
      level.ghostStartSlots[0].spawnTile.position,
    );
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

  it('should create a main menu scene with selectable start and reset actions', () => {
    const eventQueue = makeEventQueue();
    const sut = createPacmanMainMenuScene(eventQueue);
    const serializedScene = sut.serialize();
    const menuItems = serializedScene.entities
      .map(
        (entity) =>
          entity.components[PACMAN_COMPONENT_TYPE.MENU_ITEM_COMPONENT] as
            | ISerializedPacmanMenuItemComponent
            | undefined,
      )
      .filter((component): component is ISerializedPacmanMenuItemComponent => Boolean(component))
      .sort((left, right) => left.order - right.order);

    expect(serializedScene.id).toBe(PACMAN_SCENE.MAIN_MENU);
    expect(menuItems).toHaveLength(2);
    expect(menuItems[0]).toMatchObject({
      label: 'START GAME',
      selected: true,
      action: PACMAN_MENU_ACTION.START_MATCH,
    });
    expect(menuItems[1]).toMatchObject({
      label: 'RESET',
      selected: false,
      action: PACMAN_MENU_ACTION.RESET_MENU,
    });
  });

  it('should navigate main menu selection through serialized menu item state', () => {
    const eventQueue = makeEventQueue();
    const sut = createPacmanMainMenuScene(eventQueue);

    sut.init();
    sut.update({
      eventQueue,
      eventMap: {
        [PACMAN_EVENT_TYPE.MENU_NAVIGATE]: [
          { type: PACMAN_EVENT_TYPE.MENU_NAVIGATE, direction: PACMAN_MENU_NAVIGATION_DIRECTION.NEXT },
        ],
      },
    });

    const menuItems = sut
      .serialize()
      .entities.map((entity) => entity.components[PACMAN_COMPONENT_TYPE.MENU_ITEM_COMPONENT])
      .filter((component): component is ISerializedPacmanMenuItemComponent => Boolean(component))
      .sort((left, right) => left.order - right.order);

    expect(menuItems[0].selected).toBe(false);
    expect(menuItems[1].selected).toBe(true);
  });
});
