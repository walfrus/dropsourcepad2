'use client';

import { Project } from '@/lib/types';
import useAppStore from '@/lib/store';
import { BpmTap } from './BpmTap';
import { KeyPicker } from './KeyPicker';

interface ProjectHeaderProps {
  project: Project;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const { updateProject } = useAppStore();

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <h1 className="text-lg font-semibold">{project.title}</h1>
      <div className="flex items-center gap-2 text-sm">
        <span className="muted">BPM</span>
        <BpmTap 
          bpm={project.bpm}
          onBpmChange={(bpm) => updateProject(project.id, { bpm })}
        />
        <span className="muted">Key</span>
        <KeyPicker
          value={project.key}
          onChange={(key) => updateProject(project.id, { key })}
        />
        <span className="muted">Created {formatDate(project.createdAt)}</span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        {/* save/drawer buttons styled with .btn if present */}
      </div>
    </div>
  );
}
