'use client';

import { useState } from 'react';
import { Project, Clip } from '@/lib/types';
import useAppStore from '@/lib/store';
import { fmtMs, blobWithDuration } from '@/lib/audio';
import { saveClipBlob, getClipBlob } from '@/lib/idb';

interface AudioNoteProps {
  project: Project;
}

export function AudioNote({ project }: AudioNoteProps) {
  const { addClip } = useAppStore();
  const [isRecording, setIsRecording] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
          ? 'audio/webm;codecs=opus' 
          : 'audio/webm'
      });
      
      setChunks([]);
      setMediaRecorder(recorder);
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setChunks(prev => [...prev, event.data]);
        }
      };
      
      recorder.start(100);
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Failed to start recording. Please check microphone permissions.');
    }
  };

  const stopRecording = async () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      const raw = new Blob(chunks, { type: 'audio/webm' });
      const { blob, durationMs } = await blobWithDuration(raw);
      const id = crypto.randomUUID();
      await saveClipBlob(id, blob);
      addClip(project.id, new File([blob], `recording-${Date.now()}.webm`, { type: blob.type }), durationMs);
      setChunks([]);
      setIsRecording(false);
      
      // Stop the stream
      if (mediaRecorder.stream) {
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  const playClip = async (clip: Clip) => {
    try {
      const blob = await getClipBlob(clip.id);
      if (!blob) return;
      
      const audio = new Audio(URL.createObjectURL(blob));
      audio.onended = () => setPlayingId(null);
      await audio.play();
      setPlayingId(clip.id);
    } catch (error) {
      console.error('Failed to play clip:', error);
    }
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
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-red-500">Recording...</span>
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
                <button className="btn px-2 py-1" onClick={() => playClip(clip)}>
                  {playingId === clip.id ? 'Pause' : 'Play'}
                </button>
                <span className="muted text-xs">{fmtMs(clip.durationMs)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
