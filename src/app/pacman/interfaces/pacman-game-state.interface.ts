import type { Values } from '@shared/types/util.type';
import type {
  PACMAN_HUD_TYPE,
  PACMAN_ROLE,
  PACMAN_ROUND_STATUS,
  PACMAN_SOUND_EFFECT,
} from '@pacman/constants/pacman-game-state.constant';

export type IPacmanRoundStatus = Values<typeof PACMAN_ROUND_STATUS>;
export type IPacmanRole = Values<typeof PACMAN_ROLE>;
export type IPacmanHudType = Values<typeof PACMAN_HUD_TYPE>;
export type IPacmanSoundEffect = Values<typeof PACMAN_SOUND_EFFECT>;

export interface IPacmanSoundHook {
  id: number;
  soundEffect: IPacmanSoundEffect;
}
