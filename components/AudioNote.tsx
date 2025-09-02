'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Play, Pause, Square, Upload, Trash2 } from 'lucide-react';
import { Project, Clip } from '@/lib/types';
import useAppStore from '@/lib/store';
import { AudioRecorder, getAudioDuration } from '@/lib/audio';
import { Button } from './ui/button';

interface AudioNoteProps {
  project: Project;
}

export function AudioNote({ project }: AudioNoteProps) {
  const { addClip, removeClip: removeClipFromStore } = useAppStore();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const audioRecorder = useRef<AudioRecorder | null>(null);
  const audioElement = useRef<HTMLAudioElement | null>(null);
  const recordingInterval = useRef<NodeJS.Timeout>();
  const playingInterval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
      if (playingInterval.current) {
        clearInterval(playingInterval.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      audioRecorder.current = new AudioRecorder(
        () => {
          // Handle data available
        },
        async (blob) => {
          // Handle recording complete
          const durationMs = await getAudioDuration(blob);
          const file = new File([blob], `recording-${Date.now()}.webm`, { type: blob.type });
          await addClip(project.id, file, durationMs);
          setIsRecording(false);
          setRecordingTime(0);
          if (recordingInterval.current) {
            clearInterval(recordingInterval.current);
          }
        }
      );

      await audioRecorder.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start recording timer
      recordingInterval.current = setInterval(() => {
        setRecordingTime(prev => prev + 100);
      }, 100);
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Failed to start recording. Please check microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (audioRecorder.current && isRecording) {
      audioRecorder.current.stop();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const durationMs = await getAudioDuration(file);
      await addClip(project.id, file, durationMs);
    } catch (error) {
      console.error('Failed to upload audio:', error);
      alert('Failed to upload audio file.');
    }
  };

  const playClip = (clip: Clip) => {
    if (audioElement.current) {
      audioElement.current.pause();
    }

    // Create new audio element
    const audio = new Audio();
    audio.src = URL.createObjectURL(new Blob([clip.blobKey])); // This would need to be the actual blob
    audioElement.current = audio;

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration * 1000);
      audio.play();
      setIsPlaying(true);
      setCurrentTime(0);

      // Start playing timer
      playingInterval.current = setInterval(() => {
        setCurrentTime(audio.currentTime * 1000);
      }, 100);
    });

    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (playingInterval.current) {
        clearInterval(playingInterval.current);
      }
    });

    audio.addEventListener('pause', () => {
      setIsPlaying(false);
      if (playingInterval.current) {
        clearInterval(playingInterval.current);
      }
    });
  };

  const pauseClip = () => {
    if (audioElement.current) {
      audioElement.current.pause();
    }
  };

  const stopClip = () => {
    if (audioElement.current) {
      audioElement.current.pause();
      audioElement.current.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
      if (playingInterval.current) {
        clearInterval(playingInterval.current);
      }
    }
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = (parseFloat(e.target.value) / 100) * duration;
    if (audioElement.current) {
      audioElement.current.currentTime = seekTime / 1000;
      setCurrentTime(seekTime);
    }
  };

  const removeClip = async (clipId: string) => {
    await removeClipFromStore(project.id, clipId);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Audio Notes</h2>
        <div className="flex space-x-2">
          {/* Record Button */}
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            variant={isRecording ? "destructive" : "default"}
            size="sm"
            className="text-xs"
          >
            {isRecording ? (
              <>
                <MicOff className="h-3 w-3 mr-1" />
                Stop
              </>
            ) : (
              <>
                <Mic className="h-3 w-3 mr-1" />
                Record
              </>
            )}
          </Button>

          {/* Upload Button */}
          <label htmlFor="audio-upload">
            <Button variant="outline" size="sm" className="text-xs cursor-pointer">
              <Upload className="h-3 w-3 mr-1" />
              Upload
            </Button>
          </label>
          <input
            id="audio-upload"
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Recording Timer */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-card border border-line rounded-lg p-3 mb-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-bad rounded-full animate-pulse" />
                <span className="text-sm font-mono">Recording...</span>
              </div>
              <span className="text-sm font-mono text-accent">
                {formatTime(recordingTime)}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Clips */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        {project.clips.length === 0 ? (
          <div className="text-center text-muted py-8">
            <Mic className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No audio clips yet</p>
            <p className="text-xs">Record or upload audio to get started</p>
          </div>
        ) : (
          project.clips.map((clip) => (
            <div
              key={clip.id}
              className="bg-card border border-line rounded-lg p-3"
            >
              {/* Clip Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium truncate">{clip.filename}</span>
                <div className="flex space-x-1">
                  <Button
                    onClick={() => removeClip(clip.id)}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-muted hover:text-bad"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Audio Player */}
              <div className="space-y-2">
                {/* Progress Bar */}
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={duration > 0 ? (currentTime / duration) * 100 : 0}
                    onChange={handleSeek}
                    className="w-full h-1 bg-line rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-muted mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(clip.durationMs)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center space-x-2">
                  <Button
                    onClick={() => isPlaying ? pauseClip() : playClip(clip)}
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    {isPlaying ? (
                      <Pause className="h-3 w-3" />
                    ) : (
                      <Play className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    onClick={stopClip}
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <Square className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
