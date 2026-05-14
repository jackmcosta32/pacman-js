import { PACMAN_ROLE } from '@pacman/constants/pacman-game-state.constant';
import type { IEntity, IEntityManager } from '@game-engine/interfaces/entity.interface';
import { PacmanRoleComponent } from '@pacman/components/pacman-role.component';
import { PacmanGameStateComponent } from '@pacman/components/pacman-game-state.component';

export const getPacmanGameState = (entityManager: IEntityManager): PacmanGameStateComponent | undefined => {
  for (const entity of entityManager.getEntities()) {
    const gameStateComponent = entity.getComponent(PacmanGameStateComponent);

    if (gameStateComponent) return gameStateComponent;
  }
};

export const getPacmanPlayerEntity = (entityManager: IEntityManager): IEntity | undefined => {
  return entityManager
    .getEntities()
    .find((entity) => entity.getComponent(PacmanRoleComponent)?.role === PACMAN_ROLE.PLAYER);
};

export const getPacmanGhostEntities = (entityManager: IEntityManager): IEntity[] => {
  return entityManager
    .getEntities()
    .filter((entity) => entity.getComponent(PacmanRoleComponent)?.role === PACMAN_ROLE.GHOST);
};
