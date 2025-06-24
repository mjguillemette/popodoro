import { useEffect, useRef } from 'react';
import { useTimerStore } from '@/store/timer';

export const useTimer = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const {
    status,
    timeRemaining,
    currentSession,
    tick,
    startTimer,
    pauseTimer,
    resetTimer,
    skipSession,
  } = useTimerStore();

  // Start/stop the timer interval based on status
  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [status, tick]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  const getProgress = (): number => {
    const totalSeconds = currentSession.duration * 60;
    return ((totalSeconds - timeRemaining) / totalSeconds) * 100;
  };

  return {
    status,
    timeRemaining,
    currentSession,
    formattedTime: formatTime(timeRemaining),
    progress: getProgress(),
    startTimer,
    pauseTimer,
    resetTimer,
    skipSession,
  };
};