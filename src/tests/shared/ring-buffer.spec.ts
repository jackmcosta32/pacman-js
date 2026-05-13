import { describe, expect, it } from 'vitest';
import { RingBuffer, type IRingBufferConstructor } from '@shared/data-structures/ring-buffer';

const makeSut = <Element>(params?: Partial<IRingBufferConstructor>) => {
  return new RingBuffer<Element>({
    maxLength: 10,
    ...params,
  });
};

describe('Data Structures - RingBuffer', () => {
  it('should be able to push an element', () => {
    const sut = makeSut<number>();

    expect(sut.length).toBe(0);

    sut.push(1);

    expect(sut.peek()).toBe(1);
    expect(sut.length).toBe(1);
  });

  it('should be able to pop an element', () => {
    const sut = makeSut<number>();
    const addedElement = 1;

    sut.push(addedElement);

    const poppedElement = sut.pop();

    expect(poppedElement).toBe(addedElement);
  });

  it('should be able to peek an element', () => {
    const sut = makeSut<number>();

    expect(sut.peek()).toBeUndefined();

    sut.push(1);

    expect(sut.peek()).toBe(1);
  });

  it('should increase or decrease its length accordingly to the amount of elements added', () => {
    const sut = makeSut<number>();

    expect(sut.length).toBe(0);

    sut.push(1);

    expect(sut.length).toBe(1);

    sut.pop();

    expect(sut.length).toBe(0);
  });

  it('should be able to clear the buffer', () => {
    const sut = makeSut<number>();

    expect(sut.length).toBe(0);

    sut.push(1);

    expect(sut.length).toBe(1);

    sut.clear();

    expect(sut.length).toBe(0);
    expect(sut.peek()).toBeUndefined();
    expect(sut.isEmpty).toBeTruthy();
  });

  it('should be able to drain the buffer in insertion order', () => {
    const sut = makeSut<number>();

    sut.push(1);
    sut.push(2);
    sut.push(3);

    expect(sut.drain()).toEqual([1, 2, 3]);
    expect(sut.isEmpty).toBeTruthy();
  });

  it('should expose its maximum length', () => {
    const sut = makeSut<number>({ maxLength: 3 });

    expect(sut.maxLength).toBe(3);
  });

  it('should become full when reaching maximum length', () => {
    const sut = makeSut<number>({ maxLength: 2 });

    sut.push(1);
    sut.push(2);

    expect(sut.isFull).toBeTruthy();
    expect(sut.length).toBe(2);
  });

  it('should overwrite the oldest element when pushing past capacity', () => {
    const sut = makeSut<number>({ maxLength: 2 });

    sut.push(1);
    sut.push(2);
    sut.push(3);

    expect(sut.drain()).toEqual([2, 3]);
  });
});
