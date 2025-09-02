'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Hash, Music } from 'lucide-react';
import { Project, SectionName } from '@/lib/types';
import useAppStore from '@/lib/store';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { countWords, countSyllables, countCharacters } from '@/lib/syllables';
import { Debouncer } from '@/lib/persist';

interface LyricEditorProps {
  project: Project;
}

export function LyricEditor({ project }: LyricEditorProps) {
  const { updateSection } = useAppStore();
  const [activeTab, setActiveTab] = useState<SectionName>('verse');
  const [viewAll, setViewAll] = useState(false);
  const [sectionTexts, setSectionTexts] = useState<Record<string, string>>({});
  const debouncers = useState(() => new Map<string, Debouncer<string>>())[0];

  // Initialize section texts from project
  useEffect(() => {
    const texts: Record<string, string> = {};
    project.sections.forEach(section => {
      texts[section.id] = section.text;
    });
    setSectionTexts(texts);
  }, [project.sections]);

  // Get or create debouncer for a section
  const getDebouncer = (sectionId: string) => {
    if (!debouncers.has(sectionId)) {
      debouncers.set(sectionId, new Debouncer<string>(400));
    }
    return debouncers.get(sectionId)!;
  };

  const handleTextChange = (sectionId: string, text: string) => {
    setSectionTexts(prev => ({ ...prev, [sectionId]: text }));
    
    // Debounce the save operation
    const debouncer = getDebouncer(sectionId);
    debouncer.debounce((value) => {
              updateSection(project.id, sectionId, value);
    }, text);
  };



  const getSectionStats = (text: string) => {
    const words = countWords(text);
    const syllables = countSyllables(text);
    const characters = countCharacters(text);
    
    return { words, syllables, characters };
  };

  const formatSectionName = (name: SectionName) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const getSectionIcon = (name: SectionName) => {
    switch (name) {
      case 'verse':
        return <FileText className="h-4 w-4" />;
      case 'chorus':
        return <Music className="h-4 w-4" />;
      case 'bridge':
        return <Hash className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Lyrics</h2>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg overflow-hidden border border-[var(--border)]">
            {['Verse','Chorus','Bridge'].map(t => (
              <button key={t}
                className={`px-3 py-2 text-sm ${activeTab===t ? 'bg-[var(--bg-input)]' : 'bg-transparent'} hover:bg-[var(--bg-input)]`}
                onClick={() => setActiveTab(t as any)}
              >{t}</button>
            ))}
          </div>
          <button className="px-3 py-2 text-sm rounded-full bg-[var(--bg-input)] border border-[var(--border)]"
            onClick={() => setViewAll(v => !v)}>
            {viewAll ? 'View: Active' : 'View: All'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as SectionName)} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          {project.sections.map((section) => (
            <TabsTrigger
              key={section.id}
              value={section.name}
              className="flex items-center space-x-2"
            >
              {getSectionIcon(section.name)}
              <span>{formatSectionName(section.name)}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tab Content */}
        {(viewAll ? project.sections : project.sections.filter(s => s.name === activeTab))
          .map((section) => {
          const text = sectionTexts[section.id] || '';
          const stats = getSectionStats(text);
          
          return (
            <TabsContent
              key={section.id}
              value={section.name}
              className="flex-1 flex flex-col"
            >
              <div className="flex-1 flex flex-col">
                {/* Text Editor */}
                <div className="flex-1 mb-4">
                  <Textarea
                    value={text}
                    onChange={(e) => handleTextChange(section.id, e.target.value)}
                    placeholder={`Write your ${section.name} lyrics here...`}
                    className="h-full resize-none text-base leading-relaxed min-h-[320px]"
                  />
                </div>

                {/* Stats Bar */}
                <div className="flex items-center justify-between text-sm text-muted bg-card rounded-lg px-4 py-2 border border-line">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <FileText className="h-3 w-3" />
                      <span>{stats.words} words</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Music className="h-3 w-3" />
                      <span>{stats.syllables} syllables</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Hash className="h-3 w-3" />
                      <span>{stats.characters} characters</span>
                    </span>
                  </div>
                  
                  {/* Auto-save indicator */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-ok"
                  >
                    Auto-saved
                  </motion.div>
                </div>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}