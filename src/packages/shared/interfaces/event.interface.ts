import type { Values } from '@shared/types/util.type';
import { CURSOR_EVENT_TYPE, KEYBOARD_EVENT_TYPE } from '@shared/constants/event.constant';

export interface IEvent {
  type: string;
}

export type IKeyboardEventType = Values<typeof KEYBOARD_EVENT_TYPE>;

export interface IKeyboardEvent {
  type: IKeyboardEventType;
  keyCode: string;
}

export type ICursorEventType = Values<typeof CURSOR_EVENT_TYPE>;

export interface ICursorEvent {
  type: ICursorEventType;
}

export type IInputEventType = IKeyboardEventType | ICursorEventType;

export type IInputEvent = IKeyboardEvent | ICursorEvent;
