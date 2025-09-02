// Naive syllable counting algorithm
// Counts vowel groups with edge cases for common patterns

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u', 'y']);
const DIPHTHONGS = new Set(['ai', 'ay', 'ea', 'ee', 'ei', 'ey', 'ie', 'oa', 'oe', 'oi', 'oo', 'ou', 'oy', 'ue', 'ui']);

export const countSyllables = (word: string): number => {
  if (!word) return 0;
  
  const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!cleanWord) return 0;
  
  let syllables = 0;
  let i = 0;
  
  while (i < cleanWord.length) {
    // Check for diphthongs first
    if (i < cleanWord.length - 1) {
      const twoChars = cleanWord.slice(i, i + 2);
      if (DIPHTHONGS.has(twoChars)) {
        syllables++;
        i += 2;
        continue;
      }
    }
    
    // Check for single vowels
    if (VOWELS.has(cleanWord[i])) {
      syllables++;
      i++;
      continue;
    }
    
    i++;
  }
  
  // Handle edge cases
  if (syllables === 0) {
    // If no vowels found, assume at least 1 syllable
    syllables = 1;
  }
  
  // Handle silent 'e' at end
  if (cleanWord.endsWith('e') && syllables > 1) {
    // Check if it's a silent e (not part of a vowel sound)
    const beforeE = cleanWord.slice(0, -1);
    if (!VOWELS.has(beforeE[beforeE.length - 1])) {
      syllables--;
    }
  }
  
  // Handle 'le' at end (usually adds a syllable)
  if (cleanWord.endsWith('le') && !VOWELS.has(cleanWord[cleanWord.length - 3])) {
    syllables++;
  }
  
  return Math.max(1, syllables);
};

export const countSyllablesInText = (text: string): number => {
  if (!text) return 0;
  
  const words = text.trim().split(/\s+/);
  return words.reduce((total, word) => total + countSyllables(word), 0);
};

export const countWords = (text: string): number => {
  if (!text) return 0;
  
  const words = text.trim().split(/\s+/);
  return words.filter(word => word.length > 0).length;
};

export const countCharacters = (text: string): number => {
  return text ? text.length : 0;
};
