import { describe, it, expect } from 'vitest';
import { countSyllables, countSyllablesInText, countWords, countCharacters } from '@/lib/syllables';

describe('Syllable Counting', () => {
  describe('countSyllables', () => {
    it('should count syllables in simple words', () => {
      expect(countSyllables('cat')).toBe(1);
      expect(countSyllables('dog')).toBe(1);
      expect(countSyllables('bird')).toBe(1);
    });

    it('should count syllables in words with multiple vowels', () => {
      expect(countSyllables('hello')).toBe(2);
      expect(countSyllables('world')).toBe(1);
      expect(countSyllables('music')).toBe(2);
    });

    it('should handle diphthongs correctly', () => {
      expect(countSyllables('rain')).toBe(1);
      expect(countSyllables('boat')).toBe(1);
      expect(countSyllables('coin')).toBe(1);
    });

    it('should handle silent e at end', () => {
      expect(countSyllables('make')).toBe(1);
      expect(countSyllables('like')).toBe(1);
      expect(countSyllables('hope')).toBe(1);
    });

    it('should handle le at end', () => {
      expect(countSyllables('table')).toBe(2);
      expect(countSyllables('little')).toBe(2);
      expect(countSyllables('simple')).toBe(2);
    });

    it('should handle edge cases', () => {
      expect(countSyllables('')).toBe(0);
      expect(countSyllables('rhythm')).toBe(1); // Basic algorithm counts as 1
      expect(countSyllables('strength')).toBe(1);
    });
  });

  describe('countSyllablesInText', () => {
    it('should count syllables in text with multiple words', () => {
      expect(countSyllablesInText('hello world')).toBe(3);
      expect(countSyllablesInText('the quick brown fox')).toBe(4);
      expect(countSyllablesInText('music is life')).toBe(4);
    });

    it('should handle empty text', () => {
      expect(countSyllablesInText('')).toBe(0);
      expect(countSyllablesInText('   ')).toBe(0);
    });
  });

  describe('countWords', () => {
    it('should count words in text', () => {
      expect(countWords('hello world')).toBe(2);
      expect(countWords('the quick brown fox')).toBe(4);
      expect(countWords('music is life')).toBe(3);
    });

    it('should handle empty text', () => {
      expect(countWords('')).toBe(0);
      expect(countWords('   ')).toBe(0);
    });

    it('should handle text with extra spaces', () => {
      expect(countWords('  hello   world  ')).toBe(2);
    });
  });

  describe('countCharacters', () => {
    it('should count characters in text', () => {
      expect(countCharacters('hello')).toBe(5);
      expect(countCharacters('hello world')).toBe(11);
      expect(countCharacters('')).toBe(0);
    });

    it('should handle whitespace', () => {
      expect(countCharacters(' ')).toBe(1);
      expect(countCharacters('  hello  ')).toBe(9);
    });
  });
});
