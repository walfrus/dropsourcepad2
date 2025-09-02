'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { initializeStore } from '@/lib/store';

// Dynamically import WorkspaceShell to avoid SSR issues with IndexedDB
const WorkspaceShell = dynamic(() => import('@/components/WorkspaceShell'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
        <p className="text-muted">Loading Daily Song Sketchpad...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  const [isStoreInitialized, setIsStoreInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize the store when the component mounts
    const initStore = async () => {
      try {
        await initializeStore();
        setIsStoreInitialized(true);
      } catch (err) {
        console.error('Failed to initialize store:', err);
        setError('Failed to initialize application. Please refresh the page.');
      }
    };

    initStore();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-muted mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-2xl font-medium transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (!isStoreInitialized) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted">Initializing Daily Song Sketchpad...</p>
        </div>
      </div>
    );
  }

  return <WorkspaceShell />;
}