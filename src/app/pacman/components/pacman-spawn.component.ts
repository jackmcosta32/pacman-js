import { Component } from '@game-engine/core/component';
import { PACMAN_COMPONENT_TYPE } from '@pacman/constants/pacman-component.constant';
import type { ISerializedComponent } from '@game-engine/interfaces/component.interface';
import type { IPacmanSpawnType } from '@pacman/interfaces/pacman-level.interface';

export interface IPacmanSpawnComponentConstructor {
  spawnType: IPacmanSpawnType;
}

export interface ISerializedPacmanSpawnComponent extends ISerializedComponent {
  spawnType: IPacmanSpawnType;
}

export class PacmanSpawnComponent extends Component {
  public static readonly type = PACMAN_COMPONENT_TYPE.SPAWN_COMPONENT;

  public readonly spawnType: IPacmanSpawnType;

  constructor(params: IPacmanSpawnComponentConstructor) {
    super();

    this.spawnType = params.spawnType;
  }

  public serialize(): ISerializedPacmanSpawnComponent {
    return {
      type: this.type,
      spawnType: this.spawnType,
    };
  }
}
