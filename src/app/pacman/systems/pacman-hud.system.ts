import { System } from '@game-engine/core/system';
import { UIComponent } from '@game-engine/components/ui.component';
import { PACMAN_SYSTEM } from '@pacman/constants/pacman-system.constant';
import type { ISceneState } from '@game-engine/interfaces/scene.interface';
import { PACMAN_HUD_TYPE, PACMAN_ROUND_STATUS } from '@pacman/constants/pacman-game-state.constant';
import { PacmanHudComponent } from '@pacman/components/pacman-hud.component';
import { getPacmanGameState } from '@pacman/utils/pacman-entity.util';

export class PacmanHudSystem extends System {
  public static readonly id = PACMAN_SYSTEM.HUD;

  public update(sceneState: ISceneState): void {
    const gameStateComponent = getPacmanGameState(sceneState.entityManager);

    if (!gameStateComponent) return;

    sceneState.entityManager.forEachEntity((entity) => {
      const hudComponent = entity.getComponent(PacmanHudComponent);
      const uiComponent = entity.getComponent(UIComponent);

      if (!hudComponent || !uiComponent) return;

      uiComponent.updateInnerText(this.getHudText(hudComponent, gameStateComponent));
    });
  }

  private getHudText(hudComponent: PacmanHudComponent, gameStateComponent: ReturnType<typeof getPacmanGameState>): string {
    if (!gameStateComponent) return '';

    switch (hudComponent.hudType) {
      case PACMAN_HUD_TYPE.SCORE:
        return `SCORE ${gameStateComponent.score}`;
      case PACMAN_HUD_TYPE.LIVES:
        return `LIVES ${gameStateComponent.lives}`;
      case PACMAN_HUD_TYPE.STATUS:
        return this.getStatusText(gameStateComponent.status);
    }
  }

  private getStatusText(status: string): string {
    switch (status) {
      case PACMAN_ROUND_STATUS.PAUSED:
        return 'PAUSED';
      case PACMAN_ROUND_STATUS.RESPAWNING:
        return 'READY';
      case PACMAN_ROUND_STATUS.WON:
        return 'YOU WIN';
      case PACMAN_ROUND_STATUS.GAME_OVER:
        return 'GAME OVER';
      default:
        return '';
    }
  }
}
