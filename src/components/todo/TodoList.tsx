'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTodoStore } from '@/store/todos';
import { useAudio } from '@/hooks/useAudio';
import { TodoTree } from './TodoTree';
import { AddTreeForm } from './AddTreeForm';
import { CurrentTask } from './CurrentTask';
import { Plus, Target, ListTodo } from 'lucide-react';

export const TodoList = () => {
  const [showAddTree, setShowAddTree] = useState(false);
  const { trees, currentViableTask, selectRandomViableTask } = useTodoStore();
  const { playClick, playSuccess } = useAudio();

  const handleSelectRandomTask = () => {
    playClick();
    const task = selectRandomViableTask();
    if (task) {
      playSuccess();
    }
  };

  const handleAddTree = () => {
    playClick();
    setShowAddTree(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ListTodo size={24} className="text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Todo Lists
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            onClick={handleSelectRandomTask}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition-colors flex items-center gap-2"
          >
            <Target size={16} />
            Select Task
          </motion.button>

          <motion.button
            onClick={handleAddTree}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            New List
          </motion.button>
        </div>
      </div>

      {/* Current task display */}
      {currentViableTask && (
        <CurrentTask task={currentViableTask} />
      )}

      {/* Add tree form */}
      {showAddTree && (
        <AddTreeForm
          onCancel={() => setShowAddTree(false)}
          onSuccess={() => {
            setShowAddTree(false);
            playSuccess();
          }}
        />
      )}

      {/* Todo trees */}
      <div className="space-y-4">
        {trees.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg shadow-sm border-2 border-dashed border-gray-300 dark:border-gray-600"
          >
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              No todo lists yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Create your first todo list to start organizing your tasks
            </p>
            <button
              onClick={handleAddTree}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Create Your First List
            </button>
          </motion.div>
        ) : (
          trees.map((tree) => (
            <TodoTree 
              key={tree.id} 
              tree={tree}
              isSelected={currentViableTask?.treeId === tree.id}
            />
          ))
        )}
      </div>
    </div>
  );
};