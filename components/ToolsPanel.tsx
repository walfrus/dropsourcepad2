'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Tuner } from './Tuner';
import { ChordBook } from './ChordBook';
import { ChordFinder } from './ChordFinder';

export function ToolsPanel() {
  const [activeTab, setActiveTab] = useState('tuner');

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-line">
        <h2 className="text-lg font-semibold">Tools</h2>
        <p className="text-sm text-muted">Musical tools and utilities</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
          <TabsTrigger value="tuner">Tuner</TabsTrigger>
          <TabsTrigger value="chords">Chords</TabsTrigger>
          <TabsTrigger value="finder">Finder</TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <div className="flex-1 p-4">
          <TabsContent value="tuner" className="h-full">
            <Tuner />
          </TabsContent>

          <TabsContent value="chords" className="h-full">
            <ChordBook />
          </TabsContent>

          <TabsContent value="finder" className="h-full">
            <ChordFinder />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
