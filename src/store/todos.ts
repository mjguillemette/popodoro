import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TodoState, TodoActions, Todo, TodoTree, ViableTask } from '@/types/todo';

// Utility functions
const generateId = () => Math.random().toString(36).substr(2, 9);

const findTodoInTree = (todos: Todo[], todoId: string): Todo | null => {
  for (const todo of todos) {
    if (todo.id === todoId) {
      return todo;
    }
    if (todo.children) {
      const found = findTodoInTree(todo.children, todoId);
      if (found) return found;
    }
  }
  return null;
};

const deleteTodoFromTree = (todos: Todo[], todoId: string): Todo[] => {
  return todos
    .filter(todo => todo.id !== todoId)
    .map(todo => ({
      ...todo,
      children: todo.children ? deleteTodoFromTree(todo.children, todoId) : undefined
    }));
};

const updateTodoInTree = (todos: Todo[], todoId: string, updates: Partial<Todo>): Todo[] => {
  return todos.map(todo => {
    if (todo.id === todoId) {
      return { ...todo, ...updates, updatedAt: new Date() };
    }
    if (todo.children) {
      return {
        ...todo,
        children: updateTodoInTree(todo.children, todoId, updates)
      };
    }
    return todo;
  });
};

const addTodoToTree = (todos: Todo[], newTodo: Todo, parentId?: string): Todo[] => {
  if (!parentId) {
    // Add to root level
    return [...todos, newTodo];
  }

  return todos.map(todo => {
    if (todo.id === parentId) {
      return {
        ...todo,
        children: [...(todo.children || []), newTodo]
      };
    }
    if (todo.children) {
      return {
        ...todo,
        children: addTodoToTree(todo.children, newTodo, parentId)
      };
    }
    return todo;
  });
};

const getViableTasksFromTodos = (todos: Todo[], path: string[] = [], treeId: string): ViableTask[] => {
  const viableTasks: ViableTask[] = [];
  console.log(`Checking todos at path [${path.join(' > ')}]:`, todos.map(t => ({ title: t.title, status: t.status, hasChildren: !!(t.children && t.children.length > 0) })));

  for (const todo of todos) {
    const currentPath = [...path, todo.title];
    console.log(`Checking todo: "${todo.title}" (status: ${todo.status})`);
    
    if (todo.status === 'pending') {
      console.log(`  "${todo.title}" is pending`);
      if (!todo.children || todo.children.length === 0) {
        // Leaf node - this is viable
        console.log(`  "${todo.title}" is a leaf node - VIABLE`);
        viableTasks.push({
          todo,
          path: currentPath,
          depth: currentPath.length,
          treeId
        });
      } else {
        // Has children - check if any children are pending
        console.log(`  "${todo.title}" has ${todo.children.length} children`);
        const pendingChildren = todo.children.filter(child => child.status === 'pending');
        console.log(`  "${todo.title}" has ${pendingChildren.length} pending children`);
        
        if (pendingChildren.length === 0) {
          // No pending children, this parent task is viable
          console.log(`  "${todo.title}" has no pending children - VIABLE`);
          viableTasks.push({
            todo,
            path: currentPath,
            depth: currentPath.length,
            treeId
          });
        } else {
          // Has pending children, recurse deeper
          console.log(`  "${todo.title}" has pending children - recursing deeper`);
          viableTasks.push(...getViableTasksFromTodos(todo.children, currentPath, treeId));
        }
      }
    } else {
      console.log(`  "${todo.title}" is not pending (status: ${todo.status}) - skipping`);
    }
  }

  console.log(`Found ${viableTasks.length} viable tasks at path [${path.join(' > ')}]`);
  return viableTasks;
};

const selectViableTask = (viableTasks: ViableTask[]): ViableTask | null => {
  if (viableTasks.length === 0) {
    console.log('No viable tasks found');
    return null;
  }

  console.log('All viable tasks:', viableTasks.map(t => ({ title: t.todo.title, depth: t.depth, treeId: t.treeId })));

  // Group by tree
  const tasksByTree = viableTasks.reduce((acc, task) => {
    if (!acc[task.treeId]) acc[task.treeId] = [];
    acc[task.treeId].push(task);
    return acc;
  }, {} as Record<string, ViableTask[]>);

  // Randomly select a tree
  const treeIds = Object.keys(tasksByTree);
  const randomTreeId = treeIds[Math.floor(Math.random() * treeIds.length)];
  const treeTasks = tasksByTree[randomTreeId];

  console.log('Selected tree:', randomTreeId, 'Tasks in tree:', treeTasks.map(t => ({ title: t.todo.title, depth: t.depth })));

  // Find the maximum depth in this tree
  const maxDepth = Math.max(...treeTasks.map(task => task.depth));
  console.log('Max depth in selected tree:', maxDepth);
  
  // Get all tasks at maximum depth
  const deepestTasks = treeTasks.filter(task => task.depth === maxDepth);
  console.log('Deepest tasks:', deepestTasks.map(t => ({ title: t.todo.title, order: t.todo.order })));
  
  // Sort by order to ensure we get the "first" one consistently
  deepestTasks.sort((a, b) => a.todo.order - b.todo.order);
  
  const selectedTask = deepestTasks[0];
  console.log('Selected task:', selectedTask?.todo.title);
  
  return selectedTask;
};

