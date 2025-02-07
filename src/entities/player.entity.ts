import { GameActor } from './game-actor.entity';
import * as PLAYER_CONFIG from '@/config/player.config';

export interface TPlayerConstructor {
  lives?: number;
  actor: GameActor;
  nickname: string;
}

export class Player {
  public lives: number;
  public actor: GameActor;
  public nickname: string;

  constructor({ actor, nickname, lives = PLAYER_CONFIG.PLAYER_LIVES }: TPlayerConstructor) {
    this.lives = lives;
    this.nickname = nickname;
    this.actor = actor;
  }
}
