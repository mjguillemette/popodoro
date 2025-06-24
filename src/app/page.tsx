import { Timer } from '@/components/timer/Timer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Popodoro
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            A joyful, gamified Pomodoro timer
          </p>
        </header>
        
        <main className="flex items-center justify-center">
          <Timer />
        </main>
      </div>
    </div>
  );
}
