import { describe, expect, it } from 'vitest';
import { BoundingBoxMocker } from '@tests/mocks/bounding-box.mocker';
import { QuadTree, type IQuadTreeConstructor } from '@shared/data-structures/quad-tree';

const boundingBoxMocker = new BoundingBoxMocker();

const treeBoundingBox = boundingBoxMocker.mock({
  x: 0,
  y: 0,
  width: 100,
  height: 100,
});

const makeSut = (params?: Partial<IQuadTreeConstructor>) => {
  return new QuadTree({
    branchCapacity: 4,
    boundingBox: treeBoundingBox,
    ...params,
  });
};

describe('Data Structures - QuadTree', () => {
  it('should return true after inserting a new node into the tree', () => {
    const sut = makeSut();

    const nodeBoundingBox = boundingBoxMocker.mock({
      x: 0,
      y: 0,
      width: 10,
      height: 10,
    });

    expect(sut.insertNode('1', nodeBoundingBox)).toBeTruthy();
  });

  it('should return false after failing to insert a new node into the tree', () => {
    const sut = makeSut();

    const nodeBoundingBox = boundingBoxMocker.mock({
      x: -10,
      y: -10,
      width: 10,
      height: 10,
    });

    expect(sut.insertNode('1', nodeBoundingBox)).toBeFalsy();
  });

  it('should return true after deleting an existing node', () => {
    const sut = makeSut();

    const nodeBoundingBox = boundingBoxMocker.mock({
      x: 0,
      y: 0,
      width: 10,
      height: 10,
    });

    sut.insertNode('1', nodeBoundingBox);

    expect(sut.deleteNode('1')).toBeTruthy();
  });

  it('should return false after attempting to delete an non-existent node', () => {
    const sut = makeSut();

    expect(sut.deleteNode('1')).toBeFalsy();
  });

  it('should be able to query nodes by region', () => {
    const sut = makeSut();

    const nodeBoundingBox = boundingBoxMocker.mock({
      x: 0,
      y: 0,
      width: 10,
      height: 10,
    });

    sut.insertNode('1', nodeBoundingBox);

    const nodes = sut.query({
      x: 0,
      y: 0,
      width: 20,
      height: 20,
    });

    expect(nodes).toContain('1');
  });

  it('should be able to clear the tree', () => {
    const sut = makeSut();

    const nodeBoundingBox = boundingBoxMocker.mock({
      x: 0,
      y: 0,
      width: 10,
      height: 10,
    });

    sut.insertNode('1', nodeBoundingBox);

    sut.clear();

    const nodes = sut.query(treeBoundingBox);

    expect(nodes.length).toBe(0);
  });
});
