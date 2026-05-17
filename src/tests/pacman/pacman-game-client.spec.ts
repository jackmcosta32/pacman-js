import { afterEach, describe, expect, it, vi } from 'vitest';
import { PACMAN_EVENT_TYPE } from '@pacman/constants/pacman-event.constant';
import { PacmanGameClient } from '@pacman/pacman-game-client';
import { INPUT_SCHEME } from '@pacman/config/pacman-game.config';
import { PACMAN_SCENE } from '@pacman/constants/pacman-scene.constant';
import { KEYBOARD_EVENT_TYPE } from '@shared/constants/event.constant';
import type { IGame } from '@shared/interfaces/game.interface';
import type { IInputEvent } from '@shared/interfaces/event.interface';
import { COMPONENT_TYPE } from '@shared/constants/component.constant';
import { PACMAN_COMPONENT_TYPE } from '@pacman/constants/pacman-component.constant';
import { PACMAN_TILE_TYPE, PACMAN_COLLECTIBLE_TYPE } from '@pacman/constants/pacman-level.constant';
import type {
  IAssetsDriver,
  IAudioDriver,
  IGraphicsDriver,
  IInputDriver,
} from '@game-client/interfaces/driver.interface';
import { PACMAN_ACTOR_DIRECTION } from '@pacman/constants/pacman-actor.constant';
import { PACMAN_MENU_NAVIGATION_DIRECTION } from '@pacman/constants/pacman-menu.constant';

const makeDeferred = <Value>() => {
  let resolve!: (value: Value) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<Value>((promiseResolve, promiseReject) => {
    resolve = promiseResolve;
    reject = promiseReject;
  });

  return { promise, reject, resolve };
};

const installAnimationFrameMock = () => {
  let nextFrameId = 1;
  const frameCallbacks = new Map<number, FrameRequestCallback>();
  const requestAnimationFrameMock = vi.fn((callback: FrameRequestCallback) => {
    const frameId = nextFrameId;

    nextFrameId += 1;
    frameCallbacks.set(frameId, callback);

    return frameId;
  });
  const cancelAnimationFrameMock = vi.fn((frameId: number) => {
    frameCallbacks.delete(frameId);
  });

  vi.stubGlobal('requestAnimationFrame', requestAnimationFrameMock);
  vi.stubGlobal('cancelAnimationFrame', cancelAnimationFrameMock);

  return { cancelAnimationFrameMock, frameCallbacks, requestAnimationFrameMock };
};

const makeGame = () =>
  ({
    start: vi.fn(),
    update: vi.fn(),
    destroy: vi.fn(),
    subscribe: vi.fn(),
    unsubscribe: vi.fn(),
    readClientEvent: vi.fn(),
  }) as unknown as IGame;

const makeInputDriver = (events: IInputEvent[] = []) =>
  ({
    init: vi.fn(),
    destroy: vi.fn(),
    clearInputStream: vi.fn(),
    readInputStream: vi.fn(),
    drainInputStream: vi.fn(() => events),
  }) as unknown as IInputDriver;

const makeAssetsDriver = () =>
  ({
    getAsset: vi.fn(),
    loadAudio: vi.fn(),
    loadSpriteSheet: vi.fn(() => Promise.resolve(true)),
    loadFontFace: vi.fn(() => Promise.resolve(true)),
  }) as unknown as IAssetsDriver;

const makeAudioDriver = () =>
  ({
    play: vi.fn(),
  }) as unknown as IAudioDriver;

const makeGraphicsDriver = () =>
  ({
    clear: vi.fn(),
    drawText: vi.fn(),
    drawCircle: vi.fn(),
    drawSprite: vi.fn(),
    drawRectangle: vi.fn(),
    setResolution: vi.fn(),
  }) as unknown as IGraphicsDriver;

