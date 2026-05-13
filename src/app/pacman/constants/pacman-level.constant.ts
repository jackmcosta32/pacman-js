export const PACMAN_TILE_TYPE = {
  WALL: 'wall',
  PATH: 'path',
  PELLET: 'pellet',
  POWER_PELLET: 'power-pellet',
  PLAYER_SPAWN: 'player-spawn',
  GHOST_SPAWN: 'ghost-spawn',
  GHOST_HOUSE: 'ghost-house',
  TUNNEL: 'tunnel',
} as const;

export const PACMAN_TILE_SYMBOL = {
  WALL: '#',
  PATH: ' ',
  PELLET: '.',
  POWER_PELLET: 'o',
  PLAYER_SPAWN: 'P',
  GHOST_SPAWN: 'G',
  GHOST_HOUSE: 'H',
  TUNNEL: 'T',
} as const;

export const PACMAN_COLLECTIBLE_TYPE = {
  PELLET: 'pellet',
  POWER_PELLET: 'power-pellet',
} as const;

export const PACMAN_SPAWN_TYPE = {
  PLAYER: 'player',
  GHOST: 'ghost',
} as const;

export const PACMAN_COLLECTIBLE_SCORE = {
  PELLET: 10,
  POWER_PELLET: 50,
} as const;
