import { Component } from '@game-engine/core/component';
import { PACMAN_COMPONENT_TYPE } from '@pacman/constants/pacman-component.constant';
import type { ISerializedComponent } from '@game-engine/interfaces/component.interface';
import type { IPacmanCollectibleType } from '@pacman/interfaces/pacman-level.interface';

export interface IPacmanCollectibleComponentConstructor {
  collectibleType: IPacmanCollectibleType;
  scoreValue: number;
}

export interface ISerializedPacmanCollectibleComponent extends ISerializedComponent {
  collectibleType: IPacmanCollectibleType;
  scoreValue: number;
}

export class PacmanCollectibleComponent extends Component {
  public static readonly type = PACMAN_COMPONENT_TYPE.COLLECTIBLE_COMPONENT;

  public readonly scoreValue: number;
  public readonly collectibleType: IPacmanCollectibleType;

  constructor(params: IPacmanCollectibleComponentConstructor) {
    super();

    this.scoreValue = params.scoreValue;
    this.collectibleType = params.collectibleType;
  }

  public serialize(): ISerializedPacmanCollectibleComponent {
    return {
      type: this.type,
      scoreValue: this.scoreValue,
      collectibleType: this.collectibleType,
    };
  }
}
