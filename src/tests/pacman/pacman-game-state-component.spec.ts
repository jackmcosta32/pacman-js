import { describe, expect, it } from 'vitest';
import { PACMAN_COMPONENT_TYPE } from '@pacman/constants/pacman-component.constant';
import { PacmanHudComponent } from '@pacman/components/pacman-hud.component';
import { PacmanRoleComponent } from '@pacman/components/pacman-role.component';
import { PacmanGhostComponent } from '@pacman/components/pacman-ghost.component';
import { PacmanGameStateComponent } from '@pacman/components/pacman-game-state.component';
import { PACMAN_GHOST_ID, PACMAN_GHOST_MODE } from '@pacman/constants/pacman-ghost.constant';
import {
  PACMAN_HUD_TYPE,
  PACMAN_ROLE,
  PACMAN_ROUND_STATUS,
  PACMAN_SOUND_EFFECT,
} from '@pacman/constants/pacman-game-state.constant';

describe('Pac-Man - Game state components', () => {
  it('should serialize initial game state with a start sound hook', () => {
    const sut = new PacmanGameStateComponent({ remainingCollectibles: 3 });

    expect(sut.serialize()).toEqual({
      type: PACMAN_COMPONENT_TYPE.GAME_STATE_COMPONENT,
      score: 0,
      lives: 3,
      status: PACMAN_ROUND_STATUS.PLAYING,
      remainingCollectibles: 3,
      frightenedRemainingMs: 0,
      frightenedWindowId: 0,
      ghostEatenStreak: 0,
      respawnRemainingMs: 0,
      soundHooks: [{ id: 1, soundEffect: PACMAN_SOUND_EFFECT.START }],
    });
  });

  it('should keep serialized sound hooks bounded and cloned', () => {
    const sut = new PacmanGameStateComponent({ remainingCollectibles: 3, soundHookMaxLength: 2 });

    sut.queueSound(PACMAN_SOUND_EFFECT.PELLET);
    sut.queueSound(PACMAN_SOUND_EFFECT.DEATH);

    const serialized = sut.serialize();

    expect(serialized.soundHooks).toEqual([
      { id: 2, soundEffect: PACMAN_SOUND_EFFECT.PELLET },
      { id: 3, soundEffect: PACMAN_SOUND_EFFECT.DEATH },
    ]);

    serialized.soundHooks[0].id = 999;

    expect(sut.serialize().soundHooks[0].id).toBe(2);
  });

  it('should serialize role and HUD marker components', () => {
    expect(new PacmanRoleComponent({ role: PACMAN_ROLE.PLAYER }).serialize()).toEqual({
      type: PACMAN_COMPONENT_TYPE.ROLE_COMPONENT,
      role: PACMAN_ROLE.PLAYER,
    });
    expect(new PacmanHudComponent({ hudType: PACMAN_HUD_TYPE.SCORE }).serialize()).toEqual({
      type: PACMAN_COMPONENT_TYPE.HUD_COMPONENT,
      hudType: PACMAN_HUD_TYPE.SCORE,
    });
  });

  it('should serialize ghost state as a stable payload snapshot', () => {
    const spawnTile = { row: 1, column: 2 };
    const sut = new PacmanGhostComponent({
      ghostId: PACMAN_GHOST_ID.BLINKY,
      mode: PACMAN_GHOST_MODE.CHASE,
      previousMode: PACMAN_GHOST_MODE.SCATTER,
      spawnTile,
      homeTile: { row: 3, column: 4 },
      houseEntryTile: { row: 3, column: 5 },
      houseExitTile: { row: 2, column: 5 },
      scatterTargetTile: { row: 1, column: 10 },
      released: true,
      releaseDelayMs: 0,
      releaseElapsedMs: 25,
      frightenedWindowId: 2,
    });

    const serialized = sut.serialize();

    spawnTile.row = 99;

    expect(serialized).toEqual({
      type: PACMAN_COMPONENT_TYPE.GHOST_COMPONENT,
      ghostId: PACMAN_GHOST_ID.BLINKY,
      mode: PACMAN_GHOST_MODE.CHASE,
      previousMode: PACMAN_GHOST_MODE.SCATTER,
      spawnTile: { row: 1, column: 2 },
      homeTile: { row: 3, column: 4 },
      houseEntryTile: { row: 3, column: 5 },
      houseExitTile: { row: 2, column: 5 },
      scatterTargetTile: { row: 1, column: 10 },
      released: true,
      releaseDelayMs: 0,
      releaseElapsedMs: 25,
      frightenedWindowId: 2,
    });
    expect(serialized.spawnTile).not.toBe(spawnTile);
  });
});
