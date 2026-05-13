import { describe, expect, it } from 'vitest';
import { System } from '@game-engine/core/system';
import { SystemManager } from '@game-engine/managers/system.manager';
import type { ISystem } from '@game-engine/interfaces/system.interface';

class FirstSystem extends System {
  public static readonly id = 'first-system';
}

class SecondSystem extends System {
  public static readonly id = 'second-system';
}

const makeSut = () => new SystemManager();

describe('Managers - SystemManager', () => {
  it('should add a system', () => {
    const sut = makeSut();
    const system = new FirstSystem();

    expect(sut.addSystem(system)).toBeTruthy();
    expect(sut.getSystem(FirstSystem)).toBe(system);
  });

  it('should reject duplicate systems', () => {
    const sut = makeSut();
    const system = new FirstSystem();

    sut.addSystem(system);

    expect(sut.addSystem(system)).toBeFalsy();
  });

  it('should get a system by constructor id', () => {
    const sut = makeSut();
    const system = new FirstSystem();

    sut.addSystem(system);

    expect(sut.getSystem(FirstSystem)).toBe(system);
    expect(sut.getSystem(SecondSystem)).toBeUndefined();
  });

  it('should remove an existing system', () => {
    const sut = makeSut();
    const system = new FirstSystem();

    sut.addSystem(system);

    expect(sut.removeSystem(FirstSystem)).toBeTruthy();
    expect(sut.getSystem(FirstSystem)).toBeUndefined();
  });

  it('should return false when removing a missing system', () => {
    const sut = makeSut();

    expect(sut.removeSystem(FirstSystem)).toBeFalsy();
  });

  it('should iterate over managed systems with the public callback shape', () => {
    const sut = makeSut();
    const firstSystem = new FirstSystem();
    const secondSystem = new SecondSystem();
    const callbackArguments: unknown[][] = [];

    sut.addSystem(firstSystem);
    sut.addSystem(secondSystem);
    sut.forEachSystem(((...args: unknown[]) => callbackArguments.push(args)) as (system: ISystem) => void);

    expect(callbackArguments).toEqual([[firstSystem], [secondSystem]]);
  });

  it('should clear managed systems', () => {
    const sut = makeSut();

    sut.addSystem(new FirstSystem());
    sut.clear();

    expect(sut.getSystem(FirstSystem)).toBeUndefined();
  });

  it('should serialize managed systems', () => {
    const sut = makeSut();
    const firstSystem = new FirstSystem();
    const secondSystem = new SecondSystem();

    sut.addSystem(firstSystem);
    sut.addSystem(secondSystem);

    expect(sut.serialize()).toEqual([firstSystem.serialize(), secondSystem.serialize()]);
  });
});
