// Simple rhyme dictionary based on word endings
// This is a basic implementation - in production you'd want a more sophisticated approach

export const RHYME_GROUPS: Record<string, string[]> = {
  // -ight endings
  'ight': ['light', 'bright', 'night', 'fight', 'right', 'sight', 'might', 'flight', 'tight', 'white'],
  
  // -ove endings
  'ove': ['love', 'above', 'dove', 'glove', 'shove', 'prove', 'move', 'groove', 'improve'],
  
  // -ain endings
  'ain': ['rain', 'pain', 'gain', 'main', 'chain', 'brain', 'stain', 'train', 'plain', 'vain'],
  
  // -ore endings
  'ore': ['more', 'before', 'door', 'floor', 'shore', 'store', 'core', 'explore', 'ignore'],
  
  // -ime endings
  'ime': ['time', 'rhyme', 'crime', 'prime', 'sublime', 'climb', 'lime', 'mime'],
  
  // -ing endings
  'ing': ['sing', 'ring', 'bring', 'thing', 'wing', 'king', 'sting', 'spring', 'cling'],
  
  // -est endings
  'est': ['best', 'rest', 'test', 'nest', 'guest', 'quest', 'west', 'chest', 'pest'],
  
  // -own endings
  'own': ['down', 'town', 'brown', 'crown', 'frown', 'gown', 'clown', 'drown'],
  
  // -ake endings
  'ake': ['make', 'take', 'break', 'shake', 'cake', 'lake', 'rake', 'snake', 'wake'],
  
  // -eep endings
  'eep': ['keep', 'sleep', 'deep', 'sheep', 'creep', 'weep', 'steep', 'cheap'],
  
  // -ay endings
  'ay': ['day', 'way', 'say', 'play', 'stay', 'may', 'pay', 'lay', 'gray', 'ray'],
  
  // -ee endings
  'ee': ['see', 'free', 'tree', 'three', 'me', 'be', 'key', 'sea', 'tea', 'bee'],
  
  // -ow endings
  'ow': ['now', 'how', 'cow', 'bow', 'row', 'show', 'flow', 'slow', 'grow', 'know'],
  
  // -all endings
  'all': ['all', 'call', 'fall', 'ball', 'wall', 'tall', 'small', 'hall', 'stall'],
  
  // -end endings
  'end': ['end', 'send', 'bend', 'friend', 'trend', 'spend', 'lend', 'mend'],
  
  // -ear endings
  'ear': ['ear', 'hear', 'fear', 'near', 'clear', 'dear', 'year', 'tear', 'gear'],
  
  // -ight endings (alternative)
  'ite': ['write', 'bite', 'kite', 'site', 'white', 'quite', 'spite', 'invite'],
  
  // -one endings
  'one': ['one', 'done', 'gone', 'none', 'stone', 'bone', 'alone', 'phone', 'tone'],
  
  // -ice endings
  'ice': ['nice', 'ice', 'rice', 'price', 'slice', 'spice', 'advice', 'device'],
  
  // -ace endings
  'ace': ['face', 'place', 'race', 'space', 'grace', 'trace', 'chase', 'pace'],
  
  // -ine endings
  'ine': ['line', 'fine', 'mine', 'nine', 'shine', 'wine', 'pine', 'define'],
  
  // -ate endings
  'ate': ['late', 'gate', 'fate', 'rate', 'hate', 'date', 'plate', 'create', 'state'],
};

// Find rhyming words for a given word
export const findRhymes = (word: string): string[] => {
  if (!word) return [];
  
  const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!cleanWord) return [];
  
  // Find the longest matching ending
  let bestMatch = '';
  let bestLength = 0;
  
  for (const ending of Object.keys(RHYME_GROUPS)) {
    if (cleanWord.endsWith(ending) && ending.length > bestLength) {
      bestMatch = ending;
      bestLength = ending.length;
    }
  }
  
  if (bestMatch && RHYME_GROUPS[bestMatch]) {
    // Return rhymes excluding the input word
    return RHYME_GROUPS[bestMatch].filter(rhyme => rhyme !== cleanWord);
  }
  
  return [];
};

// Get all available rhyme groups
export const getRhymeGroups = (): string[] => {
  return Object.keys(RHYME_GROUPS);
};

// Get words in a specific rhyme group
export const getRhymeGroup = (ending: string): string[] => {
  return RHYME_GROUPS[ending] || [];
};

// Check if two words rhyme
export const doWordsRhyme = (word1: string, word2: string): boolean => {
  const rhymes1 = findRhymes(word1);
  const rhymes2 = findRhymes(word2);
  
  // Check if they're in the same rhyme group
  return rhymes1.some(rhyme => rhyme === word2.toLowerCase()) ||
         rhymes2.some(rhyme => rhyme === word1.toLowerCase());
};
