'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectHeader } from './ProjectHeader';
import { LyricEditor } from './LyricEditor';
import { ToolsPanel } from './ToolsPanel';
import { ProjectDrawer } from './ProjectDrawer';
import { EditorOverlay } from './EditorOverlay';
import { SyllableCounter } from './SyllableCounter';
import { RhymeBook } from './RhymeBook';
import { AIAssist } from './AIAssist';
import useAppStore from '@/lib/store';

export default function WorkspaceShell() {

  
  // Use the store hook at the top level (this is the correct pattern)
  const { currentProjectId, projects, ui, createProject, toggleUI } = useAppStore();
  const currentProject = projects.find((p) => (p as { id: string }).id === currentProjectId);

  // Keyboard shortcuts - must be at top level before any early returns
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      if (modifier && e.key === 'n') {
        e.preventDefault();
        createProject();
      }

      if (modifier && e.key === 's') {
        e.preventDefault();
        // Show saved toast
        console.log('Saved');
      }

      if (modifier && e.key === 'b') {
        e.preventDefault();
        toggleUI('showDrawer');
      }

      if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        // Focus BPM tap button
        const bpmButton = document.querySelector('[data-bpm-tap]') as HTMLButtonElement;
        if (bpmButton) {
          bpmButton.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [createProject, toggleUI]);



  // If no projects are loaded yet, show loading
  if (projects.length === 0) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted">Loading workspace...</p>
        </div>
      </div>
    );
  }

  // If no current project is selected, show the create project UI
  if (!currentProject) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-accent mb-4">Daily Song Sketchpad</h1>
          <p className="text-muted mb-6">Create your first project to get started</p>
          <button
            onClick={() => createProject()}
            className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-2xl font-medium transition-colors"
          >
            Create Project
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <ProjectHeader project={currentProject} />
      <ToolsPanel />
      <LyricEditor project={currentProject} />

      {/* Drawer */}
      <AnimatePresence>
        {ui.showDrawer && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-80"
          >
            <ProjectDrawer isOpen={ui.showDrawer} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlays */}
      <EditorOverlay isOpen={ui.showOverlay} onClose={() => toggleUI('showOverlay')} />
      <SyllableCounter isOpen={ui.showSyllableCounter} onClose={() => toggleUI('showSyllableCounter')} />
      <RhymeBook isOpen={ui.showRhymeBook} onClose={() => toggleUI('showRhymeBook')} />
      <AIAssist isOpen={ui.showAIAssist} onClose={() => toggleUI('showAIAssist')} />
    </div>
  );
}
