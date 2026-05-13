import { describe, expect, it } from 'vitest';
import { UIComponent } from '@game-engine/components/ui.component';
import { SpriteComponent } from '@game-engine/components/sprite.component';
import { CameraComponent } from '@game-engine/components/camera.component';
import { ControlComponent } from '@game-engine/components/control.component';
import { PositionComponent } from '@game-engine/components/position.component';
import { COMPONENT_TYPE } from '@shared/constants/component.constant';

describe('Components - Serialization', () => {
  it('should serialize position as a stable payload snapshot', () => {
    const position = { x: 10, y: 20 };
    const component = new PositionComponent({
      position,
      size: { width: 30, height: 40 },
    });

    const serialized = component.serialize();

    position.x = 999;
    component.updatePosition({ x: 50, y: 60 });

    expect(serialized).toEqual({
      type: COMPONENT_TYPE.POSITION_COMPONENT,
      position: { x: 10, y: 20 },
      boundingBox: { x: 10, y: 20, width: 30, height: 40 },
      centerPosition: { x: 25, y: 40 },
    });
    expect(serialized.position).not.toBe(position);
  });

  it('should serialize sprites as a stable payload snapshot', () => {
    const sprite = {
      x: 1,
      y: 2,
      width: 3,
      height: 4,
      spriteSheetId: 'sprites',
    };
    const component = new SpriteComponent({ spriteFrames: sprite });

    const serialized = component.serialize();

    sprite.x = 999;

    expect(serialized).toEqual({
      type: COMPONENT_TYPE.SPRITE_COMPONENT,
      sprite: {
        x: 1,
        y: 2,
        width: 3,
        height: 4,
        spriteSheetId: 'sprites',
      },
    });
    expect(serialized.sprite).not.toBe(sprite);
  });

  it('should serialize UI as primitive payload data', () => {
    const component = new UIComponent({
      color: 'white',
      fontSize: 16,
      fontFamily: 'menu',
      innerText: 'Start',
      textAlign: 'center',
      textBaseline: 'middle',
      textRendering: 'geometricPrecision',
    });

    expect(component.serialize()).toEqual({
      type: COMPONENT_TYPE.UI_COMPONENT,
      color: 'white',
      fontSize: 16,
      fontFamily: 'menu',
      innerText: 'Start',
      textAlign: 'center',
      textBaseline: 'middle',
      textRendering: 'geometricPrecision',
    });
  });

  it('should serialize control as a marker payload', () => {
    const component = new ControlComponent();

    expect(component.serialize()).toEqual({
      type: COMPONENT_TYPE.CONTROL_COMPONENT,
    });
  });

  it('should serialize camera viewport as a stable payload snapshot', () => {
    const viewport = {
      x: 0,
      y: 0,
      width: 100,
      height: 200,
    };
    const component = new CameraComponent({ viewport });

    const serialized = component.serialize();

    viewport.x = 999;
    component.move({ x: 300, y: 400 });

    expect(serialized).toEqual({
      type: COMPONENT_TYPE.CAMERA_COMPONENT,
      viewport: {
        x: 0,
        y: 0,
        width: 100,
        height: 200,
      },
    });
    expect(serialized.viewport).not.toBe(viewport);
  });
});
