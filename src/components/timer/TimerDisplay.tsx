'use client';

import { motion } from 'framer-motion';
import { SessionConfig, TimerStatus } from '@/types/timer';

interface TimerDisplayProps {
  formattedTime: string;
  currentSession: SessionConfig;
  progress: number;
  status: TimerStatus;
}

export const TimerDisplay = ({
  formattedTime,
  currentSession,
  progress,
  status,
}: TimerDisplayProps) => {

  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Session Type */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center"
      >
        <h2 className="text-lg font-medium text-neutral-700 dark:text-neutral-300 tracking-tight">
          {currentSession.type.charAt(0).toUpperCase() + currentSession.type.slice(1).replace('-', ' ')}
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 mt-2 text-sm leading-relaxed">
          {currentSession.description}
        </p>
      </motion.div>

      {/* Timer Circle */}
      <div className="relative w-56 h-56">
        {/* Background Circle */}
        <svg
          className="w-full h-full transform -rotate-90"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            className="text-neutral-200 dark:text-neutral-700"
          />
          {/* Progress Circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="rgb(115 115 115)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={283} // 2 * π * 45
            strokeDashoffset={283 - (283 * progress) / 100}
            className="transition-all duration-300 ease-out"
          />
        </svg>

        {/* Timer Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl font-mono font-normal text-neutral-800 dark:text-neutral-200 tabular-nums">
              {formattedTime}
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-3">
              {status === 'running' ? 'Focus time' : status === 'paused' ? 'Paused' : 'Ready to start'}
            </div>
          </div>
        </div>
      </div>

      {/* Session Progress Indicator */}
      <div className="flex items-center">
        <div className="text-xs text-neutral-500 dark:text-neutral-400 tabular-nums">
          {Math.round(progress)}% complete
        </div>
      </div>
    </div>
  );
};