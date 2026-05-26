import { describe, expect, it, vi } from 'vitest';
import { GameClientDebugger } from '@game-client/game-client-debugger';
import { LOG_LEVEL } from '@game-client/interfaces/game-client-debugger.interface';

describe('Game Client - GameClientDebugger', () => {
  it('should start disabled by default and toggle enabled state', () => {
    const sut = new GameClientDebugger();

    expect(sut.isEnabled()).toBe(false);
    expect(sut.toggle()).toBe(true);
    expect(sut.isEnabled()).toBe(true);
  });

  it('should record frame and scene overlay state', () => {
    const sut = new GameClientDebugger({ enabled: true });

    sut.recordFrame(1000);
    sut.recordFrame(1050);
    sut.recordSceneSnapshot(
      {
        id: 'classic-match',
        size: { width: 100, height: 100 },
        viewport: { width: 100, height: 100 },
        entities: [{ id: 'player', components: {} }],
      },
      { row: 3, column: 4 },
    );

    expect(sut.getOverlaySnapshot()).toEqual({
      fps: 20,
      sceneId: 'classic-match',
      entityCount: 1,
      playerTile: '3,4',
    });
  });

  it('should log only when enabled and at the configured level', () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => undefined);
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const sut = new GameClientDebugger({ enabled: true, logLevel: LOG_LEVEL.WARNING });

    sut.log(LOG_LEVEL.INFO, 'hidden');
    sut.log(LOG_LEVEL.WARNING, 'visible', { reason: 'test' });
    sut.toggle();
    sut.log(LOG_LEVEL.WARNING, 'disabled');

    expect(info).not.toHaveBeenCalled();
    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning).toHaveBeenCalledWith('visible', { reason: 'test' });

    info.mockRestore();
    warning.mockRestore();
  });
});
