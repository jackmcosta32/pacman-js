import { describe, expect, it } from 'vitest';
import { PACMAN_TILE_TYPE } from '@pacman/constants/pacman-level.constant';
import { parsePacmanLevel } from '@pacman/levels/pacman-level.parser';
import type { IPacmanLevelDefinition } from '@pacman/interfaces/pacman-level.interface';

const makeDefinition = (rows?: string[]): IPacmanLevelDefinition => ({
  id: 'test-level',
  name: 'Test Level',
  tileSize: 10,
  rows: rows ?? ['#####', 'T P T', '#.Go#', '#H  #', '#####'],
});

describe('Pac-Man - Level parser', () => {
  it('should parse level dimensions, tiles, spawns, ghost house, collectibles, and tunnels', () => {
    const sut = parsePacmanLevel(makeDefinition());

    expect(sut.width).toBe(5);
    expect(sut.height).toBe(5);
    expect(sut.size).toEqual({ width: 50, height: 50 });
    expect(sut.tiles).toHaveLength(25);
    expect(sut.playerSpawn).toMatchObject({ row: 1, column: 2, type: PACMAN_TILE_TYPE.PLAYER_SPAWN });
    expect(sut.ghostSpawns).toHaveLength(1);
    expect(sut.ghostHouseTiles).toHaveLength(1);
    expect(sut.tunnelTiles).toHaveLength(2);
    expect(sut.getTilesByType(PACMAN_TILE_TYPE.PELLET)).toHaveLength(1);
    expect(sut.getTilesByType(PACMAN_TILE_TYPE.POWER_PELLET)).toHaveLength(1);
    expect(sut.tunnelTiles[0].tunnelExit).toEqual({ row: 1, column: 4 });
    expect(sut.tunnelTiles[1].tunnelExit).toEqual({ row: 1, column: 0 });
  });

  it('should preserve leading and trailing spaces as path tiles', () => {
    const sut = parsePacmanLevel(makeDefinition([' T T ', ' P G ', '  H  ']));

    expect(sut.width).toBe(5);
    expect(sut.getTileAt(0, 0)).toMatchObject({ symbol: ' ', type: PACMAN_TILE_TYPE.PATH });
    expect(sut.getTileAt(0, 4)).toMatchObject({ symbol: ' ', type: PACMAN_TILE_TYPE.PATH });
    expect(sut.isWalkableAt(0, 0)).toBe(true);
  });

  it('should reject rows with different lengths', () => {
    expect(() => parsePacmanLevel(makeDefinition(['#####', '#P G#', '#H#']))).toThrow(
      'Pac-Man level test-level row 2 has length 3; expected 5',
    );
  });

  it('should reject unsupported symbols with row and column context', () => {
    expect(() => parsePacmanLevel(makeDefinition(['#####', 'T*P T', '#.Go#', '#H  #', '#####']))).toThrow(
      'Unsupported Pac-Man level symbol "*" at row 1, column 1',
    );
  });

  it('should reject missing or duplicate player spawns', () => {
    expect(() => parsePacmanLevel(makeDefinition(['#####', 'T   T', '#.Go#', '#H  #', '#####']))).toThrow(
      'Pac-Man level test-level must include exactly one player spawn',
    );
    expect(() => parsePacmanLevel(makeDefinition(['#####', 'TPP T', '#.Go#', '#H  #', '#####']))).toThrow(
      'Pac-Man level test-level must include exactly one player spawn',
    );
  });

  it('should reject missing ghost spawns and ghost house tiles', () => {
    expect(() => parsePacmanLevel(makeDefinition(['#####', 'T P T', '#. o#', '#H  #', '#####']))).toThrow(
      'Pac-Man level test-level must include at least one ghost spawn',
    );
    expect(() => parsePacmanLevel(makeDefinition(['#####', 'T P T', '#.Go#', '#   #', '#####']))).toThrow(
      'Pac-Man level test-level must include at least one ghost house tile',
    );
  });

  it('should reject invalid tunnel counts', () => {
    expect(() => parsePacmanLevel(makeDefinition(['#####', 'T P #', '#.Go#', '#H  #', '#####']))).toThrow(
      'Pac-Man level test-level must include either zero tunnel tiles or exactly two tunnel tiles',
    );
  });

  it('should expose tile lookup and coordinate conversions', () => {
    const sut = parsePacmanLevel(makeDefinition());

    expect(sut.getTileAt(0, 0)).toMatchObject({ type: PACMAN_TILE_TYPE.WALL });
    expect(sut.getTileAt(-1, 0)).toBeUndefined();
    expect(sut.getTileAt(99, 99)).toBeUndefined();
    expect(sut.tileToWorldPosition(2, 3)).toEqual({ x: 30, y: 20 });
    expect(sut.worldToTileCoordinate({ x: 39, y: 21 })).toEqual({ x: 3, y: 2 });
  });

  it('should expose walkability and wall queries with defined out-of-bounds behavior', () => {
    const sut = parsePacmanLevel(makeDefinition());

    expect(sut.isWallAt(0, 0)).toBe(true);
    expect(sut.isWallAt(-1, 0)).toBe(false);
    expect(sut.isWalkableAt(1, 2)).toBe(true);
    expect(sut.isWalkableAt(0, 0)).toBe(false);
    expect(sut.isWalkableAt(99, 99)).toBe(false);
  });

  it('should return blocking tiles for bounding boxes without throwing out of bounds', () => {
    const sut = parsePacmanLevel(makeDefinition());

    expect(sut.getBlockingTilesForBoundingBox({ x: 0, y: 0, width: 10, height: 10 })).toHaveLength(1);
    expect(sut.getBlockingTilesForBoundingBox({ x: 9, y: 9, width: 2, height: 2 })).toHaveLength(2);
    expect(sut.getBlockingTilesForBoundingBox({ x: -5, y: -5, width: 8, height: 8 })).toHaveLength(1);
    expect(sut.getBlockingTilesForBoundingBox({ x: 999, y: 999, width: 10, height: 10 })).toHaveLength(0);
  });
});
