import { COMPONENT_TYPE } from '@shared/constants/component.constant';

export const PACMAN_COMPONENT_TYPE = {
  ...COMPONENT_TYPE,
  ACTOR_COMPONENT: 'actor',
  TILE_COMPONENT: 'pacman-tile',
  SPAWN_COMPONENT: 'pacman-spawn',
  HUD_COMPONENT: 'pacman-hud',
  ROLE_COMPONENT: 'pacman-role',
  GAME_STATE_COMPONENT: 'pacman-game-state',
  COLLECTIBLE_COMPONENT: 'pacman-collectible',
} as const;
