import { describe, expect, it } from 'vitest';
import { Component } from '@game-engine/core/component';
import { Entity, IEntityConstructor } from '@game-engine/core/entity';

class MockedComponent extends Component {
  public static readonly type = 'MOCKED_COMPONENT';

  public update(): void {
    return;
  }
}

const makeSut = (params?: Partial<IEntityConstructor>) => {
  return new Entity({
    id: '1',
    ...params,
  });
};

describe('Core - Entity', () => {
  it('should return true after inserting a new component', () => {
    const sut = makeSut();
    const component = new MockedComponent();

    expect(sut.addComponent(component)).toBeTruthy();
  });

  it('should return false after attempting to insert an already existing component', () => {
    const sut = makeSut();
    const component = new MockedComponent();

    sut.addComponent(component);

    expect(sut.addComponent(component)).toBeFalsy();
  });

  it('should return true after removing an existent component', () => {
    const sut = makeSut();
    const component = new MockedComponent();

    sut.addComponent(component);

    expect(sut.removeComponent(MockedComponent)).toBeTruthy();
  });

  it('should return false after attempting to remove an non-existent component', () => {
    const sut = makeSut();

    expect(sut.removeComponent(MockedComponent)).toBeFalsy();
  });
});
