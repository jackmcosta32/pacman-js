import { describe, expect, it } from 'vitest';
import { PacmanActorComponent } from '@pacman/components/pacman-actor.component';
import { PACMAN_COMPONENT_TYPE } from '@pacman/constants/pacman-component.constant';
import { PACMAN_ACTOR_DIRECTION, PACMAN_ACTOR_MOVEMENT_STATE } from '@pacman/constants/pacman-actor.constant';

const makeSut = () =>
  new PacmanActorComponent({
    speed: 0.1,
    direction: PACMAN_ACTOR_DIRECTION.LEFT,
    movementState: PACMAN_ACTOR_MOVEMENT_STATE.WALKING,
    actorSpriteMap: {},
  });

describe('Pac-Man - ActorComponent', () => {
  it('should serialize actor state as primitive payload data', () => {
    const sut = makeSut();

    expect(sut.serialize()).toEqual({
      type: PACMAN_COMPONENT_TYPE.ACTOR_COMPONENT,
      speed: 0.1,
      direction: PACMAN_ACTOR_DIRECTION.LEFT,
      movementState: PACMAN_ACTOR_MOVEMENT_STATE.WALKING,
    });
  });
});
