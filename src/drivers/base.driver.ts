export abstract class BaseDriver {
  public abstract init(): void | Promise<void>;
}