describe('Pac-Man - PacmanGameClient', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should start once while asset loading is pending', () => {
    installAnimationFrameMock();

    const spriteLoad = makeDeferred<boolean>();
    const game = makeGame();
    const inputDriver = makeInputDriver();
    const assetsDriver = makeAssetsDriver();
    const graphicsDriver = makeGraphicsDriver();

    vi.mocked(assetsDriver.loadSpriteSheet).mockReturnValue(spriteLoad.promise);

    const sut = new PacmanGameClient({
      assetsDriver,
      audioDriver: makeAudioDriver(),
      game,
      graphicsDriver,
      inputDriver,
    });
    const firstStart = sut.start();
    const secondStart = sut.start();

    expect(firstStart).toBe(secondStart);
    expect(inputDriver.init).toHaveBeenCalledTimes(1);
    expect(assetsDriver.loadSpriteSheet).toHaveBeenCalledTimes(1);
  });

  it('should not start the game when stopped during pending asset loading', async () => {
    installAnimationFrameMock();

    const spriteLoad = makeDeferred<boolean>();
    const game = makeGame();
    const inputDriver = makeInputDriver();
    const assetsDriver = makeAssetsDriver();
    const graphicsDriver = makeGraphicsDriver();

    vi.mocked(assetsDriver.loadSpriteSheet).mockReturnValue(spriteLoad.promise);

    const sut = new PacmanGameClient({
      assetsDriver,
      audioDriver: makeAudioDriver(),
      game,
      graphicsDriver,
      inputDriver,
    });
    const start = sut.start();

    sut.stop();
    spriteLoad.resolve(true);

    await start;

    expect(game.start).not.toHaveBeenCalled();
    expect(game.update).not.toHaveBeenCalled();
    expect(inputDriver.destroy).toHaveBeenCalled();
  });

  it('should ignore stale asset rejections after stop', async () => {
    installAnimationFrameMock();

    const spriteLoad = makeDeferred<boolean>();
    const game = makeGame();
    const inputDriver = makeInputDriver();
    const assetsDriver = makeAssetsDriver();
    const graphicsDriver = makeGraphicsDriver();

    vi.mocked(assetsDriver.loadSpriteSheet).mockReturnValue(spriteLoad.promise);

    const sut = new PacmanGameClient({
      assetsDriver,
      audioDriver: makeAudioDriver(),
      game,
      graphicsDriver,
      inputDriver,
    });
    const start = sut.start();

    sut.stop();
    spriteLoad.reject(new Error('Missing stale asset'));

    await expect(start).resolves.toBeUndefined();
    expect(game.start).not.toHaveBeenCalled();
  });

  it('should cancel the animation frame, unsubscribe, and destroy runtime state on stop', async () => {
    const { cancelAnimationFrameMock } = installAnimationFrameMock();
    const game = makeGame();
    const inputDriver = makeInputDriver();
    const assetsDriver = makeAssetsDriver();
    const graphicsDriver = makeGraphicsDriver();
    const sut = new PacmanGameClient({
      assetsDriver,
      audioDriver: makeAudioDriver(),
      game,
      graphicsDriver,
      inputDriver,
    });

    await sut.start();
    sut.stop();

    expect(game.subscribe).toHaveBeenCalledTimes(1);
    expect(game.unsubscribe).toHaveBeenCalledTimes(1);
    expect(cancelAnimationFrameMock).toHaveBeenCalledWith(1);
    expect(inputDriver.destroy).toHaveBeenCalled();
    expect(game.destroy).toHaveBeenCalled();
  });

  it('should restart cleanly after stop', async () => {
    installAnimationFrameMock();

    const game = makeGame();
    const inputDriver = makeInputDriver();
    const assetsDriver = makeAssetsDriver();
    const graphicsDriver = makeGraphicsDriver();
    const sut = new PacmanGameClient({
      assetsDriver,
      audioDriver: makeAudioDriver(),
      game,
      graphicsDriver,
      inputDriver,
    });

    await sut.start();
    sut.stop();
    await sut.start();

    expect(inputDriver.init).toHaveBeenCalledTimes(2);
    expect(game.start).toHaveBeenCalledTimes(2);
    expect(game.subscribe).toHaveBeenCalledTimes(2);
  });

  it('should drain all input events and enqueue mapped Pac-Man events before updating the game', async () => {
    installAnimationFrameMock();

    const game = makeGame();
    const inputDriver = makeInputDriver([
      { type: KEYBOARD_EVENT_TYPE.KEY_DOWN, keyCode: INPUT_SCHEME.LEFT },
      { type: KEYBOARD_EVENT_TYPE.KEY_UP, keyCode: INPUT_SCHEME.LEFT },
    ]);
    const assetsDriver = makeAssetsDriver();
    const graphicsDriver = makeGraphicsDriver();
    const sut = new PacmanGameClient({
      assetsDriver,
      audioDriver: makeAudioDriver(),
      game,
      graphicsDriver,
      inputDriver,
    });

    await sut.start();

    expect(game.readClientEvent).toHaveBeenNthCalledWith(1, {
      type: PACMAN_EVENT_TYPE.MOVEMENT_REQUEST,
      direction: PACMAN_ACTOR_DIRECTION.LEFT,
    });
    expect(game.readClientEvent).toHaveBeenCalledTimes(1);
    expect(game.update).toHaveBeenCalledTimes(1);
  });

  it('should map pause and restart keys to Pac-Man events', async () => {
    installAnimationFrameMock();

    const game = makeGame();
    const inputDriver = makeInputDriver([
      { type: KEYBOARD_EVENT_TYPE.KEY_DOWN, keyCode: INPUT_SCHEME.PAUSE },
      { type: KEYBOARD_EVENT_TYPE.KEY_DOWN, keyCode: INPUT_SCHEME.RESTART },
      { type: KEYBOARD_EVENT_TYPE.KEY_DOWN, keyCode: INPUT_SCHEME.RETURN_TO_MENU },
    ]);
    const assetsDriver = makeAssetsDriver();
    const graphicsDriver = makeGraphicsDriver();
    const sut = new PacmanGameClient({
      assetsDriver,
      audioDriver: makeAudioDriver(),
      game,
      graphicsDriver,
      inputDriver,
    });

    await sut.start();

    expect(game.readClientEvent).toHaveBeenNthCalledWith(1, {
      type: PACMAN_EVENT_TYPE.PAUSE_TOGGLE,
    });
    expect(game.readClientEvent).toHaveBeenNthCalledWith(2, {
      type: PACMAN_EVENT_TYPE.RESTART_REQUEST,
    });
    expect(game.readClientEvent).toHaveBeenNthCalledWith(3, {
      type: PACMAN_EVENT_TYPE.RETURN_TO_MENU_REQUEST,
    });
  });

  it('should map main menu keys to navigation and select events by current scene id', async () => {
    const { frameCallbacks } = installAnimationFrameMock();

    const game = makeGame();
    const inputDriver = makeInputDriver();
    const assetsDriver = makeAssetsDriver();
    const graphicsDriver = makeGraphicsDriver();
    const sut = new PacmanGameClient({
      assetsDriver,
      audioDriver: makeAudioDriver(),
      game,
      graphicsDriver,
      inputDriver,
    });

    vi.mocked(inputDriver.drainInputStream)
      .mockReturnValueOnce([])
      .mockReturnValueOnce([
        { type: KEYBOARD_EVENT_TYPE.KEY_DOWN, keyCode: INPUT_SCHEME.DOWN },
        { type: KEYBOARD_EVENT_TYPE.KEY_DOWN, keyCode: INPUT_SCHEME.MENU_SELECT },
      ]);

    await sut.start();

    const sceneListener = vi.mocked(game.subscribe).mock.calls[0][0];

    sceneListener({
      id: PACMAN_SCENE.MAIN_MENU,
      size: { width: 96, height: 48 },
      viewport: { width: 96, height: 48 },
      entities: [],
    });
    frameCallbacks.get(1)?.(1000);

    expect(game.readClientEvent).toHaveBeenNthCalledWith(1, {
      type: PACMAN_EVENT_TYPE.MENU_NAVIGATE,
      direction: PACMAN_MENU_NAVIGATION_DIRECTION.NEXT,
    });
    expect(game.readClientEvent).toHaveBeenNthCalledWith(2, {
      type: PACMAN_EVENT_TYPE.MENU_SELECT,
    });
  });

  it('should ignore unmapped input events', async () => {
    installAnimationFrameMock();

    const game = makeGame();
    const inputDriver = makeInputDriver([{ type: KEYBOARD_EVENT_TYPE.KEY_DOWN, keyCode: 'KeyA' }]);
    const assetsDriver = makeAssetsDriver();
    const graphicsDriver = makeGraphicsDriver();
    const sut = new PacmanGameClient({
      assetsDriver,
      audioDriver: makeAudioDriver(),
      game,
      graphicsDriver,
      inputDriver,
    });

    await sut.start();

    expect(game.readClientEvent).not.toHaveBeenCalled();
    expect(game.update).toHaveBeenCalledTimes(1);
  });

  it('should draw walls, collectibles, and actors in scene order groups', async () => {
    installAnimationFrameMock();

    const game = makeGame();
    const inputDriver = makeInputDriver();
    const assetsDriver = makeAssetsDriver();
    const graphicsDriver = makeGraphicsDriver();
    const sut = new PacmanGameClient({
      assetsDriver,
      audioDriver: makeAudioDriver(),
      game,
      graphicsDriver,
      inputDriver,
    });

    await sut.start();

    const sceneListener = vi.mocked(game.subscribe).mock.calls[0][0];

    sceneListener({
      id: 'classic-match',
      size: { width: 96, height: 48 },
      viewport: { width: 96, height: 48 },
      entities: [
        {
          id: 'actor',
          components: {
            [COMPONENT_TYPE.POSITION_COMPONENT]: {
              type: COMPONENT_TYPE.POSITION_COMPONENT,
              position: { x: 48, y: 0 },
              boundingBox: { x: 48, y: 0, width: 48, height: 48 },
              centerPosition: { x: 72, y: 24 },
            },
            [COMPONENT_TYPE.SPRITE_COMPONENT]: {
              type: COMPONENT_TYPE.SPRITE_COMPONENT,
              sprite: { spriteSheetId: 'ACTOR_SPRITES', x: 0, y: 0, width: 48, height: 48 },
            },
          },
        },
        {
          id: 'pellet',
          components: {
            [COMPONENT_TYPE.POSITION_COMPONENT]: {
              type: COMPONENT_TYPE.POSITION_COMPONENT,
              position: { x: 48, y: 0 },
              boundingBox: { x: 48, y: 0, width: 48, height: 48 },
              centerPosition: { x: 72, y: 24 },
            },
            [PACMAN_COMPONENT_TYPE.COLLECTIBLE_COMPONENT]: {
              type: PACMAN_COMPONENT_TYPE.COLLECTIBLE_COMPONENT,
              scoreValue: 10,
              collectibleType: PACMAN_COLLECTIBLE_TYPE.PELLET,
            },
          },
        },
        {
          id: 'wall',
          components: {
            [COMPONENT_TYPE.POSITION_COMPONENT]: {
              type: COMPONENT_TYPE.POSITION_COMPONENT,
              position: { x: 0, y: 0 },
              boundingBox: { x: 0, y: 0, width: 48, height: 48 },
              centerPosition: { x: 24, y: 24 },
            },
            [PACMAN_COMPONENT_TYPE.TILE_COMPONENT]: {
              type: PACMAN_COMPONENT_TYPE.TILE_COMPONENT,
              row: 0,
              column: 0,
              symbol: '#',
              walkable: false,
              blocking: true,
              tileType: PACMAN_TILE_TYPE.WALL,
            },
          },
        },
      ],
    });

    expect(graphicsDriver.drawRectangle).toHaveBeenCalledWith(
      { x: 0, y: 0 },
      { x: 0, y: 0, width: 48, height: 48 },
      { fillColor: '#0b35f0', strokeColor: '#5c8dff', lineWidth: 2 },
    );
    expect(graphicsDriver.drawCircle).toHaveBeenCalledWith({ x: 72, y: 24 }, 3.84, { fillColor: '#f8e6b0' });
    expect(graphicsDriver.drawSprite).toHaveBeenCalled();
    expect(vi.mocked(graphicsDriver.drawRectangle).mock.invocationCallOrder[0]).toBeLessThan(
      vi.mocked(graphicsDriver.drawCircle).mock.invocationCallOrder[0],
    );
    expect(vi.mocked(graphicsDriver.drawCircle).mock.invocationCallOrder[0]).toBeLessThan(
      vi.mocked(graphicsDriver.drawSprite).mock.invocationCallOrder[0],
    );
  });

  it('should load audio assets and play serialized sound hooks once', async () => {
    installAnimationFrameMock();

    const game = makeGame();
    const inputDriver = makeInputDriver();
    const assetsDriver = makeAssetsDriver();
    const audioDriver = makeAudioDriver();
    const graphicsDriver = makeGraphicsDriver();
    const sut = new PacmanGameClient({ assetsDriver, audioDriver, game, graphicsDriver, inputDriver });

    await sut.start();

    const sceneListener = vi.mocked(game.subscribe).mock.calls[0][0];
    const scene = {
      id: 'classic-match',
      size: { width: 96, height: 48 },
      viewport: { width: 96, height: 48 },
      entities: [
        {
          id: 'state',
          components: {
            [PACMAN_COMPONENT_TYPE.GAME_STATE_COMPONENT]: {
              type: PACMAN_COMPONENT_TYPE.GAME_STATE_COMPONENT,
              score: 0,
              lives: 3,
              status: 'playing',
              remainingCollectibles: 1,
              frightenedRemainingMs: 0,
              respawnRemainingMs: 0,
              soundHooks: [
                { id: 1, soundEffect: 'start' },
                { id: 2, soundEffect: 'pellet' },
              ],
            },
          },
        },
      ],
    };

    sceneListener(scene);
    sceneListener(scene);
    sceneListener({
      ...scene,
      entities: [
        {
          ...scene.entities[0],
          components: {
            [PACMAN_COMPONENT_TYPE.GAME_STATE_COMPONENT]: {
              ...scene.entities[0].components[PACMAN_COMPONENT_TYPE.GAME_STATE_COMPONENT],
              soundHooks: [{ id: 3, soundEffect: 'death' }],
            },
          },
        },
      ],
    });

    expect(assetsDriver.loadAudio).toHaveBeenCalledTimes(5);
    expect(audioDriver.play).toHaveBeenCalledTimes(3);
    expect(audioDriver.play).toHaveBeenNthCalledWith(1, 'start');
    expect(audioDriver.play).toHaveBeenNthCalledWith(2, 'pellet');
    expect(audioDriver.play).toHaveBeenNthCalledWith(3, 'death');
  });

  it('should replay sound hooks when serialized hook ids roll back after an external restart', async () => {
    installAnimationFrameMock();

    const game = makeGame();
    const inputDriver = makeInputDriver();
    const assetsDriver = makeAssetsDriver();
    const audioDriver = makeAudioDriver();
    const graphicsDriver = makeGraphicsDriver();
    const sut = new PacmanGameClient({ assetsDriver, audioDriver, game, graphicsDriver, inputDriver });

    await sut.start();

    const sceneListener = vi.mocked(game.subscribe).mock.calls[0][0];

    sceneListener({
      id: 'classic-match',
      size: { width: 96, height: 48 },
      viewport: { width: 96, height: 48 },
      entities: [
        {
          id: 'state',
          components: {
            [PACMAN_COMPONENT_TYPE.GAME_STATE_COMPONENT]: {
              type: PACMAN_COMPONENT_TYPE.GAME_STATE_COMPONENT,
              score: 0,
              lives: 3,
              status: 'playing',
              remainingCollectibles: 1,
              frightenedRemainingMs: 0,
              respawnRemainingMs: 0,
              soundHooks: [{ id: 4, soundEffect: 'death' }],
            },
          },
        },
      ],
    });
    sceneListener({
      id: 'classic-match',
      size: { width: 96, height: 48 },
      viewport: { width: 96, height: 48 },
      entities: [
        {
          id: 'state',
          components: {
            [PACMAN_COMPONENT_TYPE.GAME_STATE_COMPONENT]: {
              type: PACMAN_COMPONENT_TYPE.GAME_STATE_COMPONENT,
              score: 0,
              lives: 3,
              status: 'playing',
              remainingCollectibles: 1,
              frightenedRemainingMs: 0,
              respawnRemainingMs: 0,
              soundHooks: [{ id: 1, soundEffect: 'start' }],
            },
          },
        },
      ],
    });

    expect(audioDriver.play).toHaveBeenNthCalledWith(1, 'death');
    expect(audioDriver.play).toHaveBeenNthCalledWith(2, 'start');
  });

  it('should reset sound hook tracking when the scene id changes', async () => {
    installAnimationFrameMock();

    const game = makeGame();
    const inputDriver = makeInputDriver();
    const assetsDriver = makeAssetsDriver();
    const audioDriver = makeAudioDriver();
    const graphicsDriver = makeGraphicsDriver();
    const sut = new PacmanGameClient({ assetsDriver, audioDriver, game, graphicsDriver, inputDriver });

    await sut.start();

    const sceneListener = vi.mocked(game.subscribe).mock.calls[0][0];

    sceneListener({
      id: PACMAN_SCENE.CLASSIC_MATCH,
      size: { width: 96, height: 48 },
      viewport: { width: 96, height: 48 },
      entities: [
        {
          id: 'state',
          components: {
            [PACMAN_COMPONENT_TYPE.GAME_STATE_COMPONENT]: {
              type: PACMAN_COMPONENT_TYPE.GAME_STATE_COMPONENT,
              score: 0,
              lives: 3,
              status: 'playing',
              remainingCollectibles: 1,
              frightenedRemainingMs: 0,
              respawnRemainingMs: 0,
              soundHooks: [{ id: 1, soundEffect: 'start' }],
            },
          },
        },
      ],
    });
    sceneListener({
      id: PACMAN_SCENE.MAIN_MENU,
      size: { width: 96, height: 48 },
      viewport: { width: 96, height: 48 },
      entities: [],
    });
    sceneListener({
      id: PACMAN_SCENE.CLASSIC_MATCH,
      size: { width: 96, height: 48 },
      viewport: { width: 96, height: 48 },
      entities: [
        {
          id: 'state',
          components: {
            [PACMAN_COMPONENT_TYPE.GAME_STATE_COMPONENT]: {
              type: PACMAN_COMPONENT_TYPE.GAME_STATE_COMPONENT,
              score: 0,
              lives: 3,
              status: 'playing',
              remainingCollectibles: 1,
              frightenedRemainingMs: 0,
              respawnRemainingMs: 0,
              soundHooks: [{ id: 1, soundEffect: 'start' }],
            },
          },
        },
      ],
    });

    expect(audioDriver.play).toHaveBeenCalledTimes(2);
    expect(audioDriver.play).toHaveBeenNthCalledWith(1, 'start');
    expect(audioDriver.play).toHaveBeenNthCalledWith(2, 'start');
  });

  it('should reset sound hook tracking when a fresh same-id scene state entity appears', async () => {
    installAnimationFrameMock();

    const game = makeGame();
    const inputDriver = makeInputDriver();
    const assetsDriver = makeAssetsDriver();
    const audioDriver = makeAudioDriver();
    const graphicsDriver = makeGraphicsDriver();
    const sut = new PacmanGameClient({ assetsDriver, audioDriver, game, graphicsDriver, inputDriver });

    await sut.start();

    const sceneListener = vi.mocked(game.subscribe).mock.calls[0][0];
    const makeScene = (stateEntityId: string) => ({
      id: PACMAN_SCENE.CLASSIC_MATCH,
      size: { width: 96, height: 48 },
      viewport: { width: 96, height: 48 },
      entities: [
        {
          id: stateEntityId,
          components: {
            [PACMAN_COMPONENT_TYPE.GAME_STATE_COMPONENT]: {
              type: PACMAN_COMPONENT_TYPE.GAME_STATE_COMPONENT,
              score: 0,
              lives: 3,
              status: 'playing',
              remainingCollectibles: 1,
              frightenedRemainingMs: 0,
              respawnRemainingMs: 0,
              soundHooks: [{ id: 1, soundEffect: 'start' }],
            },
          },
        },
      ],
    });

    sceneListener(makeScene('state-1'));
    sceneListener(makeScene('state-1'));
    sceneListener(makeScene('state-2'));

    expect(audioDriver.play).toHaveBeenCalledTimes(2);
    expect(audioDriver.play).toHaveBeenNthCalledWith(1, 'start');
    expect(audioDriver.play).toHaveBeenNthCalledWith(2, 'start');
  });
});
