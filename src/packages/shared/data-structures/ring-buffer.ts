import type { IRingBuffer } from '@shared/interfaces/ring-buffer.interface';

export interface IRingBufferConstructor {
  maxLength: number;
}

export class RingBuffer<Element> implements IRingBuffer<Element> {
  protected _maxLength: number;
  protected head: number = 0;
  protected tail: number = 0;
  protected elements: Element[];
  protected _isFull: boolean = false;

  constructor(params: IRingBufferConstructor) {
    this._maxLength = params.maxLength;
    this.elements = new Array<Element>(params.maxLength);
  }

  public get isFull(): boolean {
    return this._isFull;
  }

  public get maxLength(): number {
    return this._maxLength;
  }

  public get isEmpty(): boolean {
    return !this._isFull && this.head === this.tail;
  }

  public get length(): number {
    if (this.isFull) return this._maxLength;

    return (this.tail - this.head + this._maxLength) % this._maxLength;
  }

  public push(element: Element): void {
    this.elements[this.tail] = element;

    if (this._isFull) {
      this.head = (this.head + 1) % this._maxLength;
    }

    this.tail = (this.tail + 1) % this._maxLength;
    this._isFull = this.tail === this.head;
  }

  public pop(): Element | undefined {
    if (this.isEmpty) return;

    const element = this.elements[this.head];
    this.elements[this.head] = undefined!;

    this.head = (this.head + 1) % this._maxLength;
    this._isFull = false;

    return element;
  }

  public peek(): Element | undefined {
    return this.isEmpty ? undefined : this.elements[this.head];
  }

  public drain(): Element[] {
    const drainedElements: Element[] = [];

    while (!this.isEmpty) {
      drainedElements.push(this.pop()!);
    }

    return drainedElements;
  }

  public clear(): void {
    this.head = 0;
    this.tail = 0;
    this._isFull = false;
    this.elements.fill(undefined!);
  }
}
