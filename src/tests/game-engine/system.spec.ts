import { describe, expect, it } from 'vitest';
import { System } from '@game-engine/core/system';

class TestSystem extends System {
  public static readonly id = 'test-system';
}

const makeSut = () => new TestSystem();

describe('Core - System', () => {
  it('should expose its static id', () => {
    const sut = makeSut();

    expect(sut.id).toBe(TestSystem.id);
  });

  it('should be enabled by default', () => {
    const sut = makeSut();

    expect(sut.enabled).toBeTruthy();
  });

  it('should toggle enabled state', () => {
    const sut = makeSut();

    sut.disable();

    expect(sut.enabled).toBeFalsy();

    sut.enable();

    expect(sut.enabled).toBeTruthy();
  });

  it('should serialize its id', () => {
    const sut = makeSut();

    expect(sut.serialize()).toEqual({
      id: TestSystem.id,
    });
  });
});
