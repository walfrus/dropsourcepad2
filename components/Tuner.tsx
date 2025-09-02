'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { PitchDetector } from '@/lib/audio';
import { Button } from './ui/button';

export function Tuner() {
  const [isListening, setIsListening] = useState(false);
  const [currentNote, setCurrentNote] = useState<string>('');
  const [currentCents, setCurrentCents] = useState<number>(0);
  const [currentFreq, setCurrentFreq] = useState<number>(0);

  
  const pitchDetector = useRef<PitchDetector | null>(null);

  useEffect(() => {
    return () => {
      if (pitchDetector.current) {
        pitchDetector.current.stop();
      }
    };
  }, []);

  const startListening = async () => {
    try {
      pitchDetector.current = new PitchDetector((note, cents, frequency) => {
        setCurrentNote(note);
        setCurrentCents(cents);
        setCurrentFreq(frequency);

      });

      await pitchDetector.current.start();
      setIsListening(true);
    } catch (error) {
      console.error('Failed to start tuner:', error);
      alert('Failed to start tuner. Please check microphone permissions.');
    }
  };

  const stopListening = () => {
    if (pitchDetector.current) {
      pitchDetector.current.stop();
      setIsListening(false);
      setCurrentNote('');
      setCurrentCents(0);
      setCurrentFreq(0);

    }
  };

  const getCentsColor = (cents: number) => {
    if (Math.abs(cents) < 10) return 'text-ok';
    if (Math.abs(cents) < 25) return 'text-warn';
    return 'text-bad';
  };

  const getCentsDirection = (cents: number) => {
    if (Math.abs(cents) < 10) return 'In tune';
    if (cents > 0) return 'Sharp';
    return 'Flat';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Tuner</h3>
        <p className="text-sm text-muted">Detect pitch from microphone input</p>
      </div>

      {/* Microphone Control */}
      <div className="text-center mb-6">
        <Button
          onClick={isListening ? stopListening : startListening}
          variant={isListening ? "destructive" : "default"}
          size="lg"
          className="w-24 h-24 rounded-full"
        >
          {isListening ? (
            <MicOff className="h-8 w-8" />
          ) : (
            <Mic className="h-8 w-8" />
          )}
        </Button>
        <p className="text-sm text-muted mt-2">
          {isListening ? 'Listening...' : 'Click to start'}
        </p>
      </div>

      {/* Pitch Display */}
      <AnimatePresence>
        {isListening && currentNote && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center space-y-4"
          >
            {/* Note Display */}
            <div className="space-y-2">
              <motion.div
                key={currentNote}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-6xl font-bold text-accent"
              >
                {currentNote}
              </motion.div>
              
              {/* Frequency */}
              <div className="text-lg text-muted">
                {currentFreq.toFixed(1)} Hz
              </div>
            </div>

            {/* Cents Display */}
            <div className="space-y-2">
              <div className={`text-2xl font-mono ${getCentsColor(currentCents)}`}>
                {currentCents > 0 ? '+' : ''}{currentCents}¢
              </div>
              
              {/* Direction */}
              <div className={`text-sm ${getCentsColor(currentCents)}`}>
                {getCentsDirection(currentCents)}
              </div>
            </div>

            {/* Visual Indicator */}
            <div className="relative w-32 h-8 mx-auto">
              {/* Center line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-accent transform -translate-x-1/2" />
              
              {/* Cents indicator */}
              <motion.div
                animate={{ x: (currentCents / 50) * 32 }} // Scale to fit within 64px
                className="absolute top-1/2 w-2 h-2 bg-white rounded-full transform -translate-y-1/2"
                style={{ left: '50%' }}
              />
              
              {/* Scale markers */}
              <div className="absolute inset-0 flex items-center justify-between text-xs text-muted">
                <span>-50¢</span>
                <span>0¢</span>
                <span>+50¢</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      {!isListening && (
        <div className="mt-auto text-center text-sm text-muted">
          <Volume2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>Click the microphone button to start tuning</p>
          <p className="text-xs mt-1">Make sure your microphone is working and not muted</p>
        </div>
      )}

      {/* Status */}
      {isListening && (
        <div className="mt-auto text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-ok">
            <div className="w-2 h-2 bg-ok rounded-full animate-pulse" />
            <span>Listening for pitch...</span>
          </div>
        </div>
      )}
    </div>
  );
}
