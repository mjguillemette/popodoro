'use client';

import { motion } from 'framer-motion';
import { ViableTask } from '@/types/todo';
import { useTodoStore } from '@/store/todos';
import { useAudio } from '@/hooks/useAudio';
import { 
  Play, 
  Check, 
  ArrowRight, 
  Clock, 
  Target
} from 'lucide-react';

interface CurrentTaskProps {
  task: ViableTask;
}

export const CurrentTask = ({ task }: CurrentTaskProps) => {
  const { markTaskInProgress, markTaskCompleted } = useTodoStore();
  const { playClick, playSuccess } = useAudio();

  const handleStartTask = () => {
    playClick();
    markTaskInProgress(task.treeId, task.todo.id);
  };

  const handleCompleteTask = () => {
    playSuccess();
    markTaskCompleted(task.treeId, task.todo.id);
  };

  const getPriorityColor = () => {
    switch (task.todo.priority) {
      case 'high':
        return 'text-red-500 bg-red-100 dark:bg-red-900';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900';
      case 'low':
        return 'text-green-600 bg-green-100 dark:bg-green-900';
    }
  };

  const getPriorityIcon = () => {
    switch (task.todo.priority) {
      case 'high':
        return '🔥';
      case 'medium':
        return '⚡';
      case 'low':
        return '🌱';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-700 shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <Target size={20} className="text-blue-500" />
            <h3 className="font-semibold text-blue-800 dark:text-blue-200">
              Selected Task
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor()}`}>
              {getPriorityIcon()} {task.todo.priority}
            </span>
          </div>

          {/* Task title */}
          <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            {task.todo.title}
          </h4>

          {/* Task description */}
          {task.todo.description && (
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              {task.todo.description}
            </p>
          )}

          {/* Path breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
            <span className="font-medium">Path:</span>
            {task.path.map((segment, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className={index === task.path.length - 1 ? 'font-medium text-blue-600 dark:text-blue-400' : ''}>
                  {segment}
                </span>
                {index < task.path.length - 1 && (
                  <ArrowRight size={12} className="text-gray-400" />
                )}
              </div>
            ))}
          </div>

          {/* Task metadata */}
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <span>Depth: {task.depth}</span>
            </div>
            {task.todo.estimatedPomodoros && (
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{task.todo.estimatedPomodoros} pomodoro{task.todo.estimatedPomodoros !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 ml-4">
          {task.todo.status === 'pending' && (
            <motion.button
              onClick={handleStartTask}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition-colors flex items-center gap-2"
            >
              <Play size={16} />
              Start
            </motion.button>
          )}

          {task.todo.status === 'in-progress' && (
            <motion.button
              onClick={handleCompleteTask}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md transition-colors flex items-center gap-2"
            >
              <Check size={16} />
              Complete
            </motion.button>
          )}

          {task.todo.status === 'completed' && (
            <div className="px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg flex items-center gap-2">
              <Check size={16} />
              Completed
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};