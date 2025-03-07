import { COMPONENT_TYPE } from '@shared/constants/component.constant';

export const PACMAN_COMPONENT_TYPE = {
  ...COMPONENT_TYPE,
  ACTOR_COMPONENT: 'actor',
} as const;
