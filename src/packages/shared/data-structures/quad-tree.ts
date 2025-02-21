import type { ISize } from '@shared/interfaces/geometry.interface';
import type { IBoundingBox } from '@shared/interfaces/coordinate.interface';

export interface IQuadTreeConstructor {
  minSize?: ISize;
  capacity: number;
  isDivisive?: boolean;
  boundingBox: IBoundingBox;
}

export class QuadTree {
  private isDivisive: boolean;
  private northeast?: QuadTree;
  private northwest?: QuadTree;
  private southeast?: QuadTree;
  private southwest?: QuadTree;
  public boundingBox: IBoundingBox;
  private readonly minSize?: ISize;
  private readonly capacity: number;
  private divided = false;
  private readonly elements = new Map<string, IBoundingBox>();

  constructor(params: IQuadTreeConstructor) {
    this.minSize = params.minSize;
    this.capacity = params.capacity;
    this.boundingBox = params.boundingBox;
    this.isDivisive = params.isDivisive ?? true;
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
      minSize: this.minSize,
      capacity: this.capacity,
      boundingBox: { x, y, width, height },
    });

    this.northwest = new QuadTree({
      isDivisive,
      minSize: this.minSize,
      capacity: this.capacity,
      boundingBox: { x: x + width, y, width, height },
    });

    this.southeast = new QuadTree({
      isDivisive,
      minSize: this.minSize,
      capacity: this.capacity,
      boundingBox: { x, y: y + height, width, height },
    });

    this.southwest = new QuadTree({
      isDivisive,
      minSize: this.minSize,
      capacity: this.capacity,
      boundingBox: { x: x + width, y: y + height, width, height },
    });

    this.divided = true;

    for (const [id, boundingBox] of this.elements) {
      this.insert(id, boundingBox);
    }

    this.elements.clear();
  }

  public insert(id: string, boundingBox: IBoundingBox): boolean {
    if (this.elements.has(id)) return true;
    if (!this.contains(boundingBox)) return false;

    if (!this.isDivisive || (this.elements.size < this.capacity && !this.divided)) {
      this.elements.set(id, boundingBox);
      return true;
    }

    if (!this.divided) {
      this.subdivide();
    }

    return (
      this.northeast!.insert(id, boundingBox) ||
      this.northwest!.insert(id, boundingBox) ||
      this.southeast!.insert(id, boundingBox) ||
      this.southwest!.insert(id, boundingBox)
    );
  }

  public query(range: IBoundingBox, found: string[] = []): string[] {
    if (!this.divided && !this.elements.size) return found;

    if (!this.intersects(this.boundingBox, range)) return found;

    for (const [id, boundingBox] of this.elements) {
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
    this.elements.clear();
    this.divided = false;
    this.isDivisive = true;
    this.northeast = undefined;
    this.northwest = undefined;
    this.southeast = undefined;
    this.southwest = undefined;
  }
}
