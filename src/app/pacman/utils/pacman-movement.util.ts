import type { ISize } from '@shared/interfaces/geometry.interface';
import type { IBoundingBox, ICoordinate } from '@shared/interfaces/coordinate.interface';
import { PACMAN_TILE_TYPE } from '@pacman/constants/pacman-level.constant';
import { PACMAN_ACTOR_DIRECTION } from '@pacman/constants/pacman-actor.constant';
import type { IPacmanActorDirection } from '@pacman/interfaces/pacman-actor.interface';
import type { IPacmanParsedLevel, IPacmanTile } from '@pacman/interfaces/pacman-level.interface';

export const PACMAN_DIRECTION_VECTOR: Record<IPacmanActorDirection, ICoordinate> = {
  [PACMAN_ACTOR_DIRECTION.UP]: { x: 0, y: -1 },
  [PACMAN_ACTOR_DIRECTION.DOWN]: { x: 0, y: 1 },
  [PACMAN_ACTOR_DIRECTION.LEFT]: { x: -1, y: 0 },
  [PACMAN_ACTOR_DIRECTION.RIGHT]: { x: 1, y: 0 },
};

export const getDirectionVector = (direction: IPacmanActorDirection): ICoordinate => PACMAN_DIRECTION_VECTOR[direction];

export const getActorCenter = (position: ICoordinate, size: ISize): ICoordinate => ({
  x: position.x + size.width / 2,
  y: position.y + size.height / 2,
});

export const getTileCenter = (tile: IPacmanTile): ICoordinate => ({
  x: tile.position.x + tile.size.width / 2,
  y: tile.position.y + tile.size.height / 2,
});

export const getPositionForActorCenter = (center: ICoordinate, size: ISize): ICoordinate => ({
  x: center.x - size.width / 2,
  y: center.y - size.height / 2,
});

export const getActorTile = (
  level: IPacmanParsedLevel,
  position: ICoordinate,
  size: ISize,
): IPacmanTile | undefined => {
  const center = getActorCenter(position, size);
  const tileCoordinate = level.worldToTileCoordinate(center);

  return level.getTileAt(tileCoordinate.y, tileCoordinate.x);
};

export const getNextTile = (
  level: IPacmanParsedLevel,
  tile: IPacmanTile,
  direction: IPacmanActorDirection,
): IPacmanTile | undefined => {
  const vector = getDirectionVector(direction);

  return level.getTileAt(tile.row + vector.y, tile.column + vector.x);
};

export const getProjectedBoundingBox = (position: ICoordinate, size: ISize): IBoundingBox => ({
  x: position.x,
  y: position.y,
  width: size.width,
  height: size.height,
});

export const getTranslatedPosition = (
  position: ICoordinate,
  direction: IPacmanActorDirection,
  distance: number,
): ICoordinate => {
  const vector = getDirectionVector(direction);

  return {
    x: position.x + vector.x * distance,
    y: position.y + vector.y * distance,
  };
};

export const isHorizontalDirection = (direction: IPacmanActorDirection): boolean => {
  return direction === PACMAN_ACTOR_DIRECTION.LEFT || direction === PACMAN_ACTOR_DIRECTION.RIGHT;
};

export const isSameAxisDirection = (
  firstDirection: IPacmanActorDirection,
  secondDirection: IPacmanActorDirection,
): boolean => {
  return isHorizontalDirection(firstDirection) === isHorizontalDirection(secondDirection);
};

export const isReverseDirection = (
  currentDirection: IPacmanActorDirection,
  requestedDirection: IPacmanActorDirection,
): boolean => {
  const currentVector = getDirectionVector(currentDirection);
  const requestedVector = getDirectionVector(requestedDirection);

  return currentVector.x + requestedVector.x === 0 && currentVector.y + requestedVector.y === 0;
};

