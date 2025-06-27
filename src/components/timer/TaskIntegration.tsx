'use client';

import { motion } from 'framer-motion';
import { TimerStatus } from '@/types/timer';
import { useTodoStore } from '@/store/todos';
import { useAudio } from '@/hooks/useAudio';
import { Target, ArrowRight, Play, Shuffle } from 'lucide-react';

interface TaskIntegrationProps {
  startTimer: () => void;
  status: TimerStatus;
}

export const TaskIntegration = ({ startTimer, status }: TaskIntegrationProps) => {
  const { currentViableTask, selectRandomViableTask, markTaskInProgress } = useTodoStore();
  const { playClick, playSuccess } = useAudio();

  const handleSelectTask = () => {
    playClick();
    const task = selectRandomViableTask();
    if (task) {
      playSuccess();
    }
  };

  const handleStartTask = () => {
    if (currentViableTask) {
      playClick();
      markTaskInProgress(currentViableTask.treeId, currentViableTask.todo.id);
      // Also start the timer when starting a task
      if (status !== 'running') {
        startTimer();
      }
    }
  };

  if (!currentViableTask) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 text-center"
      >
        <div className="text-yellow-600 dark:text-yellow-400 mb-2">
          <Target size={20} className="mx-auto mb-1" />
          <p className="text-sm font-medium">No task selected</p>
        </div>
        <button
          onClick={handleSelectTask}
          className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded transition-colors flex items-center gap-1 mx-auto"
        >
          <Shuffle size={12} />
          Select Random Task
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4"
    >
      <div className="text-center">
        <div className="flex items-center justify-center gap-1 mb-2">
          <Target size={16} className="text-blue-500" />
          <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
            Current Task
          </span>
        </div>
        
        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
          {currentViableTask.todo.title}
        </h4>
        
        <div className="flex items-center justify-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
          {currentViableTask.path.slice(0, -1).map((segment, index) => (
            <div key={index} className="flex items-center gap-1">
              <span>{segment}</span>
              <ArrowRight size={10} />
            </div>
          ))}
        </div>

        <div className="flex gap-2 justify-center">
          {currentViableTask.todo.status === 'pending' && (
            <button
              onClick={handleStartTask}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors flex items-center gap-1 font-medium"
            >
              <Play size={14} />
              Start & Focus
            </button>
          )}
          
          <button
            onClick={handleSelectTask}
            className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors flex items-center gap-1"
          >
            <Shuffle size={12} />
            Pick Different Task
          </button>
        </div>
      </div>
    </motion.div>
  );
};