const getTodoPath = (todos: Todo[], todoId: string, currentPath: string[] = []): string[] => {
  for (const todo of todos) {
    const newPath = [...currentPath, todo.title];
    
    if (todo.id === todoId) {
      return newPath;
    }
    
    if (todo.children) {
      const found = getTodoPath(todo.children, todoId, newPath);
      if (found.length > 0) return found;
    }
  }
  return [];
};

interface TodoStore extends TodoState, TodoActions {}

export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      // Initial state
      trees: [],
      selectedTaskId: undefined,
      currentViableTask: undefined,

      // Tree management
      createTree: (title: string, description?: string, color?: string) => {
        const id = generateId();
        const now = new Date();
        const newTree: TodoTree = {
          id,
          title,
          description,
          todos: [],
          createdAt: now,
          updatedAt: now,
          color
        };
        
        set(state => ({
          trees: [...state.trees, newTree]
        }));
        
        return id;
      },

      updateTree: (id: string, updates) => {
        set(state => ({
          trees: state.trees.map(tree =>
            tree.id === id 
              ? { ...tree, ...updates, updatedAt: new Date() }
              : tree
          )
        }));
      },

      deleteTree: (id: string) => {
        set(state => ({
          trees: state.trees.filter(tree => tree.id !== id),
          currentViableTask: state.currentViableTask?.treeId === id 
            ? undefined 
            : state.currentViableTask
        }));
      },

      // Todo management
      addTodo: (treeId: string, todoData, parentId?) => {
        const id = generateId();
        const now = new Date();
        
        // Calculate the order based on existing siblings
        const state = get();
        const tree = state.trees.find(t => t.id === treeId);
        let order = 0;
        
        if (tree) {
          if (!parentId) {
            // Adding to root level
            order = tree.todos.length;
          } else {
            // Adding to a parent - find the parent and count its children
            const parent = findTodoInTree(tree.todos, parentId);
            if (parent && parent.children) {
              order = parent.children.length;
            }
          }
        }
        
        const newTodo: Todo = {
          ...todoData,
          id,
          createdAt: now,
          updatedAt: now,
          parentId,
          order
        };

        set(state => ({
          trees: state.trees.map(tree => {
            if (tree.id === treeId) {
              const updatedTodos = addTodoToTree(tree.todos, newTodo, parentId);
              return {
                ...tree,
                todos: updatedTodos,
                updatedAt: now
              };
            }
            return tree;
          })
        }));

        return id;
      },

      updateTodo: (treeId: string, todoId: string, updates) => {
        set(state => ({
          trees: state.trees.map(tree => {
            if (tree.id === treeId) {
              return {
                ...tree,
                todos: updateTodoInTree(tree.todos, todoId, updates),
                updatedAt: new Date()
              };
            }
            return tree;
          })
        }));
      },

      deleteTodo: (treeId: string, todoId: string) => {
        set(state => ({
          trees: state.trees.map(tree => {
            if (tree.id === treeId) {
              return {
                ...tree,
                todos: deleteTodoFromTree(tree.todos, todoId),
                updatedAt: new Date()
              };
            }
            return tree;
          })
        }));
      },

      moveTodo: (treeId: string, todoId: string, newParentId?: string, newOrder?: number) => {
        // TODO: Implement drag-and-drop reordering logic
        console.log('Move todo not yet implemented', { treeId, todoId, newParentId, newOrder });
      },

      // Task selection
      selectRandomViableTask: () => {
        console.log('selectRandomViableTask called');
        const state = get();
        const viableTasks = state.getViableTasks();
        console.log('Total viable tasks found:', viableTasks.length);
        const selectedTask = selectViableTask(viableTasks);
        
        set({ currentViableTask: selectedTask || undefined });
        return selectedTask;
      },

      markTaskInProgress: (treeId: string, todoId: string) => {
        const actions = get();
        actions.updateTodo(treeId, todoId, { status: 'in-progress' });
      },

      markTaskCompleted: (treeId: string, todoId: string) => {
        const actions = get();
        actions.updateTodo(treeId, todoId, { 
          status: 'completed',
          completedAt: new Date()
        });
      },

      // Utility
      getViableTasks: () => {
        const state = get();
        console.log('Getting viable tasks from', state.trees.length, 'trees');
        const allViableTasks: ViableTask[] = [];
        
        for (const tree of state.trees) {
          console.log(`\n--- Checking tree: "${tree.title}" ---`);
          console.log('Tree todos:', tree.todos.map(t => ({ title: t.title, status: t.status })));
          const treeTasks = getViableTasksFromTodos(tree.todos, [], tree.id);
          console.log(`Tree "${tree.title}" contributed ${treeTasks.length} viable tasks`);
          allViableTasks.push(...treeTasks);
        }
        
        console.log(`\n=== TOTAL VIABLE TASKS: ${allViableTasks.length} ===`);
        return allViableTasks;
      },

      getTodoById: (treeId: string, todoId: string) => {
        const state = get();
        const tree = state.trees.find(t => t.id === treeId);
        if (!tree) return null;
        
        return findTodoInTree(tree.todos, todoId);
      },

      getTodoPath: (treeId: string, todoId: string) => {
        const state = get();
        const tree = state.trees.find(t => t.id === treeId);
        if (!tree) return [];
        
        return getTodoPath(tree.todos, todoId);
      }
    }),
    {
      name: 'popodoro-todos',
    }
  )
);