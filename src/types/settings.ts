export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  desktop: boolean;
}

export interface SessionDurations {
  work: number;
  creative: number;
  deepFocus: number;
  quickBurst: number;
  shortBreak: number;
  longBreak: number;
}

export interface AppSettings {
  notifications: NotificationSettings;
  durations: SessionDurations;
  autoStartBreaks: boolean;
  autoStartSessions: boolean;
  longBreakInterval: number; // every N sessions
  theme: 'light' | 'dark' | 'auto';
  animations: boolean;
  sounds: boolean;
}

export interface SettingsActions {
  updateSettings: (settings: Partial<AppSettings>) => void;
  resetSettings: () => void;
}