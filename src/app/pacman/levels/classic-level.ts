import { TILE_SIZE } from '@pacman/config/pacman-game.config';
import type { IPacmanLevelDefinition } from '@pacman/interfaces/pacman-level.interface';

export const PACMAN_CLASSIC_LEVEL: IPacmanLevelDefinition = {
  id: 'classic-compact',
  name: 'Classic Compact',
  tileSize: TILE_SIZE,
  rows: [
    '#############',
    '#o...#...o..#',
    '#.##.#.##.#.#',
    'T....P....G.T',
    '#.##.#.##.#.#',
    '#....HHH....#',
    '#############',
  ],
};
