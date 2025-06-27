'use client';

import { motion } from 'framer-motion';
import { TimerStatus } from '@/types/timer';
import { useAudio } from '@/hooks/useAudio';
import { useTodos } from '@/hooks/useTodos';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';

interface TimerControlsProps {
  status: TimerStatus;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  skipSession: () => void;
}

export const TimerControls = ({
  status,
  startTimer,
  pauseTimer,
  resetTimer,
  skipSession,
}: TimerControlsProps) => {
  const { playClick } = useAudio();
  const { currentViableTask, selectRandomTask } = useTodos();

  const buttonVariants = {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
  };

  const iconSize = 20;

  return (
    <div className="flex items-center justify-center space-x-3">
      {/* Play/Pause Button */}
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={() => {
          playClick();
          if (status === 'running') {
            pauseTimer();
          } else {
            // Auto-select a task if none is selected when starting timer
            if (!currentViableTask) {
              selectRandomTask();
            }
            startTimer();
          }
        }}
        className="flex items-center justify-center w-14 h-14 bg-neutral-800 hover:bg-neutral-700 dark:bg-neutral-200 dark:hover:bg-neutral-300 text-neutral-50 dark:text-neutral-800 rounded-full transition-colors duration-300"
      >
        {status === 'running' ? (
          <Pause size={iconSize} />
        ) : (
          <Play size={iconSize} className="ml-0.5" />
        )}
      </motion.button>

      {/* Reset Button */}
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={() => {
          playClick();
          resetTimer();
        }}
        className="flex items-center justify-center w-10 h-10 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-600 dark:text-neutral-300 rounded-full transition-colors duration-300"
      >
        <RotateCcw size={16} />
      </motion.button>

      {/* Skip Button */}
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={() => {
          playClick();
          skipSession();
        }}
        className="flex items-center justify-center w-10 h-10 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-600 dark:text-neutral-300 rounded-full transition-colors duration-300"
      >
        <SkipForward size={16} />
      </motion.button>
    </div>
  );
};