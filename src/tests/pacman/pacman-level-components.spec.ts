import { describe, expect, it } from 'vitest';
import { PositionComponent } from '@game-engine/components/position.component';
import { PacmanTileComponent } from '@pacman/components/pacman-tile.component';
import { PacmanSpawnComponent } from '@pacman/components/pacman-spawn.component';
import { parsePacmanLevel } from '@pacman/levels/pacman-level.parser';
import { PACMAN_COMPONENT_TYPE } from '@pacman/constants/pacman-component.constant';
import { PacmanLevelEntityFactory } from '@pacman/factories/pacman-level-entity.factory';
import { PacmanCollectibleComponent } from '@pacman/components/pacman-collectible.component';
import type { IPacmanLevelDefinition } from '@pacman/interfaces/pacman-level.interface';
import {
  PACMAN_TILE_TYPE,
  PACMAN_SPAWN_TYPE,
  PACMAN_TILE_SYMBOL,
  PACMAN_COLLECTIBLE_TYPE,
} from '@pacman/constants/pacman-level.constant';

const levelDefinition: IPacmanLevelDefinition = {
  id: 'factory-test',
  name: 'Factory Test',
  tileSize: 10,
  rows: ['#####', 'T P T', '#.Go#', '#H  #', '#####'],
};

describe('Pac-Man - Level components and factories', () => {
  it('should serialize tile state', () => {
    const sut = new PacmanTileComponent({
      row: 1,
      column: 2,
      symbol: PACMAN_TILE_SYMBOL.PLAYER_SPAWN,
      tileType: PACMAN_TILE_TYPE.PLAYER_SPAWN,
      walkable: true,
      blocking: false,
    });

    expect(sut.serialize()).toEqual({
      type: PACMAN_COMPONENT_TYPE.TILE_COMPONENT,
      row: 1,
      column: 2,
      symbol: PACMAN_TILE_SYMBOL.PLAYER_SPAWN,
      tileType: PACMAN_TILE_TYPE.PLAYER_SPAWN,
      walkable: true,
      blocking: false,
    });
  });

  it('should serialize collectible state', () => {
    const sut = new PacmanCollectibleComponent({
      collectibleType: PACMAN_COLLECTIBLE_TYPE.POWER_PELLET,
      scoreValue: 50,
    });

    expect(sut.serialize()).toEqual({
      type: PACMAN_COMPONENT_TYPE.COLLECTIBLE_COMPONENT,
      collectibleType: PACMAN_COLLECTIBLE_TYPE.POWER_PELLET,
      scoreValue: 50,
    });
  });

  it('should serialize spawn state', () => {
    const sut = new PacmanSpawnComponent({ spawnType: PACMAN_SPAWN_TYPE.GHOST });

    expect(sut.serialize()).toEqual({
      type: PACMAN_COMPONENT_TYPE.SPAWN_COMPONENT,
      spawnType: PACMAN_SPAWN_TYPE.GHOST,
    });
  });

  it('should compose wall entities with tile and position components only', () => {
    const level = parsePacmanLevel(levelDefinition);
    const sut = PacmanLevelEntityFactory.makeWall(level.getTileAt(0, 0)!);

    expect(sut.getComponent(PacmanTileComponent)).toMatchObject({ tileType: PACMAN_TILE_TYPE.WALL });
    expect(sut.getComponent(PositionComponent)).toMatchObject({ position: { x: 0, y: 0 } });
    expect(sut.getComponent(PacmanCollectibleComponent)).toBeUndefined();
    expect(sut.getComponent(PacmanSpawnComponent)).toBeUndefined();
  });

  it('should compose pellet and power pellet entities as collectibles', () => {
    const level = parsePacmanLevel(levelDefinition);
    const pellet = PacmanLevelEntityFactory.makePellet(level.getTileAt(2, 1)!);
    const powerPellet = PacmanLevelEntityFactory.makePowerPellet(level.getTileAt(2, 3)!);

    expect(pellet.getComponent(PacmanCollectibleComponent)).toMatchObject({
      collectibleType: PACMAN_COLLECTIBLE_TYPE.PELLET,
      scoreValue: 10,
    });
    expect(powerPellet.getComponent(PacmanCollectibleComponent)).toMatchObject({
      collectibleType: PACMAN_COLLECTIBLE_TYPE.POWER_PELLET,
      scoreValue: 50,
    });
  });

  it('should compose spawn markers without collectible components', () => {
    const level = parsePacmanLevel(levelDefinition);
    const playerSpawn = PacmanLevelEntityFactory.makePlayerSpawn(level.playerSpawn);
    const ghostSpawn = PacmanLevelEntityFactory.makeGhostSpawn(level.ghostSpawns[0]);
    const tunnel = PacmanLevelEntityFactory.makeTunnel(level.tunnelTiles[0]);
    const ghostHouse = PacmanLevelEntityFactory.makeGhostHouse(level.ghostHouseTiles[0]);

    expect(playerSpawn.getComponent(PacmanSpawnComponent)).toMatchObject({ spawnType: PACMAN_SPAWN_TYPE.PLAYER });
    expect(ghostSpawn.getComponent(PacmanSpawnComponent)).toMatchObject({ spawnType: PACMAN_SPAWN_TYPE.GHOST });
    expect(tunnel.getComponent(PacmanCollectibleComponent)).toBeUndefined();
    expect(ghostHouse.getComponent(PacmanCollectibleComponent)).toBeUndefined();
  });
});
