export interface IComponent {
  name: string;
  init(): void;
  update(timestamp: number, entity: IEntity): void;
}

export interface IEntity {
  id: string;
  init(): void;
  update(timestamp: number): void;
  addComponent(component: IComponent): void;
  removeComponent(component: IComponent): void;
  getComponent(name: string): IComponent | undefined;
}
