export interface IRingBuffer<Element> {
  clear(): void;
  length: number;
  isEmpty: boolean;
  pop(): Element | undefined;
  peek(): Element | undefined;
  push(element: Element): void;
}
