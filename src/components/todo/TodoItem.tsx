'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Todo, TodoStatus } from '@/types/todo';
import { useTodoStore } from '@/store/todos';
import { useAudio } from '@/hooks/useAudio';
import { 
  Check, 
  Circle, 
  Play, 
  Plus, 
  ChevronDown, 
  ChevronRight,
  Trash2
} from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
  treeId: string;
  depth?: number;
  isSelected?: boolean;
  onAddChild?: (parentId: string) => void;
}

export const TodoItem = ({ 
  todo, 
  treeId, 
  depth = 0, 
  isSelected = false,
  onAddChild 
}: TodoItemProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showActions, setShowActions] = useState(false);
  const { updateTodo, deleteTodo } = useTodoStore();
  const { playClick, playSuccess } = useAudio();

  const hasChildren = todo.children && todo.children.length > 0;
  const isCompleted = todo.status === 'completed';

  const getStatusIcon = () => {
    switch (todo.status) {
      case 'completed':
        return <Check size={16} className="text-green-500" />;
      case 'in-progress':
        return <Play size={16} className="text-blue-500" />;
      default:
        return <Circle size={16} className="text-gray-400" />;
    }
  };

  const getPriorityColor = () => {
    switch (todo.priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
    }
  };

  const handleStatusChange = (newStatus: TodoStatus) => {
    playClick();
    if (newStatus === 'completed') {
      playSuccess();
    }
    updateTodo(treeId, todo.id, { status: newStatus });
  };

  const handleDelete = () => {
    playClick();
    deleteTodo(treeId, todo.id);
  };

  const handleToggleExpanded = () => {
    playClick();
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`
        group relative
        ${depth > 0 ? 'ml-6' : ''}
        ${isSelected ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}
      `}
    >
      {/* Main todo item */}
      <div
        className={`
          flex items-center gap-3 p-3 rounded-lg border-l-4 transition-all duration-200
          ${getPriorityColor()}
          ${isCompleted ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}
          ${isSelected ? 'shadow-md' : 'shadow-sm hover:shadow-md'}
          ${isCompleted ? 'opacity-60' : ''}
        `}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {/* Expand/collapse button */}
        {hasChildren && (
          <button
            onClick={handleToggleExpanded}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            {isExpanded ? (
              <ChevronDown size={14} className="text-gray-500" />
            ) : (
              <ChevronRight size={14} className="text-gray-500" />
            )}
          </button>
        )}

        {/* Status toggle */}
        <button
          onClick={() => {
            if (todo.status === 'pending') {
              handleStatusChange('completed');
            } else if (todo.status === 'completed') {
              handleStatusChange('pending');
            }
          }}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        >
          {getStatusIcon()}
        </button>

        {/* Todo content */}
        <div className="flex-1 min-w-0">
          <div className={`font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>
            {todo.title}
          </div>
          {todo.description && (
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {todo.description}
            </div>
          )}
          {todo.estimatedPomodoros && (
            <div className="text-xs text-gray-500 mt-1">
              Est. {todo.estimatedPomodoros} pomodoro{todo.estimatedPomodoros !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: showActions ? 1 : 0, scale: showActions ? 1 : 0.8 }}
          className="flex items-center gap-1"
        >
          {onAddChild && (
            <button
              onClick={() => {
                playClick();
                onAddChild(todo.id);
              }}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="Add subtask"
            >
              <Plus size={14} className="text-gray-500" />
            </button>
          )}
          
          <button
            onClick={() => {
              if (todo.status === 'pending') {
                handleStatusChange('in-progress');
              } else if (todo.status === 'in-progress') {
                handleStatusChange('pending');
              }
            }}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            title={todo.status === 'in-progress' ? 'Mark as pending' : 'Start working'}
          >
            <Play size={14} className={todo.status === 'in-progress' ? 'text-blue-500' : 'text-gray-500'} />
          </button>

          <button
            onClick={handleDelete}
            className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
            title="Delete task"
          >
            <Trash2 size={14} className="text-red-500" />
          </button>
        </motion.div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-2 space-y-2"
        >
          {todo.children!.map((child) => (
            <TodoItem
              key={child.id}
              todo={child}
              treeId={treeId}
              depth={depth + 1}
              onAddChild={onAddChild}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};