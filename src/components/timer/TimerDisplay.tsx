'use client';

import { motion } from 'framer-motion';
import { useTimer } from '@/hooks/useTimer';

export const TimerDisplay = () => {
  const { formattedTime, currentSession, progress, status } = useTimer();

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Session Type */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          {currentSession.type.charAt(0).toUpperCase() + currentSession.type.slice(1).replace('-', ' ')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {currentSession.description}
        </p>
      </motion.div>

      {/* Timer Circle */}
      <div className="relative w-64 h-64">
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
            strokeWidth="2"
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Progress Circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke={currentSession.color}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={283} // 2 * π * 45
            strokeDashoffset={283 - (283 * progress) / 100}
            initial={{ strokeDashoffset: 283 }}
            animate={{ strokeDashoffset: 283 - (283 * progress) / 100 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="drop-shadow-sm"
          />
        </svg>

        {/* Timer Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            key={formattedTime}
            initial={{ scale: 0.9, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="text-6xl font-mono font-bold text-gray-800 dark:text-gray-200">
              {formattedTime}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {status === 'running' ? 'Focus time' : status === 'paused' ? 'Paused' : 'Ready to start'}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Session Progress Indicator */}
      <div className="flex items-center space-x-2">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {Math.round(progress)}% complete
        </div>
      </div>
    </div>
  );
};