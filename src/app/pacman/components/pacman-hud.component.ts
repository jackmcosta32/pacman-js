import { Component } from '@game-engine/core/component';
import { PACMAN_COMPONENT_TYPE } from '@pacman/constants/pacman-component.constant';
import type { ISerializedComponent } from '@game-engine/interfaces/component.interface';
import type { IPacmanHudType } from '@pacman/interfaces/pacman-game-state.interface';

export interface IPacmanHudComponentConstructor {
  hudType: IPacmanHudType;
}

export interface ISerializedPacmanHudComponent extends ISerializedComponent {
  hudType: IPacmanHudType;
}

export class PacmanHudComponent extends Component {
  public static readonly type = PACMAN_COMPONENT_TYPE.HUD_COMPONENT;

  public readonly hudType: IPacmanHudType;

  constructor(params: IPacmanHudComponentConstructor) {
    super();

    this.hudType = params.hudType;
  }

  public serialize(): ISerializedPacmanHudComponent {
    return {
      type: this.type,
      hudType: this.hudType,
    };
  }
}
