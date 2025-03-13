export interface IQueue<Element> {
  clear(): void;
  length: number;
  isFull: boolean;
  isEmpty: boolean;
  maxLength: number;
  drain(): Element[];
  peek(): Element | undefined;
  dequeue(): Element | undefined;
  enqueue(element: Element): void;
}
