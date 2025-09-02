'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Copy, Check, RefreshCw, Lightbulb, Music, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';

interface AIAssistProps {
  isOpen: boolean;
  onClose: () => void;
  context?: string;
}

interface Suggestion {
  id: string;
  text: string;
  type: 'lyric' | 'melody' | 'theme' | 'rhythm';
  confidence: number;
}

interface MoodOption {
  value: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const moodOptions: MoodOption[] = [
  { value: 'romantic', label: 'Romantic', icon: <Heart className="w-4 h-4" />, description: 'Love, passion, intimacy' },
  { value: 'energetic', label: 'Energetic', icon: <Music className="w-4 h-4" />, description: 'Upbeat, powerful, dynamic' },
  { value: 'melancholic', label: 'Melancholic', icon: <Lightbulb className="w-4 h-4" />, description: 'Sad, reflective, deep' },
  { value: 'uplifting', label: 'Uplifting', icon: <Sparkles className="w-4 h-4" />, description: 'Inspiring, hopeful, positive' },
];

export function AIAssist({ isOpen, onClose, context = '' }: AIAssistProps) {
  const [inputText, setInputText] = useState(context);
  const [selectedMood, setSelectedMood] = useState('romantic');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedSuggestion, setCopiedSuggestion] = useState<string>('');

  const generateSuggestions = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          mood: selectedMood,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions || []);
      } else {
        // Fallback to mock suggestions for demo
        generateMockSuggestions();
      }
    } catch (error) {
      console.error('Failed to get AI suggestions:', error);
      generateMockSuggestions();
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockSuggestions = () => {
    const mockSuggestions: Suggestion[] = [
      {
        id: '1',
        text: 'In the moonlight, your eyes shine so bright, like stars in the night',
        type: 'lyric',
        confidence: 0.95,
      },
      {
        id: '2',
        text: 'Try a 4/4 time signature with emphasis on beats 1 and 3',
        type: 'rhythm',
        confidence: 0.88,
      },
      {
        id: '3',
        text: 'Consider using a minor key progression: Am - F - C - G',
        type: 'melody',
        confidence: 0.82,
      },
      {
        id: '4',
        text: 'Explore themes of longing and distance, common in romantic ballads',
        type: 'theme',
        confidence: 0.78,
      },
    ];
    setSuggestions(mockSuggestions);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSuggestion(text);
      setTimeout(() => setCopiedSuggestion(''), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lyric': return <Music className="w-4 h-4" />;
      case 'melody': return <Sparkles className="w-4 h-4" />;
      case 'theme': return <Lightbulb className="w-4 h-4" />;
      case 'rhythm': return <RefreshCw className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lyric': return 'text-blue-500 bg-blue-500/10';
      case 'melody': return 'text-purple-500 bg-purple-500/10';
      case 'theme': return 'text-green-500 bg-green-500/10';
      case 'rhythm': return 'text-orange-500 bg-orange-500/10';
      default: return 'text-muted bg-muted';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'lyric': return 'Lyric';
      case 'melody': return 'Melody';
      case 'theme': return 'Theme';
      case 'rhythm': return 'Rhythm';
      default: return 'Suggestion';
    }
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
            className="bg-panel border border-line rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/20 rounded-lg">
                  <Sparkles className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">AI Lyric Assistant</h2>
                  <p className="text-sm text-muted">Get creative suggestions and inspiration for your lyrics</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                ✕
              </Button>
            </div>

            {/* Input Section */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Your lyrics or idea</label>
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Describe what you're working on, paste your lyrics, or share your musical vision..."
                  className="min-h-[100px] resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Mood & Style</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {moodOptions.map((mood) => (
                    <button
                      key={mood.value}
                      onClick={() => setSelectedMood(mood.value)}
                      className={`p-3 rounded-lg border transition-all text-left ${
                        selectedMood === mood.value
                          ? 'border-accent bg-accent/10'
                          : 'border-line hover:border-accent/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {mood.icon}
                        <span className="font-medium text-sm">{mood.label}</span>
                      </div>
                      <p className="text-xs text-muted">{mood.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={generateSuggestions}
                disabled={!inputText.trim() || isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Get AI Suggestions
                  </>
                )}
              </Button>
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold">AI Suggestions</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {suggestions.map((suggestion, index) => (
                    <motion.div
                      key={suggestion.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-card p-4 rounded-lg border border-line"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(suggestion.type)}
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(suggestion.type)}`}>
                            {getTypeLabel(suggestion.type)}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(suggestion.text)}
                          className="h-6 w-6 p-0"
                        >
                          {copiedSuggestion === suggestion.text ? (
                            <Check className="w-3 h-3 text-green-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                      
                      <p className="text-sm mb-3">{suggestion.text}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-muted rounded-full h-2">
                            <div
                              className="bg-accent h-2 rounded-full"
                              style={{ width: `${suggestion.confidence * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted">
                            {Math.round(suggestion.confidence * 100)}% confidence
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Tips */}
            <div className="mt-8 bg-accent/10 border border-accent/20 p-4 rounded-lg">
              <h4 className="font-semibold text-accent mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                How to Use AI Assistant
              </h4>
              <ul className="text-sm space-y-1">
                <li>• Be specific about what you're looking for (lyrics, melody, theme, etc.)</li>
                <li>• Include context about your song's mood and style</li>
                <li>• Use the suggestions as inspiration, not final lyrics</li>
                <li>• Combine multiple suggestions to create something unique</li>
                <li>• The AI works best when you provide clear direction</li>
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
