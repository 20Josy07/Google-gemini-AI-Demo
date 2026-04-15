/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { DUMMY_TRACKS, Track } from '@/src/constants';
import { motion, AnimatePresence } from 'motion/react';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.error("Playback failed", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    nextTrack();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full gap-4 font-mono">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      {/* Visualizer Placeholder */}
      <div className="relative w-full aspect-square bg-black border-2 border-[#FF00FF] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#00FFFF_2px,#00FFFF_4px)]" />
        </div>
        <motion.div 
          animate={{ 
            height: isPlaying ? [20, 80, 40, 90, 30] : 20,
            skewX: isPlaying ? [0, 10, -10, 0] : 0
          }}
          transition={{ repeat: Infinity, duration: 0.5 }}
          className="w-1/2 bg-[#FF00FF] shadow-[0_0_20px_#FF00FF]"
        />
        <div className="absolute top-2 left-2 text-[8px] text-[#00FFFF]">DATA_STREAM_ACTIVE</div>
      </div>

      {/* Track Info */}
      <div className="space-y-1">
        <div className="text-[14px] font-bold text-[#FF00FF] glitch-text" data-text={currentTrack.title}>
          {currentTrack.title}
        </div>
        <div className="text-[10px] text-[#00FFFF] uppercase opacity-70">
          SOURCE: {currentTrack.artist}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full space-y-1">
        <div className="h-4 bg-black border border-[#00FFFF] relative overflow-hidden">
          <motion.div 
            className="h-full bg-[#00FFFF]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-[8px] text-black font-bold mix-blend-difference">
            {progress.toFixed(2)}%_LOADED
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-3 gap-2">
        <Button 
          variant="ghost" 
          onClick={prevTrack}
          className="border border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black h-8 p-0 text-[10px]"
        >
          [PREV]
        </Button>

        <Button 
          onClick={togglePlay}
          className="border border-[#FF00FF] bg-black text-[#FF00FF] hover:bg-[#FF00FF] hover:text-black h-8 p-0 text-[10px] shadow-[3px_3px_0px_#00FFFF]"
        >
          {isPlaying ? '[HALT]' : '[EXEC]'}
        </Button>

        <Button 
          variant="ghost" 
          onClick={nextTrack}
          className="border border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black h-8 p-0 text-[10px]"
        >
          [NEXT]
        </Button>
      </div>

      {/* Playlist */}
      <div className="mt-auto flex flex-col gap-1 overflow-y-auto max-h-[150px] border-t border-[#00FFFF] pt-2">
        {DUMMY_TRACKS.map((track, index) => (
          <div 
            key={track.id}
            onClick={() => {
              setCurrentTrackIndex(index);
              setIsPlaying(true);
            }}
            className={`text-[10px] p-1 cursor-pointer transition-all ${
              currentTrackIndex === index 
                ? 'bg-[#FF00FF] text-black font-bold' 
                : 'text-[#00FFFF] hover:bg-[#00FFFF]/20'
            }`}
          >
            {index.toString().padStart(2, '0')}__{track.title}
          </div>
        ))}
      </div>
    </div>
  );
}
