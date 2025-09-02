'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Highlighter, PenTool, X, Undo2, Save } from 'lucide-react';
import { Button } from './ui/button';

interface EditorOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tool = 'highlight' | 'draw';
type Color = 'yellow' | 'green' | 'blue' | 'pink' | 'purple';

interface Highlight {
  id: string;
  start: number;
  end: number;
  color: Color;
  text: string;
}

interface Drawing {
  id: string;
  points: { x: number; y: number }[];
  color: Color;
  width: number;
}

export function EditorOverlay({ isOpen, onClose }: EditorOverlayProps) {
  const [activeTool, setActiveTool] = useState<Tool>('highlight');
  const [activeColor, setActiveColor] = useState<Color>('yellow');
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef<Drawing | null>(null);

  const colors: Color[] = ['yellow', 'green', 'blue', 'pink', 'purple'];

  const colorClasses = {
    yellow: 'bg-yellow-400/30 border-yellow-400',
    green: 'bg-green-400/30 border-green-400',
    blue: 'bg-blue-400/30 border-blue-400',
    pink: 'bg-pink-400/30 border-pink-400',
    purple: 'bg-purple-400/30 border-purple-400',
  };



  const addHighlight = () => {
    if (!selectedText) return;

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const start = range.startOffset;
      const end = range.endOffset;

      const highlight: Highlight = {
        id: crypto.randomUUID(),
        start,
        end,
        color: activeColor,
        text: selectedText,
      };

      setHighlights(prev => [...prev, highlight]);
      setSelectedText('');
      selection.removeAllRanges();
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool !== 'draw') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    drawingRef.current = {
      id: crypto.randomUUID(),
      points: [{ x, y }],
      color: activeColor,
      width: 2,
    };

    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !drawingRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    drawingRef.current.points.push({ x, y });

    // Draw the line
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = drawingRef.current.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const lastPoint = drawingRef.current.points[drawingRef.current.points.length - 2];
      if (lastPoint) {
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    if (drawingRef.current) {
      setDrawings(prev => [...prev, drawingRef.current!]);
      drawingRef.current = null;
    }
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setDrawings([]);
  };

  const undoLast = () => {
    if (drawings.length > 0) {
      setDrawings(prev => prev.slice(0, -1));
      // Redraw canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          drawings.slice(0, -1).forEach(drawing => {
            ctx.strokeStyle = drawing.color;
            ctx.lineWidth = drawing.width;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            drawing.points.forEach((point, i) => {
              if (i === 0) {
                ctx.moveTo(point.x, point.y);
              } else {
                ctx.lineTo(point.x, point.y);
              }
            });
            ctx.stroke();
          });
        }
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
  }, [isOpen]);

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
            className="bg-panel border border-line rounded-2xl p-6 w-full max-w-4xl h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Editor Overlay</h2>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Toolbar */}
            <div className="flex items-center space-x-4 mb-6 p-4 bg-card rounded-lg">
              <div className="flex items-center space-x-2">
                <Button
                  variant={activeTool === 'highlight' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTool('highlight')}
                  className="flex items-center gap-2"
                >
                  <Highlighter className="w-4 h-4" />
                  Highlight
                </Button>
                <Button
                  variant={activeTool === 'draw' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTool('draw')}
                  className="flex items-center gap-2"
                >
                  <PenTool className="w-4 h-4" />
                  Draw
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setActiveColor(color)}
                    className={`w-6 h-6 rounded-full border-2 ${
                      activeColor === color ? 'ring-2 ring-accent' : ''
                    } ${colorClasses[color]}`}
                  />
                ))}
              </div>

              <div className="flex items-center space-x-2 ml-auto">
                <Button variant="outline" size="sm" onClick={undoLast}>
                  <Undo2 className="w-4 h-4" />
                  Undo
                </Button>
                <Button variant="outline" size="sm" onClick={clearCanvas}>
                  Clear
                </Button>
                <Button size="sm">
                  <Save className="w-4 h-4" />
                  Save
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col">
              {activeTool === 'highlight' ? (
                <div className="flex-1 bg-card rounded-lg p-4">
                  <div className="mb-4">
                    <p className="text-sm text-muted mb-2">
                      Select text in the editor below, then click &quot;Add Highlight&quot;
                    </p>
                    {selectedText && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Selected: &quot;{selectedText}&quot;</span>
                        <Button size="sm" onClick={addHighlight}>
                          Add Highlight
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    {highlights.map((highlight) => (
                      <div
                        key={highlight.id}
                        className={`p-2 rounded border ${colorClasses[highlight.color]}`}
                      >
                        <span className="text-sm font-medium">{highlight.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-1 bg-card rounded-lg p-4">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-full border border-line rounded cursor-crosshair"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