export const getReverseDirection = (direction: IPacmanActorDirection): IPacmanActorDirection => {
  switch (direction) {
    case PACMAN_ACTOR_DIRECTION.UP:
      return PACMAN_ACTOR_DIRECTION.DOWN;
    case PACMAN_ACTOR_DIRECTION.DOWN:
      return PACMAN_ACTOR_DIRECTION.UP;
    case PACMAN_ACTOR_DIRECTION.LEFT:
      return PACMAN_ACTOR_DIRECTION.RIGHT;
    case PACMAN_ACTOR_DIRECTION.RIGHT:
      return PACMAN_ACTOR_DIRECTION.LEFT;
  }
};

export const isWithinTolerance = (value: number, target: number, tolerance: number): boolean => {
  return Math.abs(value - target) <= tolerance;
};

export const isActorNearTileCenter = (
  position: ICoordinate,
  size: ISize,
  tile: IPacmanTile,
  tolerance: number,
): boolean => {
  const actorCenter = getActorCenter(position, size);
  const tileCenter = getTileCenter(tile);

  return (
    isWithinTolerance(actorCenter.x, tileCenter.x, tolerance) &&
    isWithinTolerance(actorCenter.y, tileCenter.y, tolerance)
  );
};

export const snapActorToTileCenter = (size: ISize, tile: IPacmanTile): ICoordinate => {
  return getPositionForActorCenter(getTileCenter(tile), size);
};

export const snapActorPerpendicularToTileCenter = (
  position: ICoordinate,
  size: ISize,
  tile: IPacmanTile,
  direction: IPacmanActorDirection,
  tolerance: number,
): ICoordinate => {
  const actorCenter = getActorCenter(position, size);
  const tileCenter = getTileCenter(tile);
  const nextPosition = { ...position };

  if (isHorizontalDirection(direction) && isWithinTolerance(actorCenter.y, tileCenter.y, tolerance)) {
    nextPosition.y = tileCenter.y - size.height / 2;
  }

  if (!isHorizontalDirection(direction) && isWithinTolerance(actorCenter.x, tileCenter.x, tolerance)) {
    nextPosition.x = tileCenter.x - size.width / 2;
  }

  return nextPosition;
};

export const isBoundingBoxOutsideLevel = (level: IPacmanParsedLevel, boundingBox: IBoundingBox): boolean => {
  return (
    boundingBox.x < 0 ||
    boundingBox.y < 0 ||
    boundingBox.x + boundingBox.width > level.size.width ||
    boundingBox.y + boundingBox.height > level.size.height
  );
};

export const canExitTunnel = (level: IPacmanParsedLevel, tile: IPacmanTile, direction: IPacmanActorDirection): boolean => {
  if (tile.type !== PACMAN_TILE_TYPE.TUNNEL || !tile.tunnelExit) return false;

  if (direction === PACMAN_ACTOR_DIRECTION.LEFT) return tile.column === 0;
  if (direction === PACMAN_ACTOR_DIRECTION.RIGHT) return tile.column === level.width - 1;
  if (direction === PACMAN_ACTOR_DIRECTION.UP) return tile.row === 0;

  return tile.row === level.height - 1;
};

export const getTunnelExitPosition = (
  level: IPacmanParsedLevel,
  tunnelTile: IPacmanTile,
  actorSize: ISize,
): ICoordinate | undefined => {
  if (!tunnelTile.tunnelExit) return;

  const exitTile = level.getTileAt(tunnelTile.tunnelExit.row, tunnelTile.tunnelExit.column);

  if (!exitTile) return;

  return getPositionForActorCenter(getTileCenter(exitTile), actorSize);
};

export const isDirectionWalkableFromTile = (
  level: IPacmanParsedLevel,
  tile: IPacmanTile,
  direction: IPacmanActorDirection,
): boolean => {
  if (canExitTunnel(level, tile, direction)) return true;

  const nextTile = getNextTile(level, tile, direction);

  return nextTile?.walkable ?? false;
};
