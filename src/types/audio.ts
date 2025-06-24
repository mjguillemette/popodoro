export type SoundType = 'click' | 'tick' | 'success' | 'complete' | 'level-up' | 'achievement';

export interface SoundConfig {
  type: SoundType;
  volume: number;
  pitch?: number;
  duration?: number;
}

export interface AudioState {
  enabled: boolean;
  volume: number;
  tickEnabled: boolean;
}

export interface AudioActions {
  playSound: (type: SoundType) => void;
  setVolume: (volume: number) => void;
  toggleSound: () => void;
  toggleTick: () => void;
}