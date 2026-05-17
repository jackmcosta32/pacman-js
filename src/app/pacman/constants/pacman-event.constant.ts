export const PACMAN_EVENT_TYPE = {
  MOVEMENT_REQUEST: 'MovementRequestEvent',
  PAUSE_TOGGLE: 'PauseToggleEvent',
  START_MATCH_REQUEST: 'StartMatchRequestEvent',
  RESTART_REQUEST: 'RestartRequestEvent',
  RETURN_TO_MENU_REQUEST: 'ReturnToMenuRequestEvent',
  MENU_NAVIGATE: 'MenuNavigateEvent',
  MENU_SELECT: 'MenuSelectEvent',
  MOVEMENT: 'MovementEvent',
  COLLISION: 'CollisionEvent',
} as const;
