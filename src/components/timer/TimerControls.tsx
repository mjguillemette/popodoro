'use client';

import { motion } from 'framer-motion';
import { useTimer } from '@/hooks/useTimer';
import { useAudio } from '@/hooks/useAudio';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';

export const TimerControls = () => {
  const { status, startTimer, pauseTimer, resetTimer, skipSession } = useTimer();
  const { playClick } = useAudio();

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  const iconSize = 24;

  return (
    <div className="flex items-center justify-center space-x-4">
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
            startTimer();
          }
        }}
        className="flex items-center justify-center w-16 h-16 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-colors duration-200"
      >
        {status === 'running' ? (
          <Pause size={iconSize} />
        ) : (
          <Play size={iconSize} className="ml-1" />
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
        className="flex items-center justify-center w-12 h-12 bg-gray-500 hover:bg-gray-600 text-white rounded-full shadow-md transition-colors duration-200"
      >
        <RotateCcw size={18} />
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
        className="flex items-center justify-center w-12 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-md transition-colors duration-200"
      >
        <SkipForward size={18} />
      </motion.button>
    </div>
  );
};