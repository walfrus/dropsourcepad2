'use client';

import { useState } from 'react';

import { Guitar, Piano, Music } from 'lucide-react';
import { GUITAR_CHORDS, PIANO_CHORDS, CHORDS } from '@/lib/music';
import { Button } from './ui/button';

export function ChordBook() {
  const [selectedInstrument, setSelectedInstrument] = useState<'guitar' | 'piano'>('guitar');
  const [selectedChord, setSelectedChord] = useState<string>('C');

  const commonChords = Object.keys(CHORDS).slice(0, 12); // Show first 12 chords

  const renderGuitarChord = (chordName: string) => {
    const chord = GUITAR_CHORDS[chordName];
    if (!chord) return null;

    const strings = ['E', 'A', 'D', 'G', 'B', 'E'];
    const frets = 4;

    return (
      <div className="space-y-2">
        <h4 className="font-semibold text-center">{chordName}</h4>
        <div className="bg-card border border-line rounded-lg p-3">
          {/* Fret numbers */}
          <div className="flex justify-end mb-1">
            {Array.from({ length: frets + 1 }, (_, i) => (
              <span key={i} className="w-6 text-center text-xs text-muted">
                {i}
              </span>
            ))}
          </div>
          
          {/* Strings and frets */}
          {strings.map((string, stringIndex) => (
            <div key={stringIndex} className="flex items-center">
              {/* String name */}
              <span className="w-4 text-xs text-muted mr-2">{string}</span>
              
              {/* Fret positions */}
              {Array.from({ length: frets + 1 }, (_, fretIndex) => {
                const fingerPosition = chord[stringIndex];
                const isOpen = fingerPosition === 0;
                const isFretted = fingerPosition > 0;
                
                return (
                  <div
                    key={fretIndex}
                    className="w-6 h-6 border-r border-line last:border-r-0 flex items-center justify-center relative"
                  >
                    {isOpen && (
                      <span className="text-xs text-accent">○</span>
                    )}
                    {isFretted && fretIndex === fingerPosition && (
                      <div className="w-4 h-4 bg-accent rounded-full flex items-center justify-center text-xs text-white font-bold">
                        {fingerPosition}
                      </div>
                    )}
                    {isFretted && fretIndex === 0 && fingerPosition > 0 && (
                      <span className="text-xs text-muted">×</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPianoChord = (chordName: string) => {
    const chord = PIANO_CHORDS[chordName];
    if (!chord) return null;

    const notes = CHORDS[chordName];
    if (!notes) return null;

    return (
      <div className="space-y-2">
        <h4 className="font-semibold text-center">{chordName}</h4>
        <div className="bg-card border border-line rounded-lg p-3">
          <div className="flex justify-center space-x-1">
            {notes.map((note, index) => (
              <div
                key={index}
                className="w-8 h-16 bg-white border border-line rounded-b-sm flex items-end justify-center pb-1 text-black text-xs font-medium"
              >
                {note}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold mb-2">Chord Book</h3>
        <p className="text-sm text-muted">Common chord shapes and voicings</p>
      </div>

      {/* Instrument Toggle */}
      <div className="flex justify-center mb-4">
        <div className="bg-panel border border-line rounded-lg p-1">
          <Button
            onClick={() => setSelectedInstrument('guitar')}
            variant={selectedInstrument === 'guitar' ? 'default' : 'ghost'}
            size="sm"
            className="text-xs"
          >
            <Guitar className="h-3 w-3 mr-1" />
            Guitar
          </Button>
          <Button
            onClick={() => setSelectedInstrument('piano')}
            variant={selectedInstrument === 'piano' ? 'default' : 'ghost'}
            size="sm"
            className="text-xs"
          >
            <Piano className="h-3 w-3 mr-1" />
            Piano
          </Button>
        </div>
      </div>

      {/* Chord Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-muted mb-2">Select Chord</label>
        <div className="grid grid-cols-4 gap-1">
          {commonChords.map((chord) => (
            <Button
              key={chord}
              onClick={() => setSelectedChord(chord)}
              variant={selectedChord === chord ? 'default' : 'outline'}
              size="sm"
              className="text-xs"
            >
              {chord}
            </Button>
          ))}
        </div>
      </div>

      {/* Chord Display */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4">
          {selectedInstrument === 'guitar' ? (
            renderGuitarChord(selectedChord)
          ) : (
            renderPianoChord(selectedChord)
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 text-center text-xs text-muted">
        <Music className="h-4 w-4 mx-auto mb-1 opacity-50" />
        <p>Click on chord names to see different shapes</p>
      </div>
    </div>
  );
}
