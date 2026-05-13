import { describe, expect, it, vi } from 'vitest';
import { Scene, type ISceneConstructor } from '@game-engine/core/scene';
import { Queue } from '@shared/data-structures/queue';
import { EntityManager } from '@game-engine/managers/entity.manager';
import { EntityMocker } from '@tests/mocks/entity.mocker';
import { PositionComponentMocker } from '@tests/mocks/position-component.mocker';
import type { IEvent } from '@shared/interfaces/event.interface';
import type { IQueue } from '@shared/interfaces/queue.interface';
import type { IEntityManager } from '@game-engine/interfaces/entity.interface';
import type { ISystem } from '@game-engine/interfaces/system.interface';

const entityMocker = new EntityMocker();
const positionComponentMocker = new PositionComponentMocker();

interface ISut {
  sut: Scene;
  eventQueue: IQueue<IEvent>;
  entityManager: IEntityManager;
}

const makeSystem = (params?: Partial<ISystem>): ISystem => ({
  id: 'test-system',
  enabled: true,
  serialize: () => ({ id: 'test-system' }),
  ...params,
});

const makeSut = (params?: Partial<ISceneConstructor>): ISut => {
  const eventQueue = params?.eventQueue ?? new Queue<IEvent>({ maxLength: 10 });
  const entityManager = params?.entityManager ?? new EntityManager();

  const sut = new Scene({
    eventQueue,
    entityManager,
    id: 'test-scene',
    size: { width: 100, height: 100 },
    viewport: { width: 50, height: 50 },
    ...params,
  });

  return {
    sut,
    eventQueue,
    entityManager,
  };
};

describe('Core - Scene', () => {
  it('should initialize systems with complete scene state', () => {
    const init = vi.fn();
    const system = makeSystem({ init });
    const { sut, eventQueue, entityManager } = makeSut({ systems: [system] });

    sut.init();

    expect(init).toHaveBeenCalledWith({
      elapsed: 0,
      eventMap: {},
      eventQueue,
      entityManager,
    });
  });

  it('should update systems with complete scene state', () => {
    const update = vi.fn();
    const system = makeSystem({ update });
    const { sut, eventQueue, entityManager } = makeSut({ systems: [system] });
    const event = { type: 'test-event' };
    const eventMap = { [event.type]: [event] };

    sut.update({ eventMap, eventQueue });

    expect(update).toHaveBeenCalledWith({
      elapsed: expect.any(Number),
      eventMap,
      eventQueue,
      entityManager,
    });
  });

  it('should destroy systems with complete scene state and clear entities', () => {
    const destroy = vi.fn();
    const system = makeSystem({ destroy });
    const { sut, eventQueue, entityManager } = makeSut({ systems: [system] });

    entityManager.addEntity(entityMocker.mock());

    sut.destroy();

    expect(destroy).toHaveBeenCalledWith({
      elapsed: 0,
      eventMap: {},
      eventQueue,
      entityManager,
    });
    expect(entityManager.getEntities()).toEqual([]);
  });

  it('should serialize scene metadata and managed entities', () => {
    const entity = entityMocker.mock({ id: 'entity-1' });
    const positionComponent = positionComponentMocker.mock({
      position: { x: 10, y: 20 },
      size: { width: 30, height: 40 },
    });
    const entityManager = new EntityManager({ entities: [entity] });
    const { sut } = makeSut({
      entityManager,
      id: 'serialized-scene',
      size: { width: 100, height: 200 },
      viewport: { width: 50, height: 60 },
    });

    entity.addComponent(positionComponent);

    expect(sut.serialize()).toEqual({
      id: 'serialized-scene',
      size: { width: 100, height: 200 },
      viewport: { width: 50, height: 60 },
      entities: [entity.serialize()],
    });
  });
});
