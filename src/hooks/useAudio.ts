import { useCallback } from 'react';
import { useSettingsStore } from '@/store/settings';
import { soundManager } from '@/lib/sounds';
import { SoundType } from '@/types/audio';

export const useAudio = () => {
  const { sounds } = useSettingsStore();

  const playSound = useCallback(
    async (type: SoundType) => {
      if (!sounds) return;
      
      try {
        await soundManager.playSound(type, 0.7);
      } catch (error) {
        console.warn('Audio playback failed:', error);
      }
    },
    [sounds]
  );

  const playClick = () => playSound('click');
  const playTick = () => playSound('tick');
  const playSuccess = () => playSound('success');
  const playComplete = () => playSound('complete');
  const playLevelUp = () => playSound('level-up');
  const playAchievement = () => playSound('achievement');

  return {
    playSound,
    playClick,
    playTick,
    playSuccess,
    playComplete,
    playLevelUp,
    playAchievement,
    soundsEnabled: sounds,
  };
};