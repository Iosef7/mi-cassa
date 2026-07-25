'use client';

import React, { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, FastForward, RotateCcw } from 'lucide-react';

interface MeetingMediaPlayerProps {
  audioUrl?: string | null;
  videoUrl?: string | null;
  transcription?: string | null;
}

export default function MeetingMediaPlayer({ audioUrl, videoUrl, transcription }: MeetingMediaPlayerProps) {
  const mediaRef = useRef<HTMLMediaElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const mediaSource = videoUrl || audioUrl;

  if (!mediaSource) {
    return (
      <div className="bg-muted/30 border border-dashed border-border rounded-xl p-6 text-center text-muted-foreground text-sm">
        No se ha cargado archivo de audio o video para esta reunión.
      </div>
    );
  }

  const togglePlay = () => {
    if (!mediaRef.current) return;
    if (isPlaying) {
      mediaRef.current.pause();
    } else {
      mediaRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (mediaRef.current) {
      setCurrentTime(mediaRef.current.currentTime);
      setDuration(mediaRef.current.duration || 0);
    }
  };

  const handleSpeedChange = () => {
    const rates = [1, 1.25, 1.5, 2];
    const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (mediaRef.current) mediaRef.current.playbackRate = nextRate;
  };

  const toggleMute = () => {
    if (mediaRef.current) {
      mediaRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const jumpToTimestamp = (seconds: number) => {
    if (mediaRef.current) {
      mediaRef.current.currentTime = seconds;
      mediaRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-4">
      {/* Visual Media */}
      <div className="relative rounded-xl overflow-hidden bg-black/90 aspect-video flex items-center justify-center">
        {videoUrl ? (
          <video
            ref={mediaRef as any}
            src={videoUrl}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            className="w-full h-full object-contain"
          />
        ) : (
          <audio
            ref={mediaRef as any}
            src={audioUrl || ''}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
        )}

        {!videoUrl && (
          <div className="flex flex-col items-center gap-2 text-primary">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
              <Volume2 size={32} />
            </div>
            <span className="text-xs text-muted-foreground font-mono">Reproduciendo Audio de Sesión</span>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col gap-2">
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={e => {
            if (mediaRef.current) {
              mediaRef.current.currentTime = Number(e.target.value);
              setCurrentTime(Number(e.target.value));
            }
          }}
          className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
        />

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow hover:opacity-90 transition-opacity"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
            </button>
            <span className="font-mono text-foreground font-medium">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSpeedChange}
              className="px-2.5 py-1 bg-muted hover:bg-muted/80 text-foreground font-bold rounded-lg text-xs"
            >
              {playbackRate}x
            </button>
            <button onClick={toggleMute} className="p-2 hover:bg-muted rounded-lg text-muted-foreground">
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
