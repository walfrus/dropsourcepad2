// Note frequency mapping (A4 = 440Hz)
export const NOTE_FREQUENCIES: Record<string, number> = {
  'C': 261.63, 'C#': 277.18, 'Db': 277.18,
  'D': 293.66, 'D#': 311.13, 'Eb': 311.13,
  'E': 329.63,
  'F': 349.23, 'F#': 369.99, 'Gb': 369.99,
  'G': 392.00, 'G#': 415.30, 'Ab': 415.30,
  'A': 440.00, 'A#': 466.16, 'Bb': 466.16,
  'B': 493.88
};

// Key list with relative minors
export const KEYS = [
  'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#',
  'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb',
  'Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'D#m',
  'Dm', 'Gm', 'Cm', 'Fm', 'Bbm', 'Ebm', 'Abm'
];

export const RELATIVE_MINORS: Record<string, string> = {
  'C': 'Am', 'G': 'Em', 'D': 'Bm', 'A': 'F#m',
  'E': 'C#m', 'B': 'G#m', 'F#': 'D#m', 'C#': 'A#m',
  'F': 'Dm', 'Bb': 'Gm', 'Eb': 'Cm', 'Ab': 'Fm',
  'Db': 'Bbm', 'Gb': 'Ebm', 'Cb': 'Abm'
};

// Common chord definitions
export const CHORDS: Record<string, string[]> = {
  // Major triads
  'C': ['C', 'E', 'G'],
  'G': ['G', 'B', 'D'],
  'D': ['D', 'F#', 'A'],
  'A': ['A', 'C#', 'E'],
  'E': ['E', 'G#', 'B'],
  'B': ['B', 'D#', 'F#'],
  'F#': ['F#', 'A#', 'C#'],
  'F': ['F', 'A', 'C'],
  'Bb': ['Bb', 'D', 'F'],
  'Eb': ['Eb', 'G', 'Bb'],
  'Ab': ['Ab', 'C', 'Eb'],
  'Db': ['Db', 'F', 'Ab'],
  'Gb': ['Gb', 'Bb', 'Db'],
  
  // Minor triads
  'Am': ['A', 'C', 'E'],
  'Em': ['E', 'G', 'B'],
  'Bm': ['B', 'D', 'F#'],
  'F#m': ['F#', 'A', 'C#'],
  'C#m': ['C#', 'E', 'G#'],
  'G#m': ['G#', 'B', 'D#'],
  'D#m': ['D#', 'F#', 'A#'],
  'Dm': ['D', 'F', 'A'],
  'Gm': ['G', 'Bb', 'D'],
  'Cm': ['C', 'Eb', 'G'],
  'Fm': ['F', 'Ab', 'C'],
  'Bbm': ['Bb', 'Db', 'F'],
  'Ebm': ['Eb', 'Gb', 'Bb'],
  'Abm': ['Ab', 'Cb', 'Eb'],
  
  // 7th chords
  'Cmaj7': ['C', 'E', 'G', 'B'],
  'G7': ['G', 'B', 'D', 'F'],
  'Dmaj7': ['D', 'F#', 'A', 'C#'],
  'Am7': ['A', 'C', 'E', 'G'],
  'Em7': ['E', 'G', 'B', 'D'],
  'Bm7': ['B', 'D', 'F#', 'A'],
  'F#m7': ['F#', 'A', 'C#', 'E'],
  'C#m7': ['C#', 'E', 'G#', 'B'],
};

// Guitar chord shapes (basic)
export const GUITAR_CHORDS: Record<string, number[]> = {
  'C': [0, 3, 2, 0, 1, 0],
  'G': [3, 2, 0, 0, 0, 3],
  'D': [2, 3, 2, 0, 0, 0],
  'A': [0, 0, 2, 2, 2, 0],
  'E': [0, 2, 2, 1, 0, 0],
  'Am': [0, 0, 2, 2, 1, 0],
  'Em': [0, 2, 2, 0, 0, 0],
  'Dm': [2, 3, 2, 0, 0, 0],
};

// Piano chord shapes
export const PIANO_CHORDS: Record<string, number[]> = {
  'C': [0, 4, 7],
  'G': [7, 11, 14],
  'D': [2, 6, 9],
  'A': [9, 13, 16],
  'E': [4, 8, 11],
  'B': [11, 15, 18],
  'F': [5, 9, 12],
  'Am': [9, 12, 16],
  'Em': [4, 7, 11],
  'Bm': [11, 14, 18],
};

// Convert note to frequency
export const noteToFrequency = (note: string, octave: number = 4): number => {
  const baseFreq = NOTE_FREQUENCIES[note];
  if (!baseFreq) return 0;
  
  const octaveDiff = octave - 4;
  return baseFreq * Math.pow(2, octaveDiff);
};

// Convert frequency to nearest note
export const frequencyToNote = (freq: number): { note: string; cents: number } => {
  if (freq <= 0) return { note: 'C', cents: 0 };
  
  const a4 = 440;
  const c0 = a4 * Math.pow(2, -4.75);
  const halfStepsBelowMiddleC = Math.round(12 * Math.log2(freq / c0));
  
  const octave = Math.floor(halfStepsBelowMiddleC / 12);
  const noteIndex = (halfStepsBelowMiddleC % 12 + 12) % 12;
  
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const note = noteNames[noteIndex];
  
  // Calculate cents deviation
  const exactHalfSteps = 12 * Math.log2(freq / c0);
  const cents = Math.round((exactHalfSteps - halfStepsBelowMiddleC) * 100);
  
  return { note, cents };
};

// Find chords that contain given notes
export const findChords = (notes: string[]): Array<{ chord: string; confidence: number }> => {
  const results: Array<{ chord: string; confidence: number }> = [];
  
  for (const [chordName, chordNotes] of Object.entries(CHORDS)) {
    let matches = 0;
    let totalNotes = chordNotes.length;
    
    for (const note of notes) {
      if (chordNotes.includes(note)) {
        matches++;
      }
    }
    
    if (matches > 0) {
      const confidence = matches / totalNotes;
      results.push({ chord: chordName, confidence });
    }
  }
  
  // Sort by confidence (highest first)
  return results.sort((a, b) => b.confidence - a.confidence);
};

// Get relative minor for a major key
export const getRelativeMinor = (majorKey: string): string | null => {
  return RELATIVE_MINORS[majorKey] || null;
};

// Get relative major for a minor key
export const getRelativeMajor = (minorKey: string): string | null => {
  for (const [major, minor] of Object.entries(RELATIVE_MINORS)) {
    if (minor === minorKey) return major;
  }
  return null;
};
