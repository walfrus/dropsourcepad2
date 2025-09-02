'use client';

import { motion } from 'framer-motion';
import { 
  Timer as MetronomeIcon, 
  BookOpen, 
  Hash, 
  Sparkles, 
  Edit3,
  Settings,
  Menu
} from 'lucide-react';
import useAppStore from '@/lib/store';
import { Button } from './ui/button';

export function Toolbar() {
  const { ui, toggleUI } = useAppStore();

  const toggleTool = (tool: keyof typeof ui) => {
    toggleUI(tool);
  };

  return (
    <div className="bg-panel border-b border-line px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Tool toggles */}
        <div className="flex items-center space-x-2">
          {/* Metronome */}
          <Button
            onClick={() => toggleTool('showTools')}
            variant={ui.showTools ? "default" : "outline"}
            size="sm"
            className="text-xs"
            title="Toggle Tools Panel (Tuner, Chord Book, etc.)"
          >
            <MetronomeIcon className="h-3 w-3 mr-1" />
            Tools
          </Button>

          {/* Rhymebook */}
          <Button
            onClick={() => toggleTool('showRhymeBook')}
            variant={ui.showRhymeBook ? "default" : "outline"}
            size="sm"
            className="text-xs"
            title="Rhymebook"
          >
            <BookOpen className="h-3 w-3 mr-1" />
            Rhymes
          </Button>

          {/* Syllable Counter */}
          <Button
            onClick={() => toggleTool('showSyllableCounter')}
            variant={ui.showSyllableCounter ? "default" : "outline"}
            size="sm"
            className="text-xs"
            title="Syllable Counter"
          >
            <Hash className="h-3 w-3 mr-1" />
            Syllables
          </Button>

          {/* AI Assist */}
          <Button
            onClick={() => toggleTool('showAIAssist')}
            variant={ui.showAIAssist ? "default" : "outline"}
            size="sm"
            className="text-xs"
            title="AI Lyric Assist"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            AI Assist
          </Button>

          {/* Editor Overlay */}
          <Button
            onClick={() => toggleTool('showOverlay')}
            variant={ui.showOverlay ? "default" : "outline"}
            size="sm"
            className="text-xs"
            title="Toggle Editor Overlay (Highlight/Draw)"
          >
            <Edit3 className="h-3 w-3 mr-1" />
            Overlay
          </Button>
        </div>

        {/* Right side - Project drawer toggle */}
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => toggleTool('showDrawer')}
            variant={ui.showDrawer ? "default" : "outline"}
            size="sm"
            className="text-xs"
            title="Toggle Project Drawer (Cmd/Ctrl+B)"
          >
            <Menu className="h-3 w-3 mr-1" />
            Projects
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            title="Settings (Coming Soon)"
          >
            <Settings className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Keyboard shortcuts help */}
      <div className="mt-2 text-xs text-muted">
        <span className="mr-4">⌘N: New Project</span>
        <span className="mr-4">⌘S: Save</span>
        <span className="mr-4">⌘B: Toggle Projects</span>
        <span>Space: Focus BPM Tap</span>
      </div>
    </div>
  );
}
