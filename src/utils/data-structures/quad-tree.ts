import type { TSize } from '@/models/shape.model';
import type { GameObject } from '@/entities/game-object.entity';
import type { TBoundingBox } from '@/models/bounding-box.model';

const MIN_SIZE: TSize = {
  width: 250,
  height: 250,
};

export interface TQuadTreeConstructor {
  capacity?: number;
  isDivisive?: boolean;
  boundingBox: TBoundingBox;
}

export class QuadTree {
  private capacity: number;
  private isDivisive: boolean;
  private northeast?: QuadTree;
  private northwest?: QuadTree;
  private southeast?: QuadTree;
  private southwest?: QuadTree;
  public boundingBox: TBoundingBox;
  private divided: boolean = false;
  private objects: GameObject[] = [];

  constructor({ boundingBox, isDivisive = true, capacity = 4 }: TQuadTreeConstructor) {
    this.capacity = capacity;
    this.isDivisive = isDivisive;
    this.boundingBox = boundingBox;
  }

  private intersects(boundingBoxA: TBoundingBox, boundingBoxB: TBoundingBox = this.boundingBox) {
    return (
      boundingBoxA.x < boundingBoxB.x + boundingBoxB.width &&
      boundingBoxB.x < boundingBoxA.x + boundingBoxA.width &&
      boundingBoxA.y < boundingBoxB.y + boundingBoxB.height &&
      boundingBoxB.y < boundingBoxA.y + boundingBoxA.height
    );
  }

  private contains(object: GameObject) {
    return (
      object.boundingBox.x >= this.boundingBox.x &&
      object.boundingBox.x + object.boundingBox.width <= this.boundingBox.x + this.boundingBox.width &&
      object.boundingBox.y >= this.boundingBox.y &&
      object.boundingBox.y + object.boundingBox.height <= this.boundingBox.y + this.boundingBox.height
    );
  }

  private subdivide() {
    const { x, y } = this.boundingBox;
    const width = this.boundingBox.width / 2;
    const height = this.boundingBox.height / 2;
    const isDivisive = height > MIN_SIZE.height && width > MIN_SIZE.width;

    this.northeast = new QuadTree({
      isDivisive,
      capacity: this.capacity,
      boundingBox: { x, y, width, height },
    });

    this.northwest = new QuadTree({
      isDivisive,
      capacity: this.capacity,
      boundingBox: { x: x + width, y, width, height },
    });

    this.southeast = new QuadTree({
      isDivisive,
      capacity: this.capacity,
      boundingBox: { x, y: y + height, width, height },
    });

    this.southwest = new QuadTree({
      isDivisive,
      capacity: this.capacity,
      boundingBox: { x: x + width, y: y + height, width, height },
    });

    this.divided = true;

    for (const object of this.objects) {
      this.insert(object);
    }

    this.objects = [];
  }

  public insert(object: GameObject): boolean {
    if (!this.contains(object)) return false;

    if (!this.isDivisive || (this.objects.length < this.capacity && !this.divided)) {
      this.objects.push(object);
      return true;
    }

    if (!this.divided) {
      this.subdivide();
    }

    return (
      this.northeast!.insert(object) ||
      this.northwest!.insert(object) ||
      this.southeast!.insert(object) ||
      this.southwest!.insert(object)
    );
  }

  public query(range: TBoundingBox, found: GameObject[] = []): GameObject[] {
    if (!this.divided && !this.objects.length) return found;

    if (!this.intersects(this.boundingBox, range)) return found;

    for (const object of this.objects) {
      if (this.intersects(object.boundingBox, range)) {
        found.push(object);
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
    this.objects = [];
    this.divided = false;
    this.isDivisive = true;
    this.northeast = undefined;
    this.northwest = undefined;
    this.southeast = undefined;
    this.southwest = undefined;
  }
}
