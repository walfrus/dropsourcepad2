'use client';

import WorkspaceShell from '@/components/WorkspaceShell';
import { AudioNote } from '@/components/AudioNote';
import useAppStore from '@/lib/store';

export default function FullPage() {
  const hydrated = useAppStore(s => s._hasHydrated);
  const { currentProjectId, projects } = useAppStore();
  const currentProject = projects.find((p) => (p as { id: string }).id === currentProjectId);

  if (!hydrated) {
    return <div className="min-h-screen flex items-center justify-center muted">Loading workspace…</div>;
  }

  const CUT = process.env.NEXT_PUBLIC_CUT || '';

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
      {CUT !== 'ws' && (
        <section className="card flex-1 lg:flex-[2] p-4 lg:p-6 space-y-4">
          <WorkspaceShell />
        </section>
      )}
      {CUT !== 'audio' && (
        <aside className="card w-full lg:w-[360px] max-w-full p-4 lg:p-6 lg:sticky lg:top-6 h-fit">
          {currentProject ? (
            <AudioNote project={currentProject} />
          ) : (
            <p className="muted text-sm">Create or select a project to add audio notes.</p>
          )}
        </aside>
      )}
    </div>
  );
}
