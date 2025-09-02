'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Search, Music, Sparkles, Copy, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { getRhymeGroups } from '@/lib/rhyme';

interface RhymeBookProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RhymeResult {
  word: string;
  group: string;
  type: 'exact' | 'near' | 'assonance';
}

export function RhymeBook({ isOpen, onClose }: RhymeBookProps) {
  const [searchWord, setSearchWord] = useState('');
  const [rhymeResults, setRhymeResults] = useState<RhymeResult[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [copiedWord, setCopiedWord] = useState<string>('');
  const [rhymeGroups, setRhymeGroups] = useState<string[]>([]);

  useEffect(() => {
    setRhymeGroups(getRhymeGroups());
  }, []);

  useEffect(() => {
    if (searchWord.trim()) {
      searchRhymes(searchWord).then(data => {
        const results: RhymeResult[] = [];
        
        // Process perfect rhymes
        data.perfect?.forEach((word: string) => {
          results.push({ word, group: '', type: 'exact' });
        });
        
        // Process near rhymes
        data.near?.forEach((word: string) => {
          results.push({ word, group: '', type: 'near' });
        });
        
        // Process assonance
        data.assonance?.forEach((word: string) => {
          results.push({ word, group: '', type: 'assonance' });
        });
        
        setRhymeResults(results);
      });
    } else {
      setRhymeResults([]);
    }
  }, [searchWord]);

  async function searchRhymes(word: string) {
    const res = await fetch(`/api/rhyme?q=${encodeURIComponent(word)}`);
    if (!res.ok) return { perfect: [], near: [], assonance: [] };
    return res.json();
  }

  const copyToClipboard = async (word: string) => {
    try {
      await navigator.clipboard.writeText(word);
      setCopiedWord(word);
      setTimeout(() => setCopiedWord(''), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const getRhymeTypeColor = (type: string) => {
    switch (type) {
      case 'exact': return 'text-green-500 bg-green-500/10';
      case 'near': return 'text-yellow-500 bg-yellow-500/10';
      case 'assonance': return 'text-blue-500 bg-blue-500/10';
      default: return 'text-muted bg-muted';
    }
  };

  const getRhymeTypeLabel = (type: string) => {
    switch (type) {
      case 'exact': return 'Perfect';
      case 'near': return 'Near';
      case 'assonance': return 'Assonance';
      default: return 'Unknown';
    }
  };

  const filterByGroup = (group: string) => {
    setSelectedGroup(selectedGroup === group ? '' : group);
  };

  const filteredResults = selectedGroup 
    ? rhymeResults.filter(r => r.group === selectedGroup)
    : rhymeResults;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-panel border border-line rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/20 rounded-lg">
                  <BookOpen className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">Rhyme Book</h2>
                  <p className="text-sm text-muted">Find perfect rhymes and creative alternatives</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                ✕
              </Button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
                <Input
                  value={searchWord}
                  onChange={(e) => setSearchWord(e.target.value)}
                  placeholder="Enter a word to find rhymes..."
                  className="pl-10 pr-4 py-3 text-lg"
                />
              </div>
            </div>

            {/* Results */}
            {rhymeResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Group Filter */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedGroup === '' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => filterByGroup('')}
                  >
                    All Groups
                  </Button>
                  {rhymeGroups.slice(0, 10).map((group) => (
                    <Button
                      key={group}
                      variant={selectedGroup === group ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => filterByGroup(group)}
                    >
                      {group}
                    </Button>
                  ))}
                </div>

                {/* Rhyme Results */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredResults.map((result, index) => (
                    <motion.div
                      key={`${result.word}-${index}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-card p-4 rounded-lg border border-line hover:border-accent/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg">{result.word}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(result.word)}
                          className="h-6 w-6 p-0"
                        >
                          {copiedWord === result.word ? (
                            <Check className="w-3 h-3 text-green-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getRhymeTypeColor(result.type)}`}>
                          {getRhymeTypeLabel(result.type)}
                        </span>
                        <p className="text-xs text-muted">Group: {result.group}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Stats */}
                <div className="bg-card p-4 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-500">
                        {rhymeResults.filter(r => r.type === 'exact').length}
                      </div>
                      <div className="text-xs text-muted">Perfect Rhymes</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-500">
                        {rhymeResults.filter(r => r.type === 'near').length}
                      </div>
                      <div className="text-xs text-muted">Near Rhymes</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-500">
                        {rhymeResults.filter(r => r.type === 'assonance').length}
                      </div>
                      <div className="text-xs text-muted">Assonance</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Empty State */}
            {!rhymeResults.length && searchWord.trim() && (
              <div className="text-center py-12 text-muted">
                <Music className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No rhymes found</h3>
                <p className="text-sm">Try a different word or check the spelling</p>
              </div>
            )}

            {/* Welcome State */}
            {!searchWord.trim() && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-accent opacity-50" />
                <h3 className="text-lg font-medium mb-2">Start rhyming!</h3>
                <p className="text-sm text-muted mb-4">
                  Enter a word above to discover rhyming possibilities
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-md mx-auto">
                  {['love', 'heart', 'dream', 'light'].map((word) => (
                    <Button
                      key={word}
                      variant="outline"
                      size="sm"
                      onClick={() => setSearchWord(word)}
                      className="text-xs"
                    >
                      {word}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="mt-8 bg-accent/10 border border-accent/20 p-4 rounded-lg">
              <h4 className="font-semibold text-accent mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Rhyming Tips
              </h4>
              <ul className="text-sm space-y-1">
                <li>• Perfect rhymes have matching vowel and consonant sounds</li>
                <li>• Near rhymes share similar but not identical sounds</li>
                <li>• Assonance rhymes share only vowel sounds</li>
                <li>• Use different rhyme types to avoid predictability</li>
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
