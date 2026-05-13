import type { IBoundingBox } from '@shared/interfaces/coordinate.interface';

export const intersects2dBoundingBox = (a: IBoundingBox, b: IBoundingBox): boolean => {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
};
