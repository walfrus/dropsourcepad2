'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Search, X } from 'lucide-react';
import { findChords, CHORDS } from '@/lib/music';
import { Button } from './ui/button';

export function ChordFinder() {
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [foundChords, setFoundChords] = useState<Array<{ chord: string; confidence: number }>>([]);

  const allNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  const toggleNote = (note: string) => {
    setSelectedNotes(prev => {
      const newNotes = prev.includes(note)
        ? prev.filter(n => n !== note)
        : [...prev, note];
      
      // Find chords when notes change
      if (newNotes.length > 0) {
        const chords = findChords(newNotes);
        setFoundChords(chords);
      } else {
        setFoundChords([]);
      }
      
      return newNotes;
    });
  };

  const clearNotes = () => {
    setSelectedNotes([]);
    setFoundChords([]);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-ok';
    if (confidence >= 0.6) return 'text-warn';
    return 'text-bad';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold mb-2">Chord Finder</h3>
        <p className="text-sm text-muted">Select notes to find matching chords</p>
      </div>

      {/* Note Selection */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-muted">Select Notes</label>
          {selectedNotes.length > 0 && (
            <Button
              onClick={clearNotes}
              variant="ghost"
              size="sm"
              className="text-xs text-muted hover:text-white"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-6 gap-1">
          {allNotes.map((note) => (
            <Button
              key={note}
              onClick={() => toggleNote(note)}
              variant={selectedNotes.includes(note) ? 'default' : 'outline'}
              size="sm"
              className="text-xs h-8"
            >
              {note}
            </Button>
          ))}
        </div>
      </div>

      {/* Selected Notes Display */}
      {selectedNotes.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-muted mb-2">Selected Notes</label>
          <div className="flex flex-wrap gap-2">
            {selectedNotes.map((note) => (
              <motion.div
                key={note}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="bg-accent text-white px-2 py-1 rounded text-sm font-medium flex items-center space-x-1"
              >
                <span>{note}</span>
                <button
                  onClick={() => toggleNote(note)}
                  className="hover:bg-white/20 rounded-full w-4 h-4 flex items-center justify-center"
                >
                  <X className="h-2 w-2" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Found Chords */}
      <div className="flex-1 overflow-y-auto">
        {foundChords.length > 0 ? (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-muted mb-2">
              Found Chords ({foundChords.length})
            </label>
            {foundChords.map(({ chord, confidence }) => (
              <motion.div
                key={chord}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card border border-line rounded-lg p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-lg">{chord}</h4>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${getConfidenceColor(confidence)}`}>
                      {getConfidenceLabel(confidence)}
                    </span>
                    <span className="text-xs text-muted">
                      {Math.round(confidence * 100)}%
                    </span>
                  </div>
                </div>
                
                {/* Chord notes */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted">Notes:</span>
                  <div className="flex space-x-1">
                    {CHORDS[chord]?.map((note) => (
                      <span
                        key={note}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          selectedNotes.includes(note)
                            ? 'bg-accent text-white'
                            : 'bg-panel text-muted'
                        }`}
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : selectedNotes.length > 0 ? (
          <div className="text-center text-muted py-8">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No chords found</p>
            <p className="text-xs">Try adding or removing notes</p>
          </div>
        ) : (
          <div className="text-center text-muted py-8">
            <Music className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Select notes to find chords</p>
            <p className="text-xs">Click on the note buttons above</p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-4 text-center text-xs text-muted">
        <p>Click notes to select/deselect them</p>
        <p>Chords are ranked by confidence</p>
      </div>
    </div>
  );
}
