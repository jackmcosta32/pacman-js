export const PACMAN_ROUND_STATUS = {
  PLAYING: 'playing',
  PAUSED: 'paused',
  RESPAWNING: 'respawning',
  WON: 'won',
  GAME_OVER: 'game-over',
} as const;

export const PACMAN_ROLE = {
  PLAYER: 'player',
  GHOST: 'ghost',
} as const;

export const PACMAN_HUD_TYPE = {
  SCORE: 'score',
  LIVES: 'lives',
  STATUS: 'status',
  OVERLAY_STATUS: 'overlay-status',
  OVERLAY_PROMPT: 'overlay-prompt',
} as const;

export const PACMAN_SOUND_EFFECT = {
  START: 'start',
  PELLET: 'pellet',
  POWER_PELLET: 'power-pellet',
  DEATH: 'death',
  GHOST_EATEN: 'ghost-eaten',
} as const;

export const PACMAN_GAME_STATE_DEFAULTS = {
  LIVES: 3,
  RESPAWN_DELAY_MS: 1000,
  FRIGHTENED_DURATION_MS: 6000,
  SOUND_HOOK_MAX_LENGTH: 12,
} as const;
