import { useCallback } from 'react';
import { useTodoStore } from '@/store/todos';
import { useAudio } from '@/hooks/useAudio';

export const useTodos = () => {
  const store = useTodoStore();
  const { playSuccess, playAchievement } = useAudio();

  const selectRandomTask = useCallback(() => {
    const task = store.selectRandomViableTask();
    if (task) {
      playSuccess();
      return task;
    }
    return null;
  }, [store, playSuccess]);

  const completeTask = useCallback((treeId: string, todoId: string) => {
    store.markTaskCompleted(treeId, todoId);
    playAchievement();
    
    // Auto-select next task after completing one
    setTimeout(() => {
      selectRandomTask();
    }, 1000);
  }, [store, playAchievement, selectRandomTask]);

  const startTask = useCallback((treeId: string, todoId: string) => {
    store.markTaskInProgress(treeId, todoId);
  }, [store]);

  return {
    ...store,
    selectRandomTask,
    completeTask,
    startTask,
  };
};