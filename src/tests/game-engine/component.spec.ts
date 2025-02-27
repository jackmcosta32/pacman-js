import { describe, expect, it } from 'vitest';
import { Component } from '@game-engine/core/component';

class MockedComponent extends Component {
  public static readonly type = 'MOCKED_COMPONENT';

  public update(): void {
    return;
  }
}

const makeSut = () => {
  return new MockedComponent();
};

describe('Core - Component', () => {
  it('should return type', () => {
    const sut = makeSut();

    expect(sut.type).toBe(MockedComponent.type);
  });
});
