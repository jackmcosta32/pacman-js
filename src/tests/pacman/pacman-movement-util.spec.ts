import { describe, expect, it } from 'vitest';
import { parsePacmanLevel } from '@pacman/levels/pacman-level.parser';
import { PACMAN_ACTOR_DIRECTION } from '@pacman/constants/pacman-actor.constant';
import type { IPacmanLevelDefinition } from '@pacman/interfaces/pacman-level.interface';
import {
  getActorCenter,
  getActorTile,
  getDirectionVector,
  getProjectedBoundingBox,
  getTileCenter,
  isActorNearTileCenter,
  isBoundingBoxOutsideLevel,
  snapActorPerpendicularToTileCenter,
} from '@pacman/utils/pacman-movement.util';

const makeDefinition = (): IPacmanLevelDefinition => ({
  id: 'movement-util-level',
  name: 'Movement Util Level',
  tileSize: 10,
  rows: ['#####', '#P G#', '#   #', '#H  #', '#####'],
});

describe('Pac-Man - Movement utilities', () => {
  it('should convert actor and tile positions through their centers', () => {
    const level = parsePacmanLevel(makeDefinition());
    const tile = level.getTileAt(1, 1);

    expect(tile).toBeDefined();
    expect(getActorCenter({ x: 10, y: 10 }, { width: 10, height: 10 })).toEqual({ x: 15, y: 15 });
    expect(getTileCenter(tile!)).toEqual({ x: 15, y: 15 });
    expect(getActorTile(level, { x: 10, y: 10 }, { width: 10, height: 10 })).toBe(tile);
  });

  it('should expose direction vectors and projected actor bounding boxes', () => {
    expect(getDirectionVector(PACMAN_ACTOR_DIRECTION.LEFT)).toEqual({ x: -1, y: 0 });
    expect(getDirectionVector(PACMAN_ACTOR_DIRECTION.DOWN)).toEqual({ x: 0, y: 1 });
    expect(getProjectedBoundingBox({ x: 10, y: 20 }, { width: 8, height: 9 })).toEqual({
      x: 10,
      y: 20,
      width: 8,
      height: 9,
    });
  });

  it('should detect center tolerance and snap only the perpendicular axis', () => {
    const level = parsePacmanLevel(makeDefinition());
    const tile = level.getTileAt(1, 1);

    expect(tile).toBeDefined();
    expect(isActorNearTileCenter({ x: 10, y: 12 }, { width: 10, height: 10 }, tile!, 2)).toBe(true);
    expect(isActorNearTileCenter({ x: 10, y: 13 }, { width: 10, height: 10 }, tile!, 2)).toBe(false);
    expect(
      snapActorPerpendicularToTileCenter(
        { x: 11, y: 12 },
        { width: 10, height: 10 },
        tile!,
        PACMAN_ACTOR_DIRECTION.RIGHT,
        2,
      ),
    ).toEqual({ x: 11, y: 10 });
  });

  it('should treat projected positions outside the level as out of bounds', () => {
    const level = parsePacmanLevel(makeDefinition());

    expect(isBoundingBoxOutsideLevel(level, { x: -1, y: 10, width: 10, height: 10 })).toBe(true);
    expect(isBoundingBoxOutsideLevel(level, { x: 10, y: 10, width: 10, height: 10 })).toBe(false);
    expect(level.getBlockingTilesForBoundingBox({ x: 0, y: 0, width: 10, height: 10 })).toHaveLength(1);
  });
});
