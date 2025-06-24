import { create } from 'zustand';
import { TimerState, TimerActions, SessionConfig, SessionType } from '@/types/timer';

const SESSION_CONFIGS: Record<SessionType, Omit<SessionConfig, 'type'>> = {
  work: {
    duration: 25,
    description: 'Focus on important tasks',
    color: '#ef4444', // red-500
  },
  creative: {
    duration: 30,
    description: 'Brainstorm and create',
    color: '#8b5cf6', // violet-500
  },
  'deep-focus': {
    duration: 45,
    description: 'Deep, uninterrupted work',
    color: '#3b82f6', // blue-500
  },
  'quick-burst': {
    duration: 15,
    description: 'Quick tasks and emails',
    color: '#f59e0b', // amber-500
  },
};

const getRandomSessionType = (): SessionType => {
  const types: SessionType[] = ['work', 'creative', 'deep-focus', 'quick-burst'];
  return types[Math.floor(Math.random() * types.length)];
};

const createSessionConfig = (type: SessionType): SessionConfig => ({
  type,
  ...SESSION_CONFIGS[type],
});

interface TimerStore extends TimerState, TimerActions {}

export const useTimerStore = create<TimerStore>((set, get) => ({
  // Initial state
  currentSession: createSessionConfig('work'),
  phase: 'work',
  status: 'idle',
  timeRemaining: 25 * 60, // 25 minutes in seconds
  totalTime: 25 * 60,
  sessionCount: 0,
  completedSessions: 0,

  // Actions
  startTimer: () => {
    set({ status: 'running' });
  },

  pauseTimer: () => {
    set({ status: 'paused' });
  },

  resetTimer: () => {
    const state = get();
    set({
      status: 'idle',
      timeRemaining: state.totalTime,
      phase: 'work',
    });
  },

  skipSession: () => {
    const state = get();
    const newSessionType = getRandomSessionType();
    const newSession = createSessionConfig(newSessionType);
    
    set({
      currentSession: newSession,
      timeRemaining: newSession.duration * 60,
      totalTime: newSession.duration * 60,
      status: 'idle',
      sessionCount: state.sessionCount + 1,
    });
  },

  setSession: (session: SessionConfig) => {
    set({
      currentSession: session,
      timeRemaining: session.duration * 60,
      totalTime: session.duration * 60,
      status: 'idle',
    });
  },

  tick: () => {
    const state = get();
    if (state.status !== 'running') return;

    const newTimeRemaining = state.timeRemaining - 1;
    
    if (newTimeRemaining <= 0) {
      // Session completed
      set({
        status: 'completed',
        timeRemaining: 0,
        completedSessions: state.completedSessions + 1,
      });
    } else {
      set({ timeRemaining: newTimeRemaining });
    }
  },
}));