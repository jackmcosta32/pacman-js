export interface IRingBuffer<Element> {
  clear(): void;
  length: number;
  isFull: boolean;
  isEmpty: boolean;
  maxLength: number;
  drain(): Element[];
  pop(): Element | undefined;
  peek(): Element | undefined;
  push(element: Element): void;
}
