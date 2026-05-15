import { PACMAN_ACTOR_DIRECTION } from './pacman-actor.constant';

export const PACMAN_GHOST_ID = {
  BLINKY: 'blinky',
  PINKY: 'pinky',
  INKY: 'inky',
  CLYDE: 'clyde',
} as const;

export const PACMAN_GHOST_MODE = {
  SCATTER: 'scatter',
  CHASE: 'chase',
  FRIGHTENED: 'frightened',
  EATEN: 'eaten',
  RETURNING_HOME: 'returning-home',
} as const;

export const PACMAN_GHOST_SCATTER_CORNER = {
  TOP_RIGHT: 'top-right',
  TOP_LEFT: 'top-left',
  BOTTOM_RIGHT: 'bottom-right',
  BOTTOM_LEFT: 'bottom-left',
} as const;

export const PACMAN_GHOST_MODE_PHASES = [
  { mode: PACMAN_GHOST_MODE.SCATTER, durationMs: 7000 },
  { mode: PACMAN_GHOST_MODE.CHASE, durationMs: 20000 },
  { mode: PACMAN_GHOST_MODE.SCATTER, durationMs: 7000 },
  { mode: PACMAN_GHOST_MODE.CHASE, durationMs: 20000 },
  { mode: PACMAN_GHOST_MODE.SCATTER, durationMs: 5000 },
  { mode: PACMAN_GHOST_MODE.CHASE, durationMs: 20000 },
  { mode: PACMAN_GHOST_MODE.SCATTER, durationMs: 5000 },
  { mode: PACMAN_GHOST_MODE.CHASE, durationMs: Number.POSITIVE_INFINITY },
] as const;

export const PACMAN_GHOST_BASE_SPEED = 0.085;
export const PACMAN_GHOST_FRIGHTENED_SPEED = 0.055;
export const PACMAN_GHOST_RETURNING_SPEED = 0.16;
export const PACMAN_GHOST_CLYDE_CHASE_DISTANCE = 8;

export const PACMAN_GHOST_EATEN_SCORE_VALUES = [200, 400, 800, 1600] as const;

export const PACMAN_GHOST_CONFIG = {
  [PACMAN_GHOST_ID.BLINKY]: {
    releaseDelayMs: 0,
    direction: PACMAN_ACTOR_DIRECTION.LEFT,
    scatterCorner: PACMAN_GHOST_SCATTER_CORNER.TOP_RIGHT,
  },
  [PACMAN_GHOST_ID.PINKY]: {
    releaseDelayMs: 1500,
    direction: PACMAN_ACTOR_DIRECTION.UP,
    scatterCorner: PACMAN_GHOST_SCATTER_CORNER.TOP_LEFT,
  },
  [PACMAN_GHOST_ID.INKY]: {
    releaseDelayMs: 3500,
    direction: PACMAN_ACTOR_DIRECTION.RIGHT,
    scatterCorner: PACMAN_GHOST_SCATTER_CORNER.BOTTOM_RIGHT,
  },
  [PACMAN_GHOST_ID.CLYDE]: {
    releaseDelayMs: 5500,
    direction: PACMAN_ACTOR_DIRECTION.LEFT,
    scatterCorner: PACMAN_GHOST_SCATTER_CORNER.BOTTOM_LEFT,
  },
} as const;
