'use client';

import { motion } from 'framer-motion';
import { useTimer } from '@/hooks/useTimer';
import { TimerDisplay } from './TimerDisplay';
import { TimerControls } from './TimerControls';
import { TaskIntegration } from './TaskIntegration';

export const Timer = () => {
  // Call the hook only once in the parent component
  const timer = useTimer();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center space-y-8 p-6"
    >
      {/* Pass the hook's return values as props */}
      <TimerDisplay
        formattedTime={timer.formattedTime}
        currentSession={timer.currentSession}
        progress={timer.progress}
        status={timer.status}
      />
      <TimerControls
        status={timer.status}
        startTimer={timer.startTimer}
        pauseTimer={timer.pauseTimer}
        resetTimer={timer.resetTimer}
        skipSession={timer.skipSession}
      />
      <TaskIntegration
        startTimer={timer.startTimer}
        status={timer.status}
      />
    </motion.div>
  );
};