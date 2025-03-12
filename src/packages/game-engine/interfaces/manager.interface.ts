export interface IManageable {
  id: string;
}

export interface IManager<Manageable extends IManageable> {
  clear(): void;
  has(id: string): boolean;
  remove(id: string): boolean;
  add(entity: Manageable): boolean;
  get(id: string): Manageable | undefined;
}
