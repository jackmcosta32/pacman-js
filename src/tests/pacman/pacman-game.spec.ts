import { describe, expect, it, vi } from 'vitest';
import { PacmanGame } from '@pacman/pacman-game';
import { COMPONENT_TYPE } from '@shared/constants/component.constant';
import { PACMAN_EVENT_TYPE } from '@pacman/constants/pacman-event.constant';
import { PACMAN_CLASSIC_LEVEL } from '@pacman/levels/classic-level';
import { parsePacmanLevel } from '@pacman/levels/pacman-level.parser';
import { PACMAN_COMPONENT_TYPE } from '@pacman/constants/pacman-component.constant';
import type { ISerializedScene } from '@game-engine/interfaces/scene.interface';
import { PACMAN_ACTOR_DIRECTION } from '@pacman/constants/pacman-actor.constant';
import { PACMAN_ROUND_STATUS } from '@pacman/constants/pacman-game-state.constant';

describe('Pac-Man - Game runtime', () => {
  it('should restart the classic match scene and discard mixed same-frame events', () => {
    const level = parsePacmanLevel(PACMAN_CLASSIC_LEVEL);
    const sceneListener = vi.fn();
    const sut = new PacmanGame();

    sut.subscribe(sceneListener);
    sut.start();
    sut.readClientEvent({ type: PACMAN_EVENT_TYPE.MOVEMENT_REQUEST, direction: PACMAN_ACTOR_DIRECTION.LEFT });
    sut.readClientEvent({ type: PACMAN_EVENT_TYPE.RESTART_REQUEST });
    sut.readClientEvent({ type: PACMAN_EVENT_TYPE.PAUSE_TOGGLE });
    sut.update();

    const serializedScene = sceneListener.mock.calls[0][0] as ISerializedScene;
    const gameStateEntity = serializedScene.entities.find(
      (entity) => entity.components[PACMAN_COMPONENT_TYPE.GAME_STATE_COMPONENT],
    );
    const playerEntity = serializedScene.entities.find((entity) => entity.components[COMPONENT_TYPE.CONTROL_COMPONENT]);

    expect(sceneListener).toHaveBeenCalledTimes(1);
    expect(gameStateEntity).toBeDefined();
    expect(playerEntity).toBeDefined();
    expect(gameStateEntity!.components[PACMAN_COMPONENT_TYPE.GAME_STATE_COMPONENT]).toMatchObject({
      score: 0,
      lives: 3,
      status: PACMAN_ROUND_STATUS.PLAYING,
    });
    expect(playerEntity!.components[COMPONENT_TYPE.POSITION_COMPONENT].position).toEqual(level.playerSpawn.position);
  });
});
