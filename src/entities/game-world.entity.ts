import { Ghost } from './ghost.entity';
import { Pacman } from './pacman.entity';
import { Player } from './player.entity';
import { GameActor } from './game-actor.entity';
import { GHOST_COLORS } from '@/models/ghost.model';
import { QuadTree } from '@/utils/data-structures/quad-tree';
import type { TBoundingBox } from '@/models/bounding-box.model';

export interface TGameWorldConstructor {
  boundingBox: TBoundingBox;
}

// TODO: Maybe rename to Application or Game, or add one more layer on top of this
export class GameWorld {
  // TODO: Abstract the data structure used for collision detection
  private quadTree: QuadTree;
  public actors: GameActor[] = [];
  public boundingBox: TBoundingBox;
  public player: Player | undefined;

  constructor({ boundingBox }: TGameWorldConstructor) {
    this.boundingBox = boundingBox;
    this.quadTree = new QuadTree({ boundingBox });
  }

  public init() {
    const pacman = new Pacman();
    const redGhost = new Ghost({ color: GHOST_COLORS.RED });
    const blueGhost = new Ghost({ color: GHOST_COLORS.BLUE });
    const pinkGhost = new Ghost({ color: GHOST_COLORS.PINK });
    const greenGhost = new Ghost({ color: GHOST_COLORS.GREEN });
    const orangeGhost = new Ghost({ color: GHOST_COLORS.ORANGE });
    const purpleGhost = new Ghost({ color: GHOST_COLORS.PURPLE });

    this.player = new Player({ nickname: 'Pacman', actor: pacman });
    this.actors = [pacman, redGhost, blueGhost, pinkGhost, greenGhost, orangeGhost, purpleGhost];
  }

  // TODO: Maybe add the "scene" as the return of the update method
  public queryVisibleActors(range: TBoundingBox) {
    return this.quadTree.query(range);
  }

  public update() {
    this.quadTree.clear();
    this.actors.forEach((actor) => this.quadTree.insert(actor));
  }
}
