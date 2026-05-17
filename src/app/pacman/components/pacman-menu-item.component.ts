import { Component } from '@game-engine/core/component';
import { PACMAN_COMPONENT_TYPE } from '@pacman/constants/pacman-component.constant';
import type { ISerializedComponent } from '@game-engine/interfaces/component.interface';
import type { IPacmanMenuAction, IPacmanMenuItem } from '@pacman/interfaces/pacman-menu.interface';

export interface IPacmanMenuItemComponentConstructor {
  label: string;
  order: number;
  selected?: boolean;
  action: IPacmanMenuAction;
  menuItem: IPacmanMenuItem;
}

export interface ISerializedPacmanMenuItemComponent extends ISerializedComponent {
  label: string;
  order: number;
  selected: boolean;
  action: IPacmanMenuAction;
  menuItem: IPacmanMenuItem;
}

export class PacmanMenuItemComponent extends Component {
  public static readonly type = PACMAN_COMPONENT_TYPE.MENU_ITEM_COMPONENT;

  public readonly label: string;
  public readonly order: number;
  public selected: boolean;
  public readonly action: IPacmanMenuAction;
  public readonly menuItem: IPacmanMenuItem;

  constructor(params: IPacmanMenuItemComponentConstructor) {
    super();

    this.label = params.label;
    this.order = params.order;
    this.action = params.action;
    this.menuItem = params.menuItem;
    this.selected = params.selected ?? false;
  }

  public select(): void {
    this.selected = true;
  }

  public deselect(): void {
    this.selected = false;
  }

  public serialize(): ISerializedPacmanMenuItemComponent {
    return {
      type: this.type,
      label: this.label,
      order: this.order,
      action: this.action,
      selected: this.selected,
      menuItem: this.menuItem,
    };
  }
}
