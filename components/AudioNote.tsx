'use client';

import { useState, useRef, useEffect } from 'react';
import { Project, Clip } from '@/lib/types';
import useAppStore from '@/lib/store';
import { AudioRecorder, getAudioDuration } from '@/lib/audio';

interface AudioNoteProps {
  project: Project;
}

export function AudioNote({ project }: AudioNoteProps) {
    const { addClip } = useAppStore();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  // These are kept for the existing audio logic but not displayed in the simplified UI
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentTime, setCurrentTime] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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



  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };



  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Audio Notes</h2>
        <button className="btn" onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? 'Stop' : 'Record'}
        </button>
      </div>

      {isRecording && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-red-500">Recording...</span>
            </div>
            <span className="text-sm muted">{Math.floor(recordingTime/1000)}s</span>
          </div>
        </div>
      )}

      {project.clips.length === 0 ? (
        <p className="muted text-sm">No audio clips yet — record or upload to get started.</p>
      ) : (
        <ul className="space-y-2">
          {project.clips.map(clip => (
            <li key={clip.id} className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--bg-input)] p-2">
              <span className="text-sm">{clip.filename}</span>
              <div className="flex items-center gap-2">
                <button className="btn px-2 py-1" onClick={() => playClip(clip)}>{isPlaying ? 'Pause' : 'Play'}</button>
                <span className="muted text-xs">{formatTime(clip.durationMs)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
