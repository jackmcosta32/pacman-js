import type { IGameClientDebugger, ILogLevel } from './interfaces/game-client-debugger.interface';

export class GameClientDebugger implements IGameClientDebugger {
  private enabled = true;

  public log(level: ILogLevel, ...args: unknown[]): void {
    console[level](args);
  }
}
