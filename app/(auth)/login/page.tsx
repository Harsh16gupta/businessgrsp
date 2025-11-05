import { Suspense } from 'react';
import WorkerAuthContent from './WorkerAuthContent';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 transition-colors duration-300 mt-20 lg-mt-25">
      <div className="flex justify-center ">
        <Link href="/business-auth">
          <Button
            variant="outline"
            className="flex flex-col items-center bg-white dark:bg-gray-800 
                       text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 
                       hover:bg-gray-50 dark:hover:bg-gray-700 px-6 rounded-xl shadow-sm transition-all"
          >
            <span className="font-semibold text-sm">For Business Users</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Click here</span>
          </Button>
        </Link>
      </div>

      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-700 dark:text-gray-200">
                Loading authentication...
              </p>
            </div>
          </div>
        }
      >
        <WorkerAuthContent />
      </Suspense>
    </div>
  );
}