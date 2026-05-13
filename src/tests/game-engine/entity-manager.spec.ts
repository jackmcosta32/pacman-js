import { describe, expect, it } from 'vitest';
import { EntityManager } from '@game-engine/managers/entity.manager';
import { EntityMocker } from '@tests/mocks/entity.mocker';
import { PositionComponentMocker } from '@tests/mocks/position-component.mocker';

const entityMocker = new EntityMocker();
const positionComponentMocker = new PositionComponentMocker();

const makeSut = () => new EntityManager();

describe('Managers - EntityManager', () => {
  it('should add an entity', () => {
    const sut = makeSut();
    const entity = entityMocker.mock({ id: 'entity-1' });

    expect(sut.addEntity(entity)).toBeTruthy();
    expect(sut.getEntity(entity.id)).toBe(entity);
  });

  it('should reject duplicate entities', () => {
    const sut = makeSut();
    const entity = entityMocker.mock({ id: 'entity-1' });

    sut.addEntity(entity);

    expect(sut.addEntity(entity)).toBeFalsy();
  });

  it('should get an entity by id', () => {
    const sut = makeSut();
    const entity = entityMocker.mock({ id: 'entity-1' });

    sut.addEntity(entity);

    expect(sut.getEntity(entity.id)).toBe(entity);
  });

  it('should report whether an entity exists', () => {
    const sut = makeSut();
    const entity = entityMocker.mock({ id: 'entity-1' });

    sut.addEntity(entity);

    expect(sut.hasEntity(entity.id)).toBeTruthy();
    expect(sut.hasEntity('missing-entity')).toBeFalsy();
  });

  it('should remove an existing entity', () => {
    const sut = makeSut();
    const entity = entityMocker.mock({ id: 'entity-1' });

    sut.addEntity(entity);

    expect(sut.removeEntity(entity.id)).toBeTruthy();
    expect(sut.hasEntity(entity.id)).toBeFalsy();
  });

  it('should return false when removing a missing entity', () => {
    const sut = makeSut();

    expect(sut.removeEntity('missing-entity')).toBeFalsy();
  });

  it('should iterate over managed entities', () => {
    const sut = makeSut();
    const entities = [
      entityMocker.mock({ id: 'entity-1' }),
      entityMocker.mock({ id: 'entity-2' }),
    ];
    const iteratedEntityIds: string[] = [];

    entities.forEach((entity) => sut.addEntity(entity));
    sut.forEachEntity((entity) => iteratedEntityIds.push(entity.id));

    expect(iteratedEntityIds).toEqual(['entity-1', 'entity-2']);
  });

  it('should return all managed entities', () => {
    const sut = makeSut();
    const entities = [
      entityMocker.mock({ id: 'entity-1' }),
      entityMocker.mock({ id: 'entity-2' }),
    ];

    entities.forEach((entity) => sut.addEntity(entity));

    expect(sut.getEntities()).toEqual(entities);
  });

  it('should clear managed entities', () => {
    const sut = makeSut();

    sut.addEntity(entityMocker.mock());
    sut.clear();

    expect(sut.getEntities()).toEqual([]);
  });

  it('should serialize managed entities', () => {
    const sut = makeSut();
    const entity = entityMocker.mock({ id: 'entity-1' });
    const positionComponent = positionComponentMocker.mock({
      position: { x: 10, y: 20 },
      size: { width: 30, height: 40 },
    });

    entity.addComponent(positionComponent);
    sut.addEntity(entity);

    expect(sut.serialize()).toEqual([entity.serialize()]);
  });
});
