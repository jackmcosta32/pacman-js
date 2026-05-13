export const SCENE_EVENT_TYPE = {
  INIT: 'SceneInitEvent',
  UPDATE: 'SceneUpdateEvent',
  DESTROY: 'SceneDestroyEvent',
} as const;

export const KEYBOARD_EVENT_TYPE = {
  KEY_UP: 'KeyUpEvent',
  KEY_DOWN: 'KeyDownEvent',
  KEY_PRESSED: 'KeyPressedEvent',
} as const;

export const CURSOR_EVENT_TYPE = {
  CLICK: 'ClickEvent',
} as const;
