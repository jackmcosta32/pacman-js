import { afterEach, describe, expect, it, vi } from 'vitest';
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
  afterEach(() => {
    vi.restoreAllMocks();
  });

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

  it('should update enabled systems in the provided order', () => {
    const updateOrder: string[] = [];
    const firstSystem = makeSystem({
      id: 'first-system',
      update: () => updateOrder.push('first-system'),
    });
    const secondSystem = makeSystem({
      id: 'second-system',
      update: () => updateOrder.push('second-system'),
    });
    const { sut, eventQueue } = makeSut({ systems: [firstSystem, secondSystem] });

    sut.update({ eventMap: {}, eventQueue });

    expect(updateOrder).toEqual(['first-system', 'second-system']);
  });

  it('should not update disabled systems', () => {
    const enabledUpdate = vi.fn();
    const disabledUpdate = vi.fn();
    const enabledSystem = makeSystem({
      id: 'enabled-system',
      update: enabledUpdate,
    });
    const disabledSystem = makeSystem({
      id: 'disabled-system',
      enabled: false,
      update: disabledUpdate,
    });
    const { sut, eventQueue } = makeSut({ systems: [enabledSystem, disabledSystem] });

    sut.update({ eventMap: {}, eventQueue });

    expect(enabledUpdate).toHaveBeenCalledOnce();
    expect(disabledUpdate).not.toHaveBeenCalled();
  });

  it('should still initialize and destroy disabled systems', () => {
    const init = vi.fn();
    const destroy = vi.fn();
    const disabledSystem = makeSystem({
      enabled: false,
      init,
      destroy,
    });
    const { sut } = makeSut({ systems: [disabledSystem] });

    sut.init();
    sut.destroy();

    expect(init).toHaveBeenCalledOnce();
    expect(destroy).toHaveBeenCalledOnce();
  });

  it('should deliver the same event map to systems', () => {
    const update = vi.fn();
    const system = makeSystem({ update });
    const { sut, eventQueue } = makeSut({ systems: [system] });
    const eventMap = {
      TestEvent: [{ type: 'TestEvent', value: 1 }],
    };

    sut.update({ eventMap, eventQueue });

    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        eventMap,
      }),
    );
  });

  it('should use zero elapsed time on the first update', () => {
    vi.spyOn(performance, 'now').mockReturnValue(100);

    const update = vi.fn();
    const system = makeSystem({ update });
    const { sut, eventQueue } = makeSut({ systems: [system] });

    sut.update({ eventMap: {}, eventQueue });

    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        elapsed: 0,
      }),
    );
  });

  it('should use the elapsed time between updates after the first update', () => {
    vi.spyOn(performance, 'now').mockReturnValueOnce(100).mockReturnValueOnce(125);

    const update = vi.fn();
    const system = makeSystem({ update });
    const { sut, eventQueue } = makeSut({ systems: [system] });

    sut.update({ eventMap: {}, eventQueue });
    sut.update({ eventMap: {}, eventQueue });

    expect(update).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        elapsed: 25,
      }),
    );
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

  it('should serialize cloned scene metadata', () => {
    const size = { width: 100, height: 200 };
    const viewport = { width: 50, height: 60 };
    const { sut } = makeSut({ size, viewport });

    const serialized = sut.serialize();

    size.width = 999;
    viewport.height = 888;

    expect(serialized.size).toEqual({ width: 100, height: 200 });
    expect(serialized.viewport).toEqual({ width: 50, height: 60 });
    expect(serialized.size).not.toBe(size);
    expect(serialized.viewport).not.toBe(viewport);
  });
});
