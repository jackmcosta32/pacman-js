import { System } from '@game-engine/core/system';
import { PositionComponent } from '@game-engine/components/position.component';
import { PACMAN_SYSTEM } from '@pacman/constants/pacman-system.constant';
import type { ISceneState } from '@game-engine/interfaces/scene.interface';
import { PACMAN_EVENT_TYPE } from '@pacman/constants/pacman-event.constant';
import { PacmanActorComponent } from '@pacman/components/pacman-actor.component';
import { PACMAN_ACTOR_DIRECTION, PACMAN_ACTOR_MOVEMENT_STATE } from '@pacman/constants/pacman-actor.constant';
import { getPacmanGameState, getPacmanGhostEntities, getPacmanPlayerEntity } from '@pacman/utils/pacman-entity.util';
import type { IPacmanParsedLevel } from '@pacman/interfaces/pacman-level.interface';

export interface IPacmanRoundStateSystemConstructor {
  level: IPacmanParsedLevel;
}

export class PacmanRoundStateSystem extends System {
  public static readonly id = PACMAN_SYSTEM.ROUND_STATE;

  private readonly level: IPacmanParsedLevel;

  constructor(params: IPacmanRoundStateSystemConstructor) {
    super();

    this.level = params.level;
  }

  public update(sceneState: ISceneState): void {
    const gameStateComponent = getPacmanGameState(sceneState.entityManager);

    if (!gameStateComponent) return;

    if (sceneState.eventMap[PACMAN_EVENT_TYPE.PAUSE_TOGGLE]?.length) {
      gameStateComponent.togglePause();
    }

    if (gameStateComponent.isPlaying) {
      gameStateComponent.updateFrightenedTimer(sceneState.elapsed);
      return;
    }

    const didFinishRespawn = gameStateComponent.updateRespawnTimer(sceneState.elapsed);

    if (didFinishRespawn) {
      this.resetActors(sceneState);
    }
  }

  private resetActors(sceneState: ISceneState): void {
    const playerEntity = getPacmanPlayerEntity(sceneState.entityManager);
    const playerPositionComponent = playerEntity?.getComponent(PositionComponent);
    const playerActorComponent = playerEntity?.getComponent(PacmanActorComponent);

    playerPositionComponent?.updatePosition({ ...this.level.playerSpawn.position });
    playerActorComponent?.updateCurrentDirection(PACMAN_ACTOR_DIRECTION.DOWN);
    playerActorComponent?.updateRequestedDirection(PACMAN_ACTOR_DIRECTION.DOWN);
    playerActorComponent?.updateMovementState(PACMAN_ACTOR_MOVEMENT_STATE.IDLE);

    getPacmanGhostEntities(sceneState.entityManager).forEach((entity, index) => {
      const ghostSpawn = this.level.ghostSpawns[index] ?? this.level.ghostSpawns[0];
      const ghostPositionComponent = entity.getComponent(PositionComponent);

      if (ghostSpawn) {
        ghostPositionComponent?.updatePosition({ ...ghostSpawn.position });
      }
    });
  }
}
