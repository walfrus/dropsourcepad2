// Audio utilities for metronome, pitch detection, and recording

export class Metronome {
  private audioContext: AudioContext | null = null;
  private nextNoteTime = 0.0;
  private scheduleAheadTime = 0.1;
  private lookahead = 25.0;
  private timerID: number | null = null;
  private isPlaying = false;
  private bpm = 120;
  private onTick?: () => void;

  constructor(onTick?: () => void) {
    this.onTick = onTick;
  }

  start(): void {
    if (this.isPlaying) return;
    
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.isPlaying = true;
      this.nextNoteTime = this.audioContext.currentTime;
      this.scheduler();
    } catch (error) {
      console.error('Failed to start metronome:', error);
    }
  }

  stop(): void {
    this.isPlaying = false;
    if (this.timerID) {
      clearTimeout(this.timerID);
      this.timerID = null;
    }
  }

  setBPM(bpm: number): void {
    this.bpm = Math.max(40, Math.min(200, bpm));
  }

  private scheduler(): void {
    while (this.nextNoteTime < this.audioContext!.currentTime + this.scheduleAheadTime) {
      this.playClick();
      this.nextNoteTime += 60.0 / this.bpm;
    }
    
    if (this.isPlaying) {
      this.timerID = window.setTimeout(() => this.scheduler(), this.lookahead);
    }
  }

  private playClick(): void {
    if (!this.audioContext) return;

    const osc = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    // High click for beat 1, lower for others
    const isFirstBeat = Math.round(this.nextNoteTime * this.bpm / 60) % 4 === 0;
    osc.frequency.value = isFirstBeat ? 1000 : 800;
    
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);
    
    osc.start(this.nextNoteTime);
    osc.stop(this.nextNoteTime + 0.05);
    
    if (this.onTick) {
      this.onTick();
    }
  }

  getBPM(): number {
    return this.bpm;
  }

  isActive(): boolean {
    return this.isPlaying;
  }
}

export class PitchDetector {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private stream: MediaStream | null = null;
  private isListening = false;
  private onPitchDetected?: (note: string, cents: number, frequency: number) => void;

  constructor(onPitchDetected?: (note: string, cents: number, frequency: number) => void) {
    this.onPitchDetected = onPitchDetected;
  }

  async start(): Promise<void> {
    if (this.isListening) return;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.8;
      
      this.microphone = this.audioContext.createMediaStreamSource(this.stream);
      this.microphone.connect(this.analyser);
      
      this.isListening = true;
      this.detectPitch();
    } catch (error) {
      console.error('Failed to start pitch detection:', error);
      throw error;
    }
  }

  stop(): void {
    this.isListening = false;
    
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    this.microphone = null;
    this.analyser = null;
  }

  private detectPitch(): void {
    if (!this.isListening || !this.analyser) return;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);
    this.analyser.getFloatFrequencyData(dataArray);

    // Find the frequency with the highest amplitude
    let maxIndex = 0;
    let maxValue = -Infinity;
    
    for (let i = 0; i < bufferLength; i++) {
      if (dataArray[i] > maxValue) {
        maxValue = dataArray[i];
        maxIndex = i;
      }
    }

    // Convert bin index to frequency
    const frequency = maxIndex * this.audioContext!.sampleRate / (this.analyser.fftSize * 2);
    
    // Only process if we have a strong enough signal
    if (maxValue > -50 && frequency > 80 && frequency < 1000) {
      const { note, cents } = this.frequencyToNote(frequency);
      if (this.onPitchDetected) {
        this.onPitchDetected(note, cents, frequency);
      }
    }

    if (this.isListening) {
      requestAnimationFrame(() => this.detectPitch());
    }
  }

  private frequencyToNote(freq: number): { note: string; cents: number } {
    if (freq <= 0) return { note: 'C', cents: 0 };
    
    const a4 = 440;
    const c0 = a4 * Math.pow(2, -4.75);
    const halfStepsBelowMiddleC = Math.round(12 * Math.log2(freq / c0));
    

    const noteIndex = (halfStepsBelowMiddleC % 12 + 12) % 12;
    
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const note = noteNames[noteIndex];
    
    // Calculate cents deviation
    const exactHalfSteps = 12 * Math.log2(freq / c0);
    const cents = Math.round((exactHalfSteps - halfStepsBelowMiddleC) * 100);
    
    return { note, cents };
  }

  isActive(): boolean {
    return this.isListening;
  }
}

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private stream: MediaStream | null = null;
  private chunks: Blob[] = [];
  private isRecording = false;
  private onDataAvailable?: (blob: Blob) => void;
  private onStop?: (blob: Blob) => void;

  constructor(onDataAvailable?: (blob: Blob) => void, onStop?: (blob: Blob) => void) {
    this.onDataAvailable = onDataAvailable;
    this.onStop = onStop;
  }

  async start(): Promise<void> {
    if (this.isRecording) return;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
          ? 'audio/webm;codecs=opus' 
          : 'audio/webm'
      });
      
      this.chunks = [];
      this.isRecording = true;
      
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.chunks.push(event.data);
          if (this.onDataAvailable) {
            this.onDataAvailable(event.data);
          }
        }
      };
      
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.chunks, { type: 'audio/webm' });
        if (this.onStop) {
          this.onStop(blob);
        }
      };
      
      this.mediaRecorder.start(100); // Collect data every 100ms
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }

  stop(): void {
    if (!this.isRecording || !this.mediaRecorder) return;
    
    this.isRecording = false;
    this.mediaRecorder.stop();
    
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  pause(): void {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.pause();
    }
  }

  resume(): void {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.resume();
    }
  }

  isActive(): boolean {
    return this.isRecording;
  }

  getState(): string {
    if (!this.mediaRecorder) return 'inactive';
    return this.mediaRecorder.state;
  }
}

// Utility function to get audio duration from a file or blob
export const getAudioDuration = (file: File | Blob): Promise<number> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    const url = URL.createObjectURL(file);
    
    audio.addEventListener('loadedmetadata', () => {
      URL.revokeObjectURL(url);
      resolve(audio.duration * 1000); // Convert to milliseconds
    });
    
    audio.addEventListener('error', () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load audio file'));
    });
    
    audio.src = url;
  });
};
