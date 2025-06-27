'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { TodoPriority } from '@/types/todo';
import { useTodoStore } from '@/store/todos';
import { useAudio } from '@/hooks/useAudio';
import { Save, X } from 'lucide-react';

interface AddTodoFormProps {
  treeId: string;
  parentId?: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export const AddTodoForm = ({ 
  treeId, 
  parentId, 
  onCancel, 
  onSuccess 
}: AddTodoFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TodoPriority>('medium');
  const [estimatedPomodoros, setEstimatedPomodoros] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addTodo } = useTodoStore();
  const { playClick } = useAudio();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    playClick();

    try {
      await addTodo(treeId, {
        title: title.trim(),
        description: description.trim() || undefined,
        status: 'pending',
        priority,
        estimatedPomodoros: estimatedPomodoros > 0 ? estimatedPomodoros : undefined,
      }, parentId);

      onSuccess();
    } catch (error) {
      console.error('Failed to add todo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    playClick();
    onCancel();
  };

  return (
    <motion.form
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onSubmit={handleSubmit}
      className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border-2 border-dashed border-gray-300 dark:border-gray-600"
    >
      <div className="space-y-4">
        {/* Title */}
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
            required
          />
        </div>

        {/* Description */}
        <div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)..."
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Priority and Pomodoros */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TodoPriority)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Est. Pomodoros
            </label>
            <input
              type="number"
              value={estimatedPomodoros}
              onChange={(e) => setEstimatedPomodoros(parseInt(e.target.value) || 1)}
              min="1"
              max="20"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <motion.button
            type="button"
            onClick={handleCancel}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <X size={16} className="inline mr-1" />
            Cancel
          </motion.button>

          <motion.button
            type="submit"
            disabled={!title.trim() || isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-md transition-colors flex items-center gap-1"
          >
            <Save size={16} />
            {isSubmitting ? 'Adding...' : 'Add Task'}
          </motion.button>
        </div>
      </div>
    </motion.form>
  );
};