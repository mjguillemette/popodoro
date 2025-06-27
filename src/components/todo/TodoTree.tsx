'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { TodoTree as TodoTreeType } from '@/types/todo';
import { useTodoStore } from '@/store/todos';
import { useAudio } from '@/hooks/useAudio';
import { TodoItem } from './TodoItem';
import { AddTodoForm } from './AddTodoForm';
import { 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronRight,
  Target
} from 'lucide-react';

interface TodoTreeProps {
  tree: TodoTreeType;
  isSelected?: boolean;
}

export const TodoTree = ({ tree, isSelected = false }: TodoTreeProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addingToParentId, setAddingToParentId] = useState<string | undefined>();
  const [showActions, setShowActions] = useState(false);
  
  const { deleteTree, selectRandomViableTask } = useTodoStore();
  const { playClick, playSuccess } = useAudio();

  const handleAddTodo = (parentId?: string) => {
    setAddingToParentId(parentId);
    setShowAddForm(true);
  };

  const handleSelectTask = () => {
    playClick();
    const task = selectRandomViableTask();
    if (task) {
      playSuccess();
    }
  };

  const handleDeleteTree = () => {
    playClick();
    deleteTree(tree.id);
  };

  const handleToggleExpanded = () => {
    playClick();
    setIsExpanded(!isExpanded);
  };

  const completedCount = tree.todos.filter(todo => todo.status === 'completed').length;
  const totalCount = tree.todos.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        bg-white dark:bg-gray-900 rounded-lg shadow-sm border-2 transition-all duration-200
        ${isSelected ? 'border-blue-400 shadow-lg' : 'border-gray-200 dark:border-gray-700'}
      `}
    >
      {/* Tree header */}
      <div
        className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700"
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={handleToggleExpanded}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            {isExpanded ? (
              <ChevronDown size={16} className="text-gray-500" />
            ) : (
              <ChevronRight size={16} className="text-gray-500" />
            )}
          </button>

          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: tree.color || '#6b7280' }}
          />

          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">
              {tree.title}
            </h3>
            {tree.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {tree.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Progress indicator */}
          <div className="text-xs text-gray-500">
            {completedCount}/{totalCount}
          </div>
          
          {/* Progress bar */}
          <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-green-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: showActions ? 1 : 0, scale: showActions ? 1 : 0.8 }}
            className="flex items-center gap-1"
          >
            <button
              onClick={handleSelectTask}
              className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition-colors"
              title="Select random viable task"
            >
              <Target size={16} className="text-blue-500" />
            </button>

            <button
              onClick={() => handleAddTodo()}
              className="p-2 hover:bg-green-100 dark:hover:bg-green-900 rounded transition-colors"
              title="Add new task"
            >
              <Plus size={16} className="text-green-500" />
            </button>

            <button
              onClick={handleDeleteTree}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
              title="Delete tree"
            >
              <Trash2 size={16} className="text-red-500" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Tree content */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-4"
        >
          {/* Add todo form */}
          {showAddForm && (
            <div className="mb-4">
              <AddTodoForm
                treeId={tree.id}
                parentId={addingToParentId}
                onCancel={() => {
                  setShowAddForm(false);
                  setAddingToParentId(undefined);
                }}
                onSuccess={() => {
                  setShowAddForm(false);
                  setAddingToParentId(undefined);
                  playSuccess();
                }}
              />
            </div>
          )}

          {/* Todo items */}
          <div className="space-y-2">
            {tree.todos.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <div className="text-4xl mb-2">📝</div>
                <p>No tasks yet</p>
                <button
                  onClick={() => handleAddTodo()}
                  className="mt-2 text-blue-500 hover:text-blue-600 text-sm"
                >
                  Add your first task
                </button>
              </div>
            ) : (
              tree.todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  treeId={tree.id}
                  onAddChild={handleAddTodo}
                />
              ))
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};