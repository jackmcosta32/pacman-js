import type { Values } from '@shared/types/util.type';
import type {
  PACMAN_MENU_ITEM,
  PACMAN_MENU_ACTION,
  PACMAN_MENU_NAVIGATION_DIRECTION,
} from '@pacman/constants/pacman-menu.constant';

export type IPacmanMenuItem = Values<typeof PACMAN_MENU_ITEM>;
export type IPacmanMenuAction = Values<typeof PACMAN_MENU_ACTION>;
export type IPacmanMenuNavigationDirection = Values<typeof PACMAN_MENU_NAVIGATION_DIRECTION>;
