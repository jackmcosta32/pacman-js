import { Component } from '@game-engine/core/component';
import { PACMAN_COMPONENT_TYPE } from '@pacman/constants/pacman-component.constant';
import type { ISerializedComponent } from '@game-engine/interfaces/component.interface';
import type { IPacmanRole } from '@pacman/interfaces/pacman-game-state.interface';

export interface IPacmanRoleComponentConstructor {
  role: IPacmanRole;
}

export interface ISerializedPacmanRoleComponent extends ISerializedComponent {
  role: IPacmanRole;
}

export class PacmanRoleComponent extends Component {
  public static readonly type = PACMAN_COMPONENT_TYPE.ROLE_COMPONENT;

  public readonly role: IPacmanRole;

  constructor(params: IPacmanRoleComponentConstructor) {
    super();

    this.role = params.role;
  }

  public serialize(): ISerializedPacmanRoleComponent {
    return {
      type: this.type,
      role: this.role,
    };
  }
}
