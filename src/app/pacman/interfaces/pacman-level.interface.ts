import type { Values } from '@shared/types/util.type';
import type { ISize } from '@shared/interfaces/geometry.interface';
import type { IBoundingBox, ICoordinate } from '@shared/interfaces/coordinate.interface';
import {
  PACMAN_SPAWN_TYPE,
  PACMAN_TILE_TYPE,
  PACMAN_TILE_SYMBOL,
  PACMAN_COLLECTIBLE_TYPE,
} from '@pacman/constants/pacman-level.constant';

export type IPacmanTileType = Values<typeof PACMAN_TILE_TYPE>;
export type IPacmanTileSymbol = Values<typeof PACMAN_TILE_SYMBOL>;
export type IPacmanSpawnType = Values<typeof PACMAN_SPAWN_TYPE>;
export type IPacmanCollectibleType = Values<typeof PACMAN_COLLECTIBLE_TYPE>;

export interface IPacmanLevelDefinition {
  id: string;
  name: string;
  rows: string[];
  tileSize: number;
}

export interface IPacmanTile {
  row: number;
  column: number;
  symbol: IPacmanTileSymbol;
  type: IPacmanTileType;
  size: ISize;
  position: ICoordinate;
  walkable: boolean;
  blocking: boolean;
  tunnelExit?: IPacmanTileCoordinate;
}

export interface IPacmanTileCoordinate {
  row: number;
  column: number;
}

export interface IPacmanLevelModel {
  id: string;
  name: string;
  rows: string[];
  width: number;
  height: number;
  tileSize: number;
  size: ISize;
  tiles: IPacmanTile[];
  grid: IPacmanTile[][];
  playerSpawn: IPacmanTile;
  ghostSpawns: IPacmanTile[];
  ghostHouseTiles: IPacmanTile[];
  tunnelTiles: IPacmanTile[];
}

export interface IPacmanLevelQueries {
  getTileAt(row: number, column: number): IPacmanTile | undefined;
  getTilesByType(type: IPacmanTileType): IPacmanTile[];
  isWallAt(row: number, column: number): boolean;
  isWalkableAt(row: number, column: number): boolean;
  tileToWorldPosition(row: number, column: number): ICoordinate;
  worldToTileCoordinate(position: ICoordinate): ICoordinate;
  getBlockingTilesForBoundingBox(boundingBox: IBoundingBox): IPacmanTile[];
}

export type IPacmanParsedLevel = IPacmanLevelModel & IPacmanLevelQueries;
