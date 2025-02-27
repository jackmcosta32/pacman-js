import type { Values } from '@shared/types/util.type';

export const LOG_LEVEL = {
  INFO: 'info',
  WARNING: 'warn',
  ERROR: 'error',
} as const;

export type ILogLevel = Values<typeof LOG_LEVEL>;

export interface IGameClientDebugger {
  log(level: ILogLevel, ...args: unknown[]): void;
}
