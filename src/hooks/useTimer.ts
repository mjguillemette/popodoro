import { useEffect, useRef } from 'react';
import { useTimerStore } from '@/store/timer';

export const useTimer = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRunningRef = useRef(false);
  const store = useTimerStore();
  const {
    status,
    timeRemaining,
    currentSession,
    startTimer,
    pauseTimer,
    resetTimer,
    skipSession,
  } = store;

  // Start/stop the timer interval based on status
  useEffect(() => {
    if (status === 'running' && !isRunningRef.current) {
      isRunningRef.current = true;
      
      // Clear any existing interval first
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      intervalRef.current = setInterval(() => {
        useTimerStore.getState().tick();
      }, 1000);
    } else if (status !== 'running' && isRunningRef.current) {
      isRunningRef.current = false;
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Cleanup on unmount
    return () => {
      isRunningRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [status]);

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