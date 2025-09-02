import { describe, it, expect } from 'vitest';
import { 
  noteToFrequency, 
  frequencyToNote, 
  findChords, 
  getRelativeMinor, 
  getRelativeMajor,
  CHORDS,
  KEYS
} from '@/lib/music';

describe('Music Theory', () => {
  describe('noteToFrequency', () => {
    it('should convert notes to correct frequencies', () => {
      expect(noteToFrequency('A', 4)).toBe(440);
      expect(noteToFrequency('C', 4)).toBeCloseTo(261.63, 1);
      expect(noteToFrequency('G', 4)).toBeCloseTo(392.00, 1);
    });

    it('should handle different octaves', () => {
      expect(noteToFrequency('A', 3)).toBe(220);
      expect(noteToFrequency('A', 5)).toBe(880);
    });

    it('should return 0 for invalid notes', () => {
      expect(noteToFrequency('X', 4)).toBe(0);
    });
  });

  describe('frequencyToNote', () => {
    it('should convert frequencies to correct notes', () => {
      const result = frequencyToNote(440);
      expect(result.note).toBe('A');
      expect(Math.abs(result.cents)).toBeLessThan(50);
    });

    it('should handle A4 = 440Hz', () => {
      const result = frequencyToNote(440);
      expect(result.note).toBe('A');
      expect(Math.abs(result.cents)).toBeLessThan(10);
    });

    it('should handle edge cases', () => {
      expect(frequencyToNote(0)).toEqual({ note: 'C', cents: 0 });
      expect(frequencyToNote(-100)).toEqual({ note: 'C', cents: 0 });
    });
  });

  describe('findChords', () => {
    it('should find chords containing given notes', () => {
      const result = findChords(['C', 'E', 'G']);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].chord).toBe('C');
      expect(result[0].confidence).toBe(1);
    });

    it('should find partial matches', () => {
      const result = findChords(['C', 'E']);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].confidence).toBeLessThan(1);
    });

    it('should return empty array for no matches', () => {
      const result = findChords(['X', 'Y', 'Z']);
      expect(result).toEqual([]);
    });

    it('should sort by confidence', () => {
      const result = findChords(['C', 'E', 'G', 'B']);
      expect(result[0].confidence).toBeGreaterThanOrEqual(result[1].confidence);
    });
  });

  describe('Relative Keys', () => {
    it('should find relative minors for major keys', () => {
      expect(getRelativeMinor('C')).toBe('Am');
      expect(getRelativeMinor('G')).toBe('Em');
      expect(getRelativeMinor('D')).toBe('Bm');
    });

    it('should find relative majors for minor keys', () => {
      expect(getRelativeMajor('Am')).toBe('C');
      expect(getRelativeMajor('Em')).toBe('G');
      expect(getRelativeMajor('Bm')).toBe('D');
    });

    it('should return null for keys without relatives', () => {
      expect(getRelativeMinor('X')).toBeNull();
      expect(getRelativeMajor('X')).toBeNull();
    });
  });

  describe('Chord Definitions', () => {
    it('should have valid chord definitions', () => {
      expect(CHORDS['C']).toEqual(['C', 'E', 'G']);
      expect(CHORDS['G']).toEqual(['G', 'B', 'D']);
      expect(CHORDS['Am']).toEqual(['A', 'C', 'E']);
    });

    it('should have consistent chord structures', () => {
      Object.values(CHORDS).forEach(chord => {
        expect(Array.isArray(chord)).toBe(true);
        expect(chord.length).toBeGreaterThan(0);
        chord.forEach(note => {
          expect(typeof note).toBe('string');
          expect(note.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('Key List', () => {
    it('should contain common keys', () => {
      expect(KEYS).toContain('C');
      expect(KEYS).toContain('G');
      expect(KEYS).toContain('Am');
      expect(KEYS).toContain('Em');
    });

    it('should have valid key format', () => {
      KEYS.forEach(key => {
        expect(typeof key).toBe('string');
        expect(key.length).toBeGreaterThan(0);
        // Should match common key patterns: C, F#, Bb, Am, F#m, etc.
        expect(/^[A-G][#b]?m?$/.test(key)).toBe(true);
      });
    });
  });
});
