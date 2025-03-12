import { Component } from '@game-engine/core/component';
import { COMPONENT_TYPE } from '@shared/constants/component.constant';
import type { ISerializedComponent } from '@game-engine/interfaces/entity.interface';

export interface ISerializedControlComponent extends ISerializedComponent {}

export class ControlComponent extends Component {
  public static readonly type = COMPONENT_TYPE.CONTROL_COMPONENT;

  public serialize(): ISerializedControlComponent {
    return {
      type: this.type,
    };
  }
}
