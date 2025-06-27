export type TodoStatus = 'pending' | 'in-progress' | 'completed';

export type TodoPriority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  estimatedPomodoros?: number;
  actualPomodoros?: number;
  children?: Todo[]; // Nested todos
  parentId?: string;
  order: number; // For ordering within the same level
}

export interface TodoTree {
  id: string;
  title: string;
  description?: string;
  todos: Todo[];
  createdAt: Date;
  updatedAt: Date;
  color?: string;
}

export interface ViableTask {
  todo: Todo;
  path: string[]; // Array of parent titles leading to this task
  depth: number;
  treeId: string;
}

export interface TodoState {
  trees: TodoTree[];
  selectedTaskId?: string;
  currentViableTask?: ViableTask;
}

export interface TodoActions {
  // Tree management
  createTree: (title: string, description?: string, color?: string) => string;
  updateTree: (id: string, updates: Partial<Omit<TodoTree, 'id' | 'createdAt' | 'todos'>>) => void;
  deleteTree: (id: string) => void;
  
  // Todo management
  addTodo: (treeId: string, todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'order'>, parentId?: string) => string;
  updateTodo: (treeId: string, todoId: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void;
  deleteTodo: (treeId: string, todoId: string) => void;
  moveTodo: (treeId: string, todoId: string, newParentId?: string, newOrder?: number) => void;
  
  // Task selection
  selectRandomViableTask: () => ViableTask | null;
  markTaskInProgress: (treeId: string, todoId: string) => void;
  markTaskCompleted: (treeId: string, todoId: string) => void;
  
  // Utility
  getViableTasks: () => ViableTask[];
  getTodoById: (treeId: string, todoId: string) => Todo | null;
  getTodoPath: (treeId: string, todoId: string) => string[];
}