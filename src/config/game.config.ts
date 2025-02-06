import type { TInputScheme } from '../models/input.model';

// Display Settings
export const FRAME_RATE = 12;
export const SECONDS_PER_FRAME = 1000 / FRAME_RATE;

// UI Settings
export const TILE_SIZE = 48;
export const SPRITE_SIZE = 48;

// Sprites
export const SPRITES_IMAGE_SRC = './assets/sprites.png';

// Input Settings
export const INPUT_THROTTLE = SECONDS_PER_FRAME;

export const INPUT_DEFAULT_SCHEME: TInputScheme = {
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
};
