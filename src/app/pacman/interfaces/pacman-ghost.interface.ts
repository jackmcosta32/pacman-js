import type { Values } from '@shared/types/util.type';
import type {
  PACMAN_GHOST_ID,
  PACMAN_GHOST_MODE,
  PACMAN_GHOST_SCATTER_CORNER,
} from '@pacman/constants/pacman-ghost.constant';

export type IPacmanGhostId = Values<typeof PACMAN_GHOST_ID>;
export type IPacmanGhostMode = Values<typeof PACMAN_GHOST_MODE>;
export type IPacmanGhostScatterCorner = Values<typeof PACMAN_GHOST_SCATTER_CORNER>;

export interface IPacmanGhostTileCoordinate {
  row: number;
  column: number;
}
