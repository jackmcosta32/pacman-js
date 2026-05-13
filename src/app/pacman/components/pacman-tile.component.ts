import { Component } from '@game-engine/core/component';
import { PACMAN_COMPONENT_TYPE } from '@pacman/constants/pacman-component.constant';
import type { ISerializedComponent } from '@game-engine/interfaces/component.interface';
import type { IPacmanTileType, IPacmanTileSymbol } from '@pacman/interfaces/pacman-level.interface';

export interface IPacmanTileComponentConstructor {
  row: number;
  column: number;
  symbol: IPacmanTileSymbol;
  tileType: IPacmanTileType;
  walkable: boolean;
  blocking: boolean;
}

export interface ISerializedPacmanTileComponent extends ISerializedComponent {
  row: number;
  column: number;
  symbol: IPacmanTileSymbol;
  tileType: IPacmanTileType;
  walkable: boolean;
  blocking: boolean;
}

export class PacmanTileComponent extends Component {
  public static readonly type = PACMAN_COMPONENT_TYPE.TILE_COMPONENT;

  public readonly row: number;
  public readonly column: number;
  public readonly symbol: IPacmanTileSymbol;
  public readonly tileType: IPacmanTileType;
  public readonly walkable: boolean;
  public readonly blocking: boolean;

  constructor(params: IPacmanTileComponentConstructor) {
    super();

    this.row = params.row;
    this.column = params.column;
    this.symbol = params.symbol;
    this.tileType = params.tileType;
    this.walkable = params.walkable;
    this.blocking = params.blocking;
  }

  public serialize(): ISerializedPacmanTileComponent {
    return {
      type: this.type,
      row: this.row,
      column: this.column,
      symbol: this.symbol,
      tileType: this.tileType,
      walkable: this.walkable,
      blocking: this.blocking,
    };
  }
}
