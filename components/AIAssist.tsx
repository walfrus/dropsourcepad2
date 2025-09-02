'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';


interface AIAssistProps {
  isOpen: boolean;
  onClose: () => void;
}





export function AIAssist({ isOpen, onClose }: AIAssistProps) {
  const [mood, setMood] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<{text:string; confidence?:number}[]>([]);
  const [copiedSuggestion, setCopiedSuggestion] = useState<string>('');

  const moods = ["Romantic","Energetic","Melancholic","Uplifting"];

  function pct(c?: number) {
    return Number.isFinite(c) ? `${Math.round((c as number) * 100)}% confidence` : "";
  }

  async function generate() {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const r = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input, mood }),
      });
      const data = await r.json();
      setSuggestions((data.suggestions || []).map((s: any) => ({
        text: String(s.text || s),
        confidence: Number.isFinite(s.confidence) ? s.confidence : undefined,
      })));
    } finally {
      setLoading(false);
    }
  }



  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSuggestion(text);
      setTimeout(() => setCopiedSuggestion(''), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
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
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe what you're working on, paste your lyrics, or share your musical vision..."
                  className="min-h-[100px] resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Mood & Style</label>
                <div className="flex flex-wrap gap-2">
                  {moods.map(m => (
                    <button key={m}
                      className={`px-3 py-2 rounded-full border ${m===mood ? 'bg-[var(--bg-input)]' : 'bg-transparent'}`}
                      onClick={() => setMood(m)}
                    >{m}</button>
                  ))}
                </div>
              </div>

              <Button
                onClick={generate}
                disabled={!input.trim() || loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
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
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-card p-4 rounded-lg border border-line"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          <span className="px-2 py-1 rounded text-xs font-medium text-blue-500 bg-blue-500/10">
                            AI Suggestion
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
                      
                      {suggestion.confidence !== undefined && <span className="muted text-xs">{pct(suggestion.confidence)}</span>}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Tips */}
            <div className="mt-8 bg-accent/10 border border-accent/20 p-4 rounded-lg">
              <h4 className="font-semibold text-accent mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                How to Use AI Assistant
              </h4>
              <ul className="text-sm space-y-1">
                <li>• Be specific about what you&apos;re looking for (lyrics, melody, theme, etc.)</li>
                <li>• Include context about your song&apos;s mood and style</li>
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
