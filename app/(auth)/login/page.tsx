import { Suspense } from 'react';
import WorkerAuthContent from './WorkerAuthContent';

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 p-4 transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-700 dark:text-gray-200 transition-colors duration-300">
            Loading authentication...
          </p>
        </div>
      </div>
    }>
      <WorkerAuthContent />
    </Suspense>
  );
}