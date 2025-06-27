import { Timer } from '@/components/timer/Timer';
import { TodoList } from '@/components/todo/TodoList';

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <header className="text-center mb-16">
          <h1 className="text-2xl font-medium text-neutral-800 dark:text-neutral-200 mb-3 tracking-tight">
            Popodoro
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed max-w-md mx-auto">
            Focus sessions with thoughtful task integration
          </p>
        </header>
        
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Timer Section */}
          <div className="flex flex-col items-center">
            <Timer />
          </div>
          
          {/* Todo Section */}
          <div className="w-full">
            <TodoList />
          </div>
        </main>
      </div>
    </div>
  );
}
