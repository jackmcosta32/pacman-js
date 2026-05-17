import { describe, expect, it, vi } from 'vitest';
import { PacmanGame } from '@pacman/pacman-game';
import { Scene } from '@game-engine/core/scene';
import { COMPONENT_TYPE } from '@shared/constants/component.constant';
import { PACMAN_EVENT_TYPE } from '@pacman/constants/pacman-event.constant';
import { PACMAN_CLASSIC_LEVEL } from '@pacman/levels/classic-level';
import { parsePacmanLevel } from '@pacman/levels/pacman-level.parser';
import { PACMAN_SCENE } from '@pacman/constants/pacman-scene.constant';
import { PACMAN_COMPONENT_TYPE } from '@pacman/constants/pacman-component.constant';
import type { ISerializedScene } from '@game-engine/interfaces/scene.interface';
import { PACMAN_ACTOR_DIRECTION } from '@pacman/constants/pacman-actor.constant';
import { PACMAN_MENU_ACTION, PACMAN_MENU_NAVIGATION_DIRECTION } from '@pacman/constants/pacman-menu.constant';
import { PACMAN_ROUND_STATUS } from '@pacman/constants/pacman-game-state.constant';

describe('Pac-Man - Game runtime', () => {
  it('should start on the main menu and notify subscribers with the initial scene', () => {
    const sceneListener = vi.fn();
    const sut = new PacmanGame();

    sut.subscribe(sceneListener);
    sut.start();

    const serializedScene = sceneListener.mock.calls[0][0] as ISerializedScene;

    expect(sceneListener).toHaveBeenCalledTimes(1);
    expect(serializedScene.id).toBe(PACMAN_SCENE.MAIN_MENU);
    expect(
      serializedScene.entities.some(
        (entity) =>
          entity.components[PACMAN_COMPONENT_TYPE.MENU_ITEM_COMPONENT]?.action === PACMAN_MENU_ACTION.START_MATCH,
      ),
    ).toBe(true);
  });

  it('should load known scenes, initialize once, destroy the previous scene once, and notify subscribers', () => {
    const sceneListener = vi.fn();
    const initSpy = vi.spyOn(Scene.prototype, 'init');
    const destroySpy = vi.spyOn(Scene.prototype, 'destroy');
    const sut = new PacmanGame();

    sut.subscribe(sceneListener);
    sut.start();
    sut.loadScene(PACMAN_SCENE.CLASSIC_MATCH);

    expect(initSpy).toHaveBeenCalledTimes(2);
    expect(destroySpy).toHaveBeenCalledTimes(1);
    expect(sceneListener).toHaveBeenCalledTimes(2);
    expect(sceneListener.mock.calls[0][0].id).toBe(PACMAN_SCENE.MAIN_MENU);
    expect(sceneListener.mock.calls[1][0].id).toBe(PACMAN_SCENE.CLASSIC_MATCH);

    initSpy.mockRestore();
    destroySpy.mockRestore();
  });

  it('should reject unknown scene ids and preserve the current scene', () => {
    const sceneListener = vi.fn();
    const sut = new PacmanGame();

    sut.subscribe(sceneListener);
    sut.start();

    expect(() => sut.loadScene('missing-scene')).toThrow('Unknown Pac-Man scene id: missing-scene');
    expect(() => sut.loadScene('toString')).toThrow('Unknown Pac-Man scene id: toString');

    sut.update();

    expect(sceneListener.mock.calls.at(-1)?.[0].id).toBe(PACMAN_SCENE.MAIN_MENU);
  });

  it('should select the default main menu item and load the classic match in the same update', () => {
    const sceneListener = vi.fn();
    const sut = new PacmanGame();

    sut.subscribe(sceneListener);
    sut.start();
    sut.readClientEvent({ type: PACMAN_EVENT_TYPE.MENU_SELECT });
    sut.update();

    expect(sceneListener.mock.calls.at(-1)?.[0].id).toBe(PACMAN_SCENE.CLASSIC_MATCH);
  });

  it('should apply same-frame menu navigation before menu selection', () => {
    const sceneListener = vi.fn();
    const sut = new PacmanGame();

    sut.subscribe(sceneListener);
    sut.start();
    sut.readClientEvent({
      type: PACMAN_EVENT_TYPE.MENU_NAVIGATE,
      direction: PACMAN_MENU_NAVIGATION_DIRECTION.NEXT,
    });
    sut.readClientEvent({ type: PACMAN_EVENT_TYPE.MENU_SELECT });
    sut.update();

    const serializedScene = sceneListener.mock.calls.at(-1)![0] as ISerializedScene;
    const selectedMenuItem = serializedScene.entities
      .map((entity) => entity.components[PACMAN_COMPONENT_TYPE.MENU_ITEM_COMPONENT])
      .find((component) => component?.selected);

    expect(serializedScene.id).toBe(PACMAN_SCENE.MAIN_MENU);
    expect(selectedMenuItem?.action).toBe(PACMAN_MENU_ACTION.START_MATCH);
  });

  it('should restart the classic match scene and discard mixed same-frame events', () => {
    const level = parsePacmanLevel(PACMAN_CLASSIC_LEVEL);
    const sceneListener = vi.fn();
    const sut = new PacmanGame();

    sut.subscribe(sceneListener);
    sut.start();
    sut.loadScene(PACMAN_SCENE.CLASSIC_MATCH);
    sut.readClientEvent({ type: PACMAN_EVENT_TYPE.MOVEMENT_REQUEST, direction: PACMAN_ACTOR_DIRECTION.LEFT });
    sut.readClientEvent({ type: PACMAN_EVENT_TYPE.RESTART_REQUEST });
    sut.readClientEvent({ type: PACMAN_EVENT_TYPE.PAUSE_TOGGLE });
    sut.update();

    const serializedScene = sceneListener.mock.calls.at(-1)![0] as ISerializedScene;
    const gameStateEntity = serializedScene.entities.find(
      (entity) => entity.components[PACMAN_COMPONENT_TYPE.GAME_STATE_COMPONENT],
    );
    const playerEntity = serializedScene.entities.find((entity) => entity.components[COMPONENT_TYPE.CONTROL_COMPONENT]);

    expect(serializedScene.id).toBe(PACMAN_SCENE.CLASSIC_MATCH);
    expect(gameStateEntity).toBeDefined();
    expect(playerEntity).toBeDefined();
    expect(gameStateEntity!.components[PACMAN_COMPONENT_TYPE.GAME_STATE_COMPONENT]).toMatchObject({
      score: 0,
      lives: 3,
      status: PACMAN_ROUND_STATUS.PLAYING,
    });
    expect(playerEntity!.components[COMPONENT_TYPE.POSITION_COMPONENT].position).toEqual(level.playerSpawn.position);
  });

  it('should return to the main menu and remove old match entities from the transition snapshot', () => {
    const sceneListener = vi.fn();
    const sut = new PacmanGame();

    sut.subscribe(sceneListener);
    sut.start();
    sut.loadScene(PACMAN_SCENE.CLASSIC_MATCH);
    sut.readClientEvent({ type: PACMAN_EVENT_TYPE.RETURN_TO_MENU_REQUEST });
    sut.update();

    const serializedScene = sceneListener.mock.calls.at(-1)![0] as ISerializedScene;

    expect(serializedScene.id).toBe(PACMAN_SCENE.MAIN_MENU);
    expect(
      serializedScene.entities.some((entity) => entity.components[PACMAN_COMPONENT_TYPE.GAME_STATE_COMPONENT]),
    ).toBe(false);
    expect(
      serializedScene.entities.some((entity) => entity.components[PACMAN_COMPONENT_TYPE.MENU_ITEM_COMPONENT]),
    ).toBe(true);
  });
});
