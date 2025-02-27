import { Game } from '@game-engine/game';
import type { Callback } from '@shared/types/util.type';
import type { ISprite } from '@shared/interfaces/graphics.interface';
import type { ICoordinate } from '@shared/interfaces/coordinate.interface';
import { Entity } from '@game-engine/core/entity';
import { PositionComponent } from '@game-engine/components/position.component';
import { RenderComponent } from '@game-engine/components/render.component';
import { PACMAN_SPRITE_MAP } from '@pacman/sprites/pacman.sprites';

export interface IGameState {
  graphics: [ISprite, ICoordinate][];
}

export class PacmanGame extends Game {
  private currentState: string;
  private player;
  protected subscriptions = new Map<string, Set<Callback>>();

  init(): void {
    const positionComponent = new PositionComponent({
      position: { x: 0, y: 0 },
      size: { width: 48, height: 48 },
    });

    const renderComponent = new RenderComponent({
      spriteMap: PACMAN_SPRITE_MAP,
    });

    const pacmanEntity = new Entity({
      id: 'Pacman',
      components: [positionComponent, renderComponent],
    });

    this.player = pacmanEntity;
  }

  start(): void {
    throw new Error('Method not implemented.');
  }

  update(params: { timestamp: number; inputEvent: unknown }): IGameState {
    return {
      graphics,
    };
  }

  destroy(): void {
    throw new Error('Method not implemented.');
  }
}
