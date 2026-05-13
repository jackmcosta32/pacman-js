import { EntityFactory } from '@game-engine/factories/entity.factory';
import type { IEntity } from '@game-engine/interfaces/entity.interface';
import { PositionComponent } from '@game-engine/components/position.component';
import { PacmanTileComponent } from '@pacman/components/pacman-tile.component';
import { PacmanSpawnComponent } from '@pacman/components/pacman-spawn.component';
import { PACMAN_TILE_TYPE, PACMAN_SPAWN_TYPE, PACMAN_COLLECTIBLE_TYPE } from '@pacman/constants/pacman-level.constant';
import { PacmanCollectibleComponent } from '@pacman/components/pacman-collectible.component';
import type { IPacmanTile, IPacmanParsedLevel } from '@pacman/interfaces/pacman-level.interface';
import { PACMAN_COLLECTIBLE_SCORE } from '@pacman/constants/pacman-level.constant';

export class PacmanLevelEntityFactory {
  public static makeStaticEntities(level: IPacmanParsedLevel): IEntity[] {
    return [
      ...level.getTilesByType(PACMAN_TILE_TYPE.WALL).map((tile) => this.makeWall(tile)),
      ...level.getTilesByType(PACMAN_TILE_TYPE.PELLET).map((tile) => this.makePellet(tile)),
      ...level.getTilesByType(PACMAN_TILE_TYPE.POWER_PELLET).map((tile) => this.makePowerPellet(tile)),
      ...level.getTilesByType(PACMAN_TILE_TYPE.TUNNEL).map((tile) => this.makeTunnel(tile)),
      ...level.getTilesByType(PACMAN_TILE_TYPE.GHOST_HOUSE).map((tile) => this.makeGhostHouse(tile)),
      this.makePlayerSpawn(level.playerSpawn),
      ...level.ghostSpawns.map((tile) => this.makeGhostSpawn(tile)),
    ];
  }

  public static makeWall(tile: IPacmanTile): IEntity {
    return this.withBaseTileComponents(tile).make();
  }

  public static makePellet(tile: IPacmanTile): IEntity {
    return this.withBaseTileComponents(tile)
      .with(
        new PacmanCollectibleComponent({
          collectibleType: PACMAN_COLLECTIBLE_TYPE.PELLET,
          scoreValue: PACMAN_COLLECTIBLE_SCORE.PELLET,
        }),
      )
      .make();
  }

  public static makePowerPellet(tile: IPacmanTile): IEntity {
    return this.withBaseTileComponents(tile)
      .with(
        new PacmanCollectibleComponent({
          collectibleType: PACMAN_COLLECTIBLE_TYPE.POWER_PELLET,
          scoreValue: PACMAN_COLLECTIBLE_SCORE.POWER_PELLET,
        }),
      )
      .make();
  }

  public static makeTunnel(tile: IPacmanTile): IEntity {
    return this.withBaseTileComponents(tile).make();
  }

  public static makeGhostHouse(tile: IPacmanTile): IEntity {
    return this.withBaseTileComponents(tile).make();
  }

  public static makePlayerSpawn(tile: IPacmanTile): IEntity {
    return this.withBaseTileComponents(tile)
      .with(new PacmanSpawnComponent({ spawnType: PACMAN_SPAWN_TYPE.PLAYER }))
      .make();
  }

  public static makeGhostSpawn(tile: IPacmanTile): IEntity {
    return this.withBaseTileComponents(tile)
      .with(new PacmanSpawnComponent({ spawnType: PACMAN_SPAWN_TYPE.GHOST }))
      .make();
  }

  private static withBaseTileComponents(tile: IPacmanTile): typeof EntityFactory {
    return EntityFactory.with(
      new PacmanTileComponent({
        row: tile.row,
        column: tile.column,
        symbol: tile.symbol,
        tileType: tile.type,
        walkable: tile.walkable,
        blocking: tile.blocking,
      }),
    ).with(
      new PositionComponent({
        size: tile.size,
        position: { ...tile.position },
      }),
    );
  }
}
