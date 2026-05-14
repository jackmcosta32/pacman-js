import { Component } from '@game-engine/core/component';
import { COMPONENT_TYPE } from '@shared/constants/component.constant';
import type { ITypographyOptions } from '@shared/interfaces/graphics.interface';
import type { ISerializedComponent } from '@game-engine/interfaces/component.interface';

export interface IUIComponentConstructor extends Partial<ITypographyOptions> {
  innerText?: string;
}

export interface ISerializedUIComponent extends ISerializedComponent {
  color?: string;
  fontSize?: number;
  innerText?: string;
  fontFamily?: string;
  textAlign?: CanvasTextAlign;
  textBaseline?: CanvasTextBaseline;
  textRendering?: CanvasTextRendering;
}

export class UIComponent extends Component {
  public static readonly type = COMPONENT_TYPE.UI_COMPONENT;

  private readonly color?: string;
  public innerText?: string;
  private readonly fontSize?: number;
  private readonly fontFamily?: string;
  private readonly textAlign?: CanvasTextAlign;
  private readonly textBaseline?: CanvasTextBaseline;
  private readonly textRendering?: CanvasTextRendering;

  constructor(params?: IUIComponentConstructor) {
    super();

    this.color = params?.color;
    this.fontSize = params?.fontSize;
    this.innerText = params?.innerText;
    this.textAlign = params?.textAlign;
    this.fontFamily = params?.fontFamily;
    this.textBaseline = params?.textBaseline;
    this.textRendering = params?.textRendering;
  }

  public updateInnerText(innerText: string): void {
    this.innerText = innerText;
  }

  public serialize(): ISerializedUIComponent {
    return {
      type: this.type,
      color: this.color,
      fontSize: this.fontSize,
      textAlign: this.textAlign,
      innerText: this.innerText,
      fontFamily: this.fontFamily,
      textBaseline: this.textBaseline,
      textRendering: this.textRendering,
    };
  }
}
