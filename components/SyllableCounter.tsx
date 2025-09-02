'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hash, Info, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from './ui/button';
import { countSyllablesInText, countWords, countCharacters } from '@/lib/syllables';

interface SyllableCounterProps {
  isOpen: boolean;
  onClose: () => void;
  text?: string;
}

interface SyllableAnalysis {
  totalSyllables: number;
  totalWords: number;
  totalCharacters: number;
  averageSyllablesPerWord: number;
  syllablesPerLine: number[];
  wordBreakdown: { word: string; syllables: number }[];
}

export function SyllableCounter({ isOpen, onClose, text = '' }: SyllableCounterProps) {
  const [analysis, setAnalysis] = useState<SyllableAnalysis | null>(null);
  const [inputText, setInputText] = useState(text);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (inputText.trim()) {
      analyzeText(inputText);
    } else {
      setAnalysis(null);
    }
  }, [inputText]);

  const analyzeText = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    const words = text.split(/\s+/).filter(word => word.trim());
    
    const totalSyllables = countSyllablesInText(text);
    const totalWords = countWords(text);
    const totalCharacters = countCharacters(text);
    const averageSyllablesPerWord = totalWords > 0 ? totalSyllables / totalWords : 0;
    
    const syllablesPerLine = lines.map(line => countSyllablesInText(line));
    const wordBreakdown = words.map(word => ({
      word,
      syllables: countSyllablesInText(word)
    }));

    setAnalysis({
      totalSyllables,
      totalWords,
      totalCharacters,
      averageSyllablesPerWord,
      syllablesPerLine,
      wordBreakdown
    });
  };

  const getSyllableColor = (syllables: number) => {
    if (syllables <= 4) return 'text-green-500';
    if (syllables <= 6) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getLinePattern = (syllables: number[]) => {
    if (syllables.length < 2) return 'Single line';
    
    const pattern = syllables.map(s => s.toString()).join('-');
    const isConsistent = syllables.every(s => s === syllables[0]);
    
    return (
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm">{pattern}</span>
        {isConsistent && <span className="text-green-500 text-xs">✓ Consistent</span>}
      </div>
    );
  };

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
            className="bg-panel border border-line rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/20 rounded-lg">
                  <Hash className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">Syllable Counter</h2>
                  <p className="text-sm text-muted">Analyze syllable patterns in your lyrics</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                ✕
              </Button>
            </div>

            {/* Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Text to analyze</label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your lyrics here to analyze syllable patterns..."
                className="w-full h-32 p-3 bg-card border border-line rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* Analysis Results */}
            {analysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-card p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-accent">{analysis.totalSyllables}</div>
                    <div className="text-xs text-muted">Syllables</div>
                  </div>
                  <div className="bg-card p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-accent">{analysis.totalWords}</div>
                    <div className="text-xs text-muted">Words</div>
                  </div>
                  <div className="bg-card p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-accent">{analysis.totalCharacters}</div>
                    <div className="text-xs text-muted">Characters</div>
                  </div>
                  <div className="bg-card p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-accent">
                      {analysis.averageSyllablesPerWord.toFixed(1)}
                    </div>
                    <div className="text-xs text-muted">Avg/Word</div>
                  </div>
                </div>

                {/* Line Analysis */}
                <div className="bg-card p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Line-by-Line Analysis
                  </h3>
                  <div className="space-y-2">
                    {analysis.syllablesPerLine.map((syllables, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-muted">Line {index + 1}</span>
                        <span className={`font-mono ${getSyllableColor(syllables)}`}>
                          {syllables} syllables
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-line">
                    <span className="text-sm text-muted">Pattern: </span>
                    {getLinePattern(analysis.syllablesPerLine)}
                  </div>
                </div>

                {/* Advanced Analysis */}
                <div className="bg-card p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      Word Breakdown
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                    >
                      {showAdvanced ? 'Hide' : 'Show'} Details
                    </Button>
                  </div>
                  
                  <AnimatePresence>
                    {showAdvanced && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2"
                      >
                        {analysis.wordBreakdown.map((item, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="font-mono">{item.word}</span>
                            <span className={`${getSyllableColor(item.syllables)}`}>
                              {item.syllables}
                            </span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Tips */}
                <div className="bg-accent/10 border border-accent/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-accent mb-2">💡 Tips for Better Flow</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Aim for consistent syllable counts per line for better rhythm</li>
                    <li>• Use shorter words for faster, punchier lines</li>
                    <li>• Longer words create more dramatic, slower pacing</li>
                    <li>• Consider the natural stress patterns of your language</li>
                  </ul>
                </div>
              </motion.div>
            )}

            {/* Empty State */}
            {!analysis && inputText.trim() && (
              <div className="text-center py-8 text-muted">
                <Hash className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Enter some text to analyze syllable patterns</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
