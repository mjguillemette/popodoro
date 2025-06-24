import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppSettings, SettingsActions } from '@/types/settings';

const DEFAULT_SETTINGS: AppSettings = {
  notifications: {
    enabled: true,
    sound: true,
    desktop: false,
  },
  durations: {
    work: 25,
    creative: 30,
    deepFocus: 45,
    quickBurst: 15,
    shortBreak: 5,
    longBreak: 15,
  },
  autoStartBreaks: false,
  autoStartSessions: false,
  longBreakInterval: 4,
  theme: 'auto',
  animations: true,
  sounds: true,
};

interface SettingsStore extends AppSettings, SettingsActions {}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,

      updateSettings: (newSettings: Partial<AppSettings>) => {
        set((state) => ({ ...state, ...newSettings }));
      },

      resetSettings: () => {
        set(DEFAULT_SETTINGS);
      },
    }),
    {
      name: 'popodoro-settings',
    }
  )
);