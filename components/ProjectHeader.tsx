'use client';

import { useState, useRef, useEffect } from 'react';

import { Calendar, Music, Edit3 } from 'lucide-react';
import { Project } from '@/lib/types';
import useAppStore from '@/lib/store';
import { BpmTap } from './BpmTap';
import { KeyPicker } from './KeyPicker';
import { Input } from './ui/input';

interface ProjectHeaderProps {
  project: Project;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const { updateProject } = useAppStore();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(project.title);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitle(project.title);
  }, [project.title]);

  const handleTitleSave = () => {
    if (title.trim() && title !== project.title) {
              updateProject(project.id, { title: title.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setTitle(project.title);
      setIsEditingTitle(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <header className="bg-panel border-b border-line px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Title and Project Info */}
        <div className="flex items-center space-x-6">
          {/* Project Title */}
          <div className="flex items-center space-x-3">
            <Music className="h-6 w-6 text-accent" />
            {isEditingTitle ? (
              <Input
                ref={titleInputRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={handleTitleKeyDown}
                className="h-8 w-64 text-lg font-semibold bg-transparent border-none p-0 focus:ring-0"
                autoFocus
              />
            ) : (
              <button
                onClick={() => setIsEditingTitle(true)}
                className="flex items-center space-x-2 text-lg font-semibold hover:text-accent transition-colors group"
              >
                <span>{project.title}</span>
                <Edit3 className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            )}
          </div>

          {/* BPM */}
          <div className="flex items-center space-x-3">
            <span className="text-sm text-muted">BPM</span>
            <BpmTap 
              bpm={project.bpm}
              onBpmChange={(bpm) => updateProject(project.id, { bpm })}
            />
          </div>

          {/* Key */}
          <div className="flex items-center space-x-3">
            <span className="text-sm text-muted">Key</span>
            <KeyPicker
              value={project.key}
              onChange={(key) => updateProject(project.id, { key })}
            />
          </div>
        </div>

        {/* Right side - Created Date */}
        <div className="flex items-center space-x-2 text-sm text-muted">
          <Calendar className="h-4 w-4" />
          <span>Created {formatDate(project.createdAt)}</span>
        </div>
      </div>
    </header>
  );
}
