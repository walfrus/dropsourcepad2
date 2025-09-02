'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Drumstick } from 'lucide-react';
import { Input } from './ui/input';

interface BpmTapProps {
  bpm: number;
  onBpmChange: (bpm: number) => void;
}

export function BpmTap({ bpm, onBpmChange }: BpmTapProps) {
  const [isTapping, setIsTapping] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [tapTimes, setTapTimes] = useState<number[]>([]);
  const [displayBpm, setDisplayBpm] = useState(bpm);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setDisplayBpm(bpm);
  }, [bpm]);

  const handleTap = () => {
    const now = Date.now();
    
    if (now - lastTapTime > 2000) {
      // Reset if more than 2 seconds between taps
      setTapCount(1);
      setTapTimes([now]);
      setLastTapTime(now);
    } else {
      const newTapCount = tapCount + 1;
      const newTapTimes = [...tapTimes, now];
      
      if (newTapCount >= 2) {
        // Calculate BPM from last 4 taps
        const recentTaps = newTapTimes.slice(-4);
        const intervals: number[] = [];
        
        for (let i = 1; i < recentTaps.length; i++) {
          intervals.push(recentTaps[i] - recentTaps[i - 1]);
        }
        
        if (intervals.length > 0) {
          const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
          const newBpm = Math.round(60000 / avgInterval);
          
          // Clamp BPM to reasonable range
          const clampedBpm = Math.max(40, Math.min(200, newBpm));
          setDisplayBpm(clampedBpm);
          onBpmChange(clampedBpm);
        }
      }
      
      setTapCount(newTapCount);
      setTapTimes(newTapTimes);
      setLastTapTime(now);
    }
    
    setIsTapping(true);
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Reset tap state after 2 seconds of inactivity
    timeoutRef.current = setTimeout(() => {
      setTapCount(0);
      setTapTimes([]);
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 40 && value <= 200) {
      setDisplayBpm(value);
      onBpmChange(value);
    }
  };

  const handleInputBlur = () => {
    // Ensure the displayed BPM matches the actual BPM
    setDisplayBpm(bpm);
  };

  return (
    <div className="flex items-center space-x-3">
      {/* BPM Display/Input */}
      <div className="relative">
        <Input
          type="number"
          value={displayBpm}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          className="w-16 h-8 text-center text-sm font-mono bg-card border-line"
          min={40}
          max={200}
        />
        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-muted">
          BPM
        </span>
      </div>

      {/* Tap Button */}
      <motion.button
        data-bpm-tap
        onClick={handleTap}
        whileTap={{ scale: 0.95 }}
        animate={isTapping ? { scale: [1, 1.1, 1] } : {}}
        onAnimationComplete={() => setIsTapping(false)}
        className="relative flex items-center justify-center w-12 h-12 bg-accent hover:bg-accent/90 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-panel"
        title="Tap to set BPM"
      >
        <Drumstick className="h-5 w-5 text-white" />
        
        {/* Tap indicator */}
        {tapCount > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-ok text-white text-xs rounded-full flex items-center justify-center font-bold"
          >
            {tapCount}
          </motion.div>
        )}
      </motion.button>

      {/* Tap instructions */}
      {tapCount === 0 && (
        <span className="text-xs text-muted">
          Tap 4+ times to set BPM
        </span>
      )}
    </div>
  );
}
