
export type TimeControlMode = 'absolute' | 'fischer' | 'byoyomi';

export interface PlayerTime {
  mainTime: number;
  additionalTime: number;
  byoyomiPeriods: number;
  currentTime: number;
  isRunning: boolean;
  currentPeriod: number;
}

export interface GameClockState {
  player1: PlayerTime;
  player2: PlayerTime;
  mode: TimeControlMode;
  activePlayer: 1 | 2;
  isGameRunning: boolean;
  isFlagFallen: boolean;
}
