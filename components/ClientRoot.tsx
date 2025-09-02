'use client';
import { useEffect } from 'react';
import DevErrorBoundary from '@/components/DevErrorBoundary';

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  // Global error taps so prod shows real info
  useEffect(() => {
    const onError = (evt: ErrorEvent) => {
      // eslint-disable-next-line no-console
      console.error('💥 window.onerror', evt.message, evt.filename, evt.lineno, evt.colno, evt.error?.stack);
    };
    const onRejection = (evt: PromiseRejectionEvent) => {
      // eslint-disable-next-line no-console
      console.error('💥 unhandledrejection', evt.reason?.message || evt.reason, evt.reason?.stack || evt.reason);
    };
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);

  return <DevErrorBoundary>{children}</DevErrorBoundary>;
}
