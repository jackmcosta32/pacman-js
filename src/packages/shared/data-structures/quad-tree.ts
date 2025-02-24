import type { ISize } from '@shared/interfaces/geometry.interface';
import type { IBoundingBox } from '@shared/interfaces/coordinate.interface';

export interface IQuadTreeConstructor {
  minSize?: ISize;
  parent?: QuadTree;
  isDivisive?: boolean;
  branchCapacity: number;
  boundingBox: IBoundingBox;
  references?: Map<string, [IBoundingBox, QuadTree]>;
}

export class QuadTree {
  private divided = false;
  private isDivisive: boolean;
  private northeast?: QuadTree;
  private northwest?: QuadTree;
  private southeast?: QuadTree;
  private southwest?: QuadTree;
  public boundingBox: IBoundingBox;
  private readonly minSize?: ISize;
  private readonly parent?: QuadTree;
  private readonly branchCapacity: number;
  private readonly references: Map<string, [IBoundingBox, QuadTree]>;
  private readonly nodeIds = new Set<string>();

  constructor(params: IQuadTreeConstructor) {
    this.parent = params.parent;
    this.minSize = params.minSize;
    this.boundingBox = params.boundingBox;
    this.branchCapacity = params.branchCapacity;
    this.isDivisive = params.isDivisive ?? true;
    this.references = params.references ?? new Map<string, [IBoundingBox, QuadTree]>();
  }

  private intersects(boundingBoxA: IBoundingBox, boundingBoxB: IBoundingBox = this.boundingBox) {
    return (
      boundingBoxA.x < boundingBoxB.x + boundingBoxB.width &&
      boundingBoxB.x < boundingBoxA.x + boundingBoxA.width &&
      boundingBoxA.y < boundingBoxB.y + boundingBoxB.height &&
      boundingBoxB.y < boundingBoxA.y + boundingBoxA.height
    );
  }

  private contains(boundingBox: IBoundingBox) {
    return (
      boundingBox.x >= this.boundingBox.x &&
      boundingBox.x + boundingBox.width <= this.boundingBox.x + this.boundingBox.width &&
      boundingBox.y >= this.boundingBox.y &&
      boundingBox.y + boundingBox.height <= this.boundingBox.y + this.boundingBox.height
    );
  }

  private subdivide() {
    const { x, y } = this.boundingBox;
    const width = this.boundingBox.width / 2;
    const height = this.boundingBox.height / 2;

    const isDivisive = this.minSize && height > this.minSize.height && width > this.minSize.width;

    this.northeast = new QuadTree({
      isDivisive,
      parent: this,
      minSize: this.minSize,
      references: this.references,
      branchCapacity: this.branchCapacity,
      boundingBox: { x, y, width, height },
    });

    this.northwest = new QuadTree({
      isDivisive,
      parent: this,
      minSize: this.minSize,
      references: this.references,
      branchCapacity: this.branchCapacity,
      boundingBox: { x: x + width, y, width, height },
    });

    this.southeast = new QuadTree({
      isDivisive,
      parent: this,
      minSize: this.minSize,
      references: this.references,
      branchCapacity: this.branchCapacity,
      boundingBox: { x, y: y + height, width, height },
    });

    this.southwest = new QuadTree({
      isDivisive,
      parent: this,
      minSize: this.minSize,
      references: this.references,
      branchCapacity: this.branchCapacity,
      boundingBox: { x: x + width, y: y + height, width, height },
    });

    this.divided = true;

    for (const id of this.nodeIds) {
      const [boundingBox] = this.references.get(id)!;
      this.insertNode(id, boundingBox);
    }

    this.nodeIds.clear();
  }

  public insertNode(id: string, boundingBox: IBoundingBox): boolean {
    if (this.references.has(id)) return false;
    if (!this.contains(boundingBox)) return false;

    if (!this.isDivisive || (this.nodeIds.size < this.branchCapacity && !this.divided)) {
      this.nodeIds.add(id);
      this.references.set(id, [boundingBox, this]);

      return true;
    }

    if (!this.divided) {
      this.subdivide();
    }

    return (
      this.northeast!.insertNode(id, boundingBox) ||
      this.northwest!.insertNode(id, boundingBox) ||
      this.southeast!.insertNode(id, boundingBox) ||
      this.southwest!.insertNode(id, boundingBox)
    );
  }

  public deleteNode(id: string): boolean {
    const element = this.references.get(id);

    if (!element) return false;

    const [_, branch] = element;

    branch.nodeIds.delete(id);
    this.references.delete(id);

    return true;
  }

  public updateNode(id: string, boundingBox: IBoundingBox): boolean {
    const element = this.references.get(id);

    if (!element) return false;

    const [_, branch] = element;

    branch.nodeIds.delete(id);

    const inserted = this.insertNode(id, boundingBox);

    if (inserted) return true;

    if (!this.parent) return false;

    return this.parent.updateNode(id, boundingBox);
  }

  public query(range: IBoundingBox, found: string[] = []): string[] {
    if (!this.divided && !this.nodeIds.size) return found;

    if (!this.intersects(this.boundingBox, range)) return found;

    for (const id of this.nodeIds) {
      const [boundingBox] = this.references.get(id)!;

      if (this.intersects(boundingBox, range)) {
        found.push(id);
      }
    }

    if (this.divided) {
      this.northeast!.query(range, found);
      this.northwest!.query(range, found);
      this.southeast!.query(range, found);
      this.southwest!.query(range, found);
    }

    return found;
  }

  public clear() {
    this.nodeIds.clear();
    this.references.clear();
    this.divided = false;
    this.isDivisive = true;
    this.northeast = undefined;
    this.northwest = undefined;
    this.southeast = undefined;
    this.southwest = undefined;
  }
}
