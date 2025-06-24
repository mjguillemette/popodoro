export type SessionType = 'work' | 'creative' | 'deep-focus' | 'quick-burst';

export type TimerPhase = 'work' | 'short-break' | 'long-break';

export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface SessionConfig {
  type: SessionType;
  duration: number; // in minutes
  description: string;
  color: string;
}

export interface TimerState {
  currentSession: SessionConfig;
  phase: TimerPhase;
  status: TimerStatus;
  timeRemaining: number; // in seconds
  totalTime: number; // in seconds
  sessionCount: number;
  completedSessions: number;
}

export interface TimerActions {
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  skipSession: () => void;
  setSession: (session: SessionConfig) => void;
  tick: () => void;
}