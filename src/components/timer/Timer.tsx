'use client';

import { motion } from 'framer-motion';
import { TimerDisplay } from './TimerDisplay';
import { TimerControls } from './TimerControls';

export const Timer = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex flex-col items-center space-y-8 p-8"
    >
      <TimerDisplay />
      <TimerControls />
    </motion.div>
  );
};