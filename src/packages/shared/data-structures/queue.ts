import { RingBuffer } from './ring-buffer';
import type { IQueue } from '@shared/interfaces/queue.interface';
import type { IRingBuffer } from '@shared/interfaces/ring-buffer.interface';

export interface IQueueConstructor {
  maxLength: number;
  isCircular?: boolean;
}

export class Queue<Element> implements IQueue<Element> {
  private readonly isCircular: boolean;
  private readonly elementsBuffer: IRingBuffer<Element>;

  constructor(params: IQueueConstructor) {
    this.isCircular = params.isCircular ?? false;

    this.elementsBuffer = new RingBuffer<Element>({
      maxLength: params.maxLength,
    });
  }

  public get isFull(): boolean {
    return this.elementsBuffer.isFull;
  }

  public get isEmpty(): boolean {
    return this.elementsBuffer.isEmpty;
  }

  public get length(): number {
    return this.elementsBuffer.length;
  }

  public get maxLength(): number {
    return this.elementsBuffer.maxLength;
  }

  public enqueue(element: Element) {
    if (!this.isCircular && this.elementsBuffer.isFull) return;

    this.elementsBuffer.push(element);
  }

  public dequeue() {
    if (this.elementsBuffer.isEmpty) return;

    return this.elementsBuffer.pop();
  }

  public peek(): Element | undefined {
    return this.elementsBuffer.peek();
  }

  public clear() {
    this.elementsBuffer.clear();
  }

  public drain() {
    return this.elementsBuffer.drain();
  }
}
