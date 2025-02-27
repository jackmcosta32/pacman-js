export abstract class Factory<Entity> {
  public abstract make(...args: unknown[]): Entity;
}
