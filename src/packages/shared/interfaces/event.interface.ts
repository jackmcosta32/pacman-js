import type { Values } from '@shared/types/util.type';

export interface IEvent {
  type: string;
}

export const KEYBOARD_EVENT_TYPES = {
  KEY_UP: 'KeyUpEvent',
  KEY_DOWN: 'KeyDownEvent',
  KEY_PRESSED: 'KeyPressedEvent',
} as const;

export type IKeyboardEventType = Values<typeof KEYBOARD_EVENT_TYPES>;

export interface IKeyboardEvent {
  type: IKeyboardEventType;
  keyCode: string;
}

export const CURSOR_EVENT_TYPES = {
  CLICK: 'ClickEvent',
};

export type ICursorEventType = Values<typeof CURSOR_EVENT_TYPES>;

export interface ICursorEvent {
  type: ICursorEventType;
}

export type IInputEvent = IKeyboardEvent | ICursorEvent;
