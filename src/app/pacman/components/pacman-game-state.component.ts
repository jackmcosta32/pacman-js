import { Component } from '@game-engine/core/component';
import { PACMAN_COMPONENT_TYPE } from '@pacman/constants/pacman-component.constant';
import type { ISerializedComponent } from '@game-engine/interfaces/component.interface';
import {
  PACMAN_GAME_STATE_DEFAULTS,
  PACMAN_ROUND_STATUS,
  PACMAN_SOUND_EFFECT,
} from '@pacman/constants/pacman-game-state.constant';
import type {
  IPacmanRoundStatus,
  IPacmanSoundEffect,
  IPacmanSoundHook,
} from '@pacman/interfaces/pacman-game-state.interface';

export interface IPacmanGameStateComponentConstructor {
  score?: number;
  lives?: number;
  status?: IPacmanRoundStatus;
  remainingCollectibles: number;
  respawnRemainingMs?: number;
  frightenedRemainingMs?: number;
  frightenedWindowId?: number;
  ghostEatenStreak?: number;
  soundHookMaxLength?: number;
}

export interface ISerializedPacmanGameStateComponent extends ISerializedComponent {
  score: number;
  lives: number;
  status: IPacmanRoundStatus;
  remainingCollectibles: number;
  respawnRemainingMs: number;
  frightenedRemainingMs: number;
  frightenedWindowId: number;
  ghostEatenStreak: number;
  soundHooks: IPacmanSoundHook[];
}

export class PacmanGameStateComponent extends Component {
  public static readonly type = PACMAN_COMPONENT_TYPE.GAME_STATE_COMPONENT;

  public score: number;
  public lives: number;
  public status: IPacmanRoundStatus;
  public remainingCollectibles: number;
  public respawnRemainingMs: number;
  public frightenedRemainingMs: number;
  public frightenedWindowId: number;
  public ghostEatenStreak: number;
  private nextSoundHookId = 1;
  private readonly soundHooks: IPacmanSoundHook[] = [];
  private readonly soundHookMaxLength: number;

  constructor(params: IPacmanGameStateComponentConstructor) {
    super();

    this.score = params.score ?? 0;
    this.lives = params.lives ?? PACMAN_GAME_STATE_DEFAULTS.LIVES;
    this.status = params.status ?? PACMAN_ROUND_STATUS.PLAYING;
    this.respawnRemainingMs = params.respawnRemainingMs ?? 0;
    this.frightenedRemainingMs = params.frightenedRemainingMs ?? 0;
    this.frightenedWindowId = params.frightenedWindowId ?? 0;
    this.ghostEatenStreak = params.ghostEatenStreak ?? 0;
    this.remainingCollectibles = params.remainingCollectibles;
    this.soundHookMaxLength = params.soundHookMaxLength ?? PACMAN_GAME_STATE_DEFAULTS.SOUND_HOOK_MAX_LENGTH;

    this.queueSound(PACMAN_SOUND_EFFECT.START);
  }

  public get isPlaying(): boolean {
    return this.status === PACMAN_ROUND_STATUS.PLAYING;
  }

  public get isFrightenedModeActive(): boolean {
    return this.frightenedRemainingMs > 0;
  }

  public togglePause(): void {
    if (this.status === PACMAN_ROUND_STATUS.PLAYING) {
      this.status = PACMAN_ROUND_STATUS.PAUSED;
      return;
    }

    if (this.status === PACMAN_ROUND_STATUS.PAUSED) {
      this.status = PACMAN_ROUND_STATUS.PLAYING;
    }
  }

  public addScore(scoreValue: number): void {
    this.score += scoreValue;
  }

  public collectOne(): void {
    this.remainingCollectibles = Math.max(0, this.remainingCollectibles - 1);

    if (this.remainingCollectibles === 0) {
      this.status = PACMAN_ROUND_STATUS.WON;
    }
  }

  public startFrightenedMode(durationMs = PACMAN_GAME_STATE_DEFAULTS.FRIGHTENED_DURATION_MS): void {
    this.frightenedRemainingMs = durationMs;
    this.frightenedWindowId += 1;
    this.ghostEatenStreak = 0;
  }

  public updateFrightenedTimer(elapsed: number): void {
    this.frightenedRemainingMs = Math.max(0, this.frightenedRemainingMs - elapsed);
  }

  public beginRespawn(): void {
    if (!this.isPlaying) return;

    this.lives = Math.max(0, this.lives - 1);
    this.frightenedRemainingMs = 0;
    this.ghostEatenStreak = 0;
    this.queueSound(PACMAN_SOUND_EFFECT.DEATH);

    if (this.lives === 0) {
      this.status = PACMAN_ROUND_STATUS.GAME_OVER;
      this.respawnRemainingMs = 0;
      return;
    }

    this.status = PACMAN_ROUND_STATUS.RESPAWNING;
    this.respawnRemainingMs = PACMAN_GAME_STATE_DEFAULTS.RESPAWN_DELAY_MS;
  }

  public updateRespawnTimer(elapsed: number): boolean {
    if (this.status !== PACMAN_ROUND_STATUS.RESPAWNING) return false;

    this.respawnRemainingMs = Math.max(0, this.respawnRemainingMs - elapsed);

    if (this.respawnRemainingMs > 0) return false;

    this.status = PACMAN_ROUND_STATUS.PLAYING;

    return true;
  }

  public queueSound(soundEffect: IPacmanSoundEffect): void {
    this.soundHooks.push({
      soundEffect,
      id: this.nextSoundHookId,
    });
    this.nextSoundHookId += 1;

    while (this.soundHooks.length > this.soundHookMaxLength) {
      this.soundHooks.shift();
    }
  }

  public addGhostEatenScore(scoreValues: readonly number[]): number {
    const scoreValue = scoreValues[Math.min(this.ghostEatenStreak, scoreValues.length - 1)] ?? 0;

    this.addScore(scoreValue);
    this.ghostEatenStreak += 1;
    this.queueSound(PACMAN_SOUND_EFFECT.GHOST_EATEN);

    return scoreValue;
  }

  public serialize(): ISerializedPacmanGameStateComponent {
    return {
      type: this.type,
      score: this.score,
      lives: this.lives,
      status: this.status,
      respawnRemainingMs: this.respawnRemainingMs,
      frightenedRemainingMs: this.frightenedRemainingMs,
      frightenedWindowId: this.frightenedWindowId,
      ghostEatenStreak: this.ghostEatenStreak,
      remainingCollectibles: this.remainingCollectibles,
      soundHooks: this.soundHooks.map((soundHook) => ({ ...soundHook })),
    };
  }
}
