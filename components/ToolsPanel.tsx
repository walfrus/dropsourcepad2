'use client';

import useAppStore from '@/lib/store';

export function ToolsPanel() {
  const { toggleUI } = useAppStore();

  return (
    <div className="flex flex-wrap gap-2">
      <button 
        className="px-3 py-2 rounded-full bg-[var(--bg-input)] border border-[var(--border)] text-sm" 
        onClick={() => toggleUI('showRhymeBook')} 
        aria-label="Open Rhymebook"
      >
        Rhymebook
      </button>
      <button 
        className="px-3 py-2 rounded-full bg-[var(--bg-input)] border border-[var(--border)] text-sm" 
        onClick={() => toggleUI('showSyllableCounter')} 
        aria-label="Open Syllable Counter"
      >
        Syllables
      </button>
      <button 
        className="px-3 py-2 rounded-full bg-[var(--bg-input)] border border-[var(--border)] text-sm" 
        onClick={() => toggleUI('showAIAssist')} 
        aria-label="Open AI Assist"
      >
        AI Assist
      </button>
      <button 
        className="px-3 py-2 rounded-full bg-[var(--bg-input)] border border-[var(--border)] text-sm" 
        onClick={() => toggleUI('showOverlay')} 
        aria-label="Open Editor Overlay"
      >
        Overlay
      </button>
    </div>
  );
}
