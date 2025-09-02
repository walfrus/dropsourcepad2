'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Music } from 'lucide-react';
import { KEYS, getRelativeMinor, getRelativeMajor } from '@/lib/music';

interface KeyPickerProps {
  value: string;
  onChange: (key: string) => void;
}

export function KeyPicker({ value, onChange }: KeyPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleKeySelect = (key: string) => {
    onChange(key);
    setIsOpen(false);
  };

  const relativeKey = value.endsWith('m') 
    ? getRelativeMajor(value)
    : getRelativeMinor(value);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-card border border-line rounded-md hover:bg-panel transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-panel"
      >
        <Music className="h-4 w-4 text-accent" />
        <span className="font-medium">{value}</span>
        {relativeKey && (
          <span className="text-xs text-muted">
            ({relativeKey})
          </span>
        )}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-1 w-48 bg-card border border-line rounded-md shadow-lg z-50 max-h-60 overflow-y-auto"
          >
            <div className="p-2">
              {/* Major Keys */}
              <div className="mb-3">
                <h3 className="text-xs font-semibold text-muted uppercase tracking-wide mb-2 px-2">
                  Major Keys
                </h3>
                <div className="grid grid-cols-2 gap-1">
                  {KEYS.filter(key => !key.endsWith('m')).map((key) => (
                    <button
                      key={key}
                      onClick={() => handleKeySelect(key)}
                      className={`text-left px-2 py-1 rounded text-sm hover:bg-panel transition-colors ${
                        value === key ? 'bg-accent text-white' : 'text-white'
                      }`}
                    >
                      {key}
                    </button>
                  ))}
                </div>
              </div>

              {/* Minor Keys */}
              <div>
                <h3 className="text-xs font-semibold text-muted uppercase tracking-wide mb-2 px-2">
                  Minor Keys
                </h3>
                <div className="grid grid-cols-2 gap-1">
                  {KEYS.filter(key => key.endsWith('m')).map((key) => (
                    <button
                      key={key}
                      onClick={() => handleKeySelect(key)}
                      className={`text-left px-2 py-1 rounded text-sm hover:bg-panel transition-colors ${
                        value === key ? 'bg-accent text-white' : 'text-white'
                      }`}
                    >
                      {key}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
