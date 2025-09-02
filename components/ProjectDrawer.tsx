'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Trash2, 

  Calendar,
  Music,

} from 'lucide-react';
import { Project } from '@/lib/types';
import useAppStore from '@/lib/store';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface ProjectDrawerProps {
  isOpen?: boolean;
}

export function ProjectDrawer({ isOpen = true }: ProjectDrawerProps) {
  const { projects, currentProjectId, createProject, setCurrentProject, deleteProject } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');

  const filteredProjects = projects.filter((project: Project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProject = () => {
    if (newProjectTitle.trim()) {
              createProject(newProjectTitle.trim());
      setNewProjectTitle('');
      setIsCreating(false);
    }
  };

  const handleDeleteProject = (projectId: string) => {
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
              deleteProject(projectId);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="h-full flex flex-col bg-panel border-r border-line">
      {/* Header */}
      <div className="p-4 border-b border-line">
        <h2 className="text-lg font-semibold">Projects</h2>
        <p className="text-sm text-muted">Manage your song sketches</p>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-line">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Create New Project */}
      <div className="p-4 border-b border-line">
        {isCreating ? (
          <div className="space-y-2">
            <Input
              placeholder="Project title..."
              value={newProjectTitle}
              onChange={(e) => setNewProjectTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateProject();
                if (e.key === 'Escape') setIsCreating(false);
              }}
              autoFocus
            />
            <div className="flex space-x-2">
              <Button
                onClick={handleCreateProject}
                size="sm"
                className="text-xs"
                disabled={!newProjectTitle.trim()}
              >
                Create
              </Button>
              <Button
                onClick={() => setIsCreating(false)}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setIsCreating(true)}
            size="sm"
            className="w-full text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            New Project
          </Button>
        )}
      </div>

      {/* Project List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredProjects.length === 0 ? (
          <div className="text-center text-muted py-8">
            {searchTerm ? (
              <>
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No projects found</p>
                <p className="text-xs">Try a different search term</p>
              </>
            ) : (
              <>
                <Music className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No projects yet</p>
                <p className="text-xs">Create your first project to get started</p>
              </>
            )}
          </div>
        ) : (
          filteredProjects.map((project: Project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`relative p-3 rounded-lg border cursor-pointer transition-all hover:bg-card ${
                currentProjectId === project.id
                  ? 'bg-accent/10 border-accent'
                  : 'bg-panel border-line hover:border-accent/50'
              }`}
              onClick={() => setCurrentProject(project.id)}
            >
              {/* Project Info */}
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{project.title}</h3>
                  <div className="flex items-center space-x-2 mt-1 text-xs text-muted">
                    <span>{project.bpm} BPM</span>
                    <span>•</span>
                    <span>{project.key}</span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(project.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-1 ml-2">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project.id);
                    }}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-muted hover:text-bad opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete project"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Current indicator */}
              {currentProjectId === project.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full"
                />
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-line text-xs text-muted">
        <div className="flex items-center justify-between">
          <span>{filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}</span>
          <span>⌘B to toggle</span>
        </div>
      </div>
    </div>
  );
}
