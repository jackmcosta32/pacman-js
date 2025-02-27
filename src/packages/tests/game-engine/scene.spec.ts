import { describe, expect, it } from 'vitest';
import { EntityMocker } from '@tests/mocks/entity.mocker';
import { Scene, ISceneConstructor } from '@game-engine/core/scene';
import { Entity, IEntityConstructor } from '@game-engine/core/entity';
import { PositionComponentMocker } from '@tests/mocks/position-component.mocker';

const entityMocker = new EntityMocker();
const positionComponentMocker = new PositionComponentMocker();

const positionComponent = positionComponentMocker.mock();

const makeSut = (params?: Partial<ISceneConstructor>) => {
  return new Scene({
    entities: [],
    size: { width: 100, height: 100 },
    ...params,
  });
};

describe('Core - Scene', () => {
  it('should return true after adding a new entity to the scene', () => {
    const sut = makeSut();
    const entity = entityMocker.mock();

    expect(sut.addEntity(entity)).toBeTruthy();
  });

  it('should return false after attempting to add an already existing entity to the scene', () => {
    const sut = makeSut();
    const entity = entityMocker.mock();

    sut.addEntity(entity);

    expect(sut.addEntity(entity)).toBeFalsy();
  });
});
