'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTodoStore } from '@/store/todos';
import { useAudio } from '@/hooks/useAudio';
import { Save, X, Palette } from 'lucide-react';

interface AddTreeFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

const PRESET_COLORS = [
  '#ef4444', // red
  '#f59e0b', // amber
  '#10b981', // emerald
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#6b7280', // gray
  '#14b8a6', // teal
];

export const AddTreeForm = ({ onCancel, onSuccess }: AddTreeFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createTree } = useTodoStore();
  const { playClick } = useAudio();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    playClick();

    try {
      await createTree(
        title.trim(),
        description.trim() || undefined,
        selectedColor
      );
      onSuccess();
    } catch (error) {
      console.error('Failed to create tree:', error);
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
      className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg border-2 border-blue-200 dark:border-blue-800"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Palette size={20} className="text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Create New Todo List
          </h3>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            List Name
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Work Projects, Personal Goals..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of this todo list..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Color selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            List Color
          </label>
          <div className="flex gap-2 flex-wrap">
            {PRESET_COLORS.map((color) => (
              <motion.button
                key={color}
                type="button"
                onClick={() => {
                  playClick();
                  setSelectedColor(color);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  selectedColor === color 
                    ? 'border-gray-800 dark:border-gray-200 shadow-lg' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <motion.button
            type="button"
            onClick={handleCancel}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors flex items-center gap-1"
          >
            <X size={16} />
            Cancel
          </motion.button>

          <motion.button
            type="submit"
            disabled={!title.trim() || isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-md transition-colors flex items-center gap-2"
          >
            <Save size={16} />
            {isSubmitting ? 'Creating...' : 'Create List'}
          </motion.button>
        </div>
      </div>
    </motion.form>
  );
};