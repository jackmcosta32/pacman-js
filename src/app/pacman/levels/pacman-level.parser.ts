import type { ICoordinate } from '@shared/interfaces/coordinate.interface';
import { PACMAN_TILE_SYMBOL, PACMAN_TILE_TYPE } from '@pacman/constants/pacman-level.constant';
import type {
  IPacmanTile,
  IPacmanTileType,
  IPacmanTileSymbol,
  IPacmanParsedLevel,
  IPacmanLevelDefinition,
} from '@pacman/interfaces/pacman-level.interface';

const TILE_SYMBOL_TO_TYPE: Record<string, IPacmanTileType> = {
  [PACMAN_TILE_SYMBOL.WALL]: PACMAN_TILE_TYPE.WALL,
  [PACMAN_TILE_SYMBOL.PATH]: PACMAN_TILE_TYPE.PATH,
  [PACMAN_TILE_SYMBOL.PELLET]: PACMAN_TILE_TYPE.PELLET,
  [PACMAN_TILE_SYMBOL.POWER_PELLET]: PACMAN_TILE_TYPE.POWER_PELLET,
  [PACMAN_TILE_SYMBOL.PLAYER_SPAWN]: PACMAN_TILE_TYPE.PLAYER_SPAWN,
  [PACMAN_TILE_SYMBOL.GHOST_SPAWN]: PACMAN_TILE_TYPE.GHOST_SPAWN,
  [PACMAN_TILE_SYMBOL.GHOST_HOUSE]: PACMAN_TILE_TYPE.GHOST_HOUSE,
  [PACMAN_TILE_SYMBOL.TUNNEL]: PACMAN_TILE_TYPE.TUNNEL,
};

const WALKABLE_TILE_TYPES = new Set<IPacmanTileType>([
  PACMAN_TILE_TYPE.PATH,
  PACMAN_TILE_TYPE.PELLET,
  PACMAN_TILE_TYPE.POWER_PELLET,
  PACMAN_TILE_TYPE.PLAYER_SPAWN,
  PACMAN_TILE_TYPE.GHOST_SPAWN,
  PACMAN_TILE_TYPE.GHOST_HOUSE,
  PACMAN_TILE_TYPE.TUNNEL,
]);

export const tileToWorldPosition = (row: number, column: number, tileSize: number): ICoordinate => ({
  x: column * tileSize,
  y: row * tileSize,
});

export const worldToTileCoordinate = (position: ICoordinate, tileSize: number): ICoordinate => ({
  x: Math.floor(position.x / tileSize),
  y: Math.floor(position.y / tileSize),
});

export const parsePacmanLevel = (definition: IPacmanLevelDefinition): IPacmanParsedLevel => {
  validateDefinitionShape(definition);

  const width = definition.rows[0].length;
  const height = definition.rows.length;
  const tiles: IPacmanTile[] = [];
  const grid: IPacmanTile[][] = [];

  definition.rows.forEach((rowText, row) => {
    const tileRow: IPacmanTile[] = [];

    for (let column = 0; column < rowText.length; column += 1) {
      const symbol = rowText[column] as IPacmanTileSymbol;
      const type = TILE_SYMBOL_TO_TYPE[symbol];

      if (!type) {
        throw new Error(`Unsupported Pac-Man level symbol "${symbol}" at row ${row}, column ${column}`);
      }

      const tile: IPacmanTile = {
        row,
        column,
        symbol,
        type,
        size: { width: definition.tileSize, height: definition.tileSize },
        position: tileToWorldPosition(row, column, definition.tileSize),
        walkable: WALKABLE_TILE_TYPES.has(type),
        blocking: type === PACMAN_TILE_TYPE.WALL,
      };

      tileRow.push(tile);
      tiles.push(tile);
    }

    grid.push(tileRow);
  });

  const playerSpawns = tiles.filter((tile) => tile.type === PACMAN_TILE_TYPE.PLAYER_SPAWN);
  const ghostSpawns = tiles.filter((tile) => tile.type === PACMAN_TILE_TYPE.GHOST_SPAWN);
  const ghostHouseTiles = tiles.filter((tile) => tile.type === PACMAN_TILE_TYPE.GHOST_HOUSE);
  const tunnelTiles = tiles.filter((tile) => tile.type === PACMAN_TILE_TYPE.TUNNEL);

  validateSpecialTiles(definition, playerSpawns, ghostSpawns, ghostHouseTiles, tunnelTiles);
  applyTunnelPairing(tunnelTiles);

  const getTileAt = (row: number, column: number): IPacmanTile | undefined => {
    return grid[row]?.[column];
  };

  const parsedLevel: IPacmanParsedLevel = {
    id: definition.id,
    name: definition.name,
    tileSize: definition.tileSize,
    rows: [...definition.rows],
    width,
    height,
    tiles,
    grid,
    playerSpawn: playerSpawns[0],
    ghostSpawns,
    ghostHouseTiles,
    tunnelTiles,
    size: {
      width: width * definition.tileSize,
      height: height * definition.tileSize,
    },
    getTileAt,
    getTilesByType: (type) => tiles.filter((tile) => tile.type === type),
    isWallAt: (row, column) => getTileAt(row, column)?.type === PACMAN_TILE_TYPE.WALL,
    isWalkableAt: (row, column) => getTileAt(row, column)?.walkable ?? false,
    tileToWorldPosition: (row, column) => tileToWorldPosition(row, column, definition.tileSize),
    worldToTileCoordinate: (position) => worldToTileCoordinate(position, definition.tileSize),
    getBlockingTilesForBoundingBox: (boundingBox) => {
      const startColumn = Math.max(0, Math.floor(boundingBox.x / definition.tileSize));
      const startRow = Math.max(0, Math.floor(boundingBox.y / definition.tileSize));
      const endColumn = Math.min(width - 1, Math.floor((boundingBox.x + boundingBox.width - 1) / definition.tileSize));
      const endRow = Math.min(height - 1, Math.floor((boundingBox.y + boundingBox.height - 1) / definition.tileSize));
      const blockingTiles: IPacmanTile[] = [];

      if (endColumn < 0 || endRow < 0 || startColumn > width - 1 || startRow > height - 1) return blockingTiles;

      for (let row = startRow; row <= endRow; row += 1) {
        for (let column = startColumn; column <= endColumn; column += 1) {
          const tile = getTileAt(row, column);

          if (tile?.blocking) blockingTiles.push(tile);
        }
      }

      return blockingTiles;
    },
  };

  return parsedLevel;
};

const validateDefinitionShape = (definition: IPacmanLevelDefinition): void => {
  if (!definition.rows.length) {
    throw new Error(`Pac-Man level ${definition.id} must include at least one row`);
  }

  if (definition.tileSize <= 0) {
    throw new Error(`Pac-Man level ${definition.id} tileSize must be greater than zero`);
  }

  const width = definition.rows[0].length;

  definition.rows.forEach((row, index) => {
    if (row.length !== width) {
      throw new Error(`Pac-Man level ${definition.id} row ${index} has length ${row.length}; expected ${width}`);
    }
  });
};

const validateSpecialTiles = (
  definition: IPacmanLevelDefinition,
  playerSpawns: IPacmanTile[],
  ghostSpawns: IPacmanTile[],
  ghostHouseTiles: IPacmanTile[],
  tunnelTiles: IPacmanTile[],
): void => {
  if (playerSpawns.length !== 1) {
    throw new Error(`Pac-Man level ${definition.id} must include exactly one player spawn`);
  }

  if (!ghostSpawns.length) {
    throw new Error(`Pac-Man level ${definition.id} must include at least one ghost spawn`);
  }

  if (!ghostHouseTiles.length) {
    throw new Error(`Pac-Man level ${definition.id} must include at least one ghost house tile`);
  }

  if (tunnelTiles.length !== 0 && tunnelTiles.length !== 2) {
    throw new Error(`Pac-Man level ${definition.id} must include either zero tunnel tiles or exactly two tunnel tiles`);
  }
};

const applyTunnelPairing = (tunnelTiles: IPacmanTile[]): void => {
  if (tunnelTiles.length !== 2) return;

  const [firstTunnel, secondTunnel] = tunnelTiles;

  firstTunnel.tunnelExit = { row: secondTunnel.row, column: secondTunnel.column };
  secondTunnel.tunnelExit = { row: firstTunnel.row, column: firstTunnel.column };
};
