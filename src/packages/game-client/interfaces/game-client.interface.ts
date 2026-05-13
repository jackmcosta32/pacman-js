export interface IGameClient {
  start(): void | Promise<void>;
  stop(): void;
}
