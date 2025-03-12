import type { IRingBuffer } from '@shared/interfaces/data-structures.interface';

const DEFAULT_SIZE = 32;

export interface IRingBufferConstructor {
  size?: number;
}

export class RingBuffer<Element> implements IRingBuffer<Element> {
  protected size: number;
  protected head: number = 0;
  protected tail: number = 0;
  protected isFull: boolean = false;
  protected elements: Array<Element> = [];

  constructor(params?: IRingBufferConstructor) {
    this.size = params?.size ?? DEFAULT_SIZE;
  }

  public get isEmpty(): boolean {
    return !this.isFull && this.head === this.tail;
  }

  public push(element: Element): void {
    this.elements[this.tail] = element;

    if (this.isFull) {
      this.head = (this.head + 1) % this.size;
    }

    this.tail = (this.tail + 1) % this.size;
    this.isFull = this.tail === this.head;
  }

  public pop(): Element | undefined {
    if (this.isEmpty) return;

    const element = this.elements[this.head];

    this.head = (this.head + 1) % this.size;
    this.isFull = false;

    return element;
  }

  public peek(): Element | undefined {
    return this.isEmpty ? undefined : this.elements[this.head];
  }

  public get length(): number {
    if (this.isFull) return this.size;

    return (this.tail - this.head + this.size) % this.size;
  }

  public clear(): void {
    this.head = 0;
    this.tail = 0;
    this.isFull = false;
  }
}
