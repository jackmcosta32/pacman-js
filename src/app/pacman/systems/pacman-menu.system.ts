import { System } from '@game-engine/core/system';
import { UIComponent } from '@game-engine/components/ui.component';
import { PACMAN_SYSTEM } from '@pacman/constants/pacman-system.constant';
import type { ISceneState } from '@game-engine/interfaces/scene.interface';
import { PACMAN_EVENT_TYPE } from '@pacman/constants/pacman-event.constant';
import { PacmanMenuItemComponent } from '@pacman/components/pacman-menu-item.component';
import { PACMAN_MENU_NAVIGATION_DIRECTION } from '@pacman/constants/pacman-menu.constant';
import type { IPacmanMenuNavigateEvent } from '@pacman/interfaces/pacman-event.interface';

export class PacmanMenuSystem extends System {
  public static readonly id = PACMAN_SYSTEM.MENU;

  public init(sceneState: ISceneState): void {
    this.syncMenuText(sceneState);
  }

  public update(sceneState: ISceneState): void {
    const navigationEvents = sceneState.eventMap[PACMAN_EVENT_TYPE.MENU_NAVIGATE] as
      | IPacmanMenuNavigateEvent[]
      | undefined;

    navigationEvents?.forEach((event) => this.moveSelection(sceneState, event));
    this.syncMenuText(sceneState);
  }

  private moveSelection(sceneState: ISceneState, event: IPacmanMenuNavigateEvent): void {
    const menuItems = this.getMenuItems(sceneState);

    if (menuItems.length === 0) return;

    const selectedIndex = Math.max(
      0,
      menuItems.findIndex((item) => item.component.selected),
    );
    const directionDelta = event.direction === PACMAN_MENU_NAVIGATION_DIRECTION.PREVIOUS ? -1 : 1;
    const nextSelectedIndex = (selectedIndex + directionDelta + menuItems.length) % menuItems.length;

    menuItems.forEach((item, index) => {
      if (index === nextSelectedIndex) {
        item.component.select();
        return;
      }

      item.component.deselect();
    });
  }

  private syncMenuText(sceneState: ISceneState): void {
    this.getMenuItems(sceneState).forEach(({ component, uiComponent }) => {
      const label = component.selected ? `> ${component.label} <` : component.label;

      uiComponent.updateInnerText(label);
    });
  }

  private getMenuItems(sceneState: ISceneState) {
    return sceneState.entityManager
      .getEntities()
      .map((entity) => ({
        component: entity.getComponent(PacmanMenuItemComponent),
        uiComponent: entity.getComponent(UIComponent),
      }))
      .filter((item): item is { component: PacmanMenuItemComponent; uiComponent: UIComponent } =>
        Boolean(item.component && item.uiComponent),
      )
      .sort((left, right) => left.component.order - right.component.order);
  }
}
