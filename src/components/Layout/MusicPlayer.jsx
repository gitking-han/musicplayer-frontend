import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Volume2,
  VolumeX,
  Heart
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useMusic } from '@/contexts/MusicContext';
import { cn } from '@/lib/utils';

const MusicPlayer = () => {
  const { state, togglePlay, nextTrack, previousTrack, setVolume, toggleMute, toggleShuffle, setRepeatMode } = useMusic();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const { currentTrack, isPlaying, volume, isMuted, isShuffled, repeatMode } = state;

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (value) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value) => {
    setVolume(value[0]);
    if (audioRef.current) {
      audioRef.current.volume = value[0];
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleRepeatToggle = () => {
    const modes = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  if (!currentTrack) {
    return null;
  }

  return (
    <div className="h-20 bg-gradient-glass backdrop-blur-glass border-t border-glass-border px-4 flex items-center justify-between">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={nextTrack}
      />

      {/* Track Info */}
      <div className="flex items-center w-1/4 min-w-0">
        <img
          src={currentTrack.cover}
          alt={currentTrack.album}
          className="h-14 w-14 rounded-lg object-cover shadow-lg"
        />
        <div className="ml-3 min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-foreground truncate">
            {currentTrack.title}
          </h4>
          <p className="text-xs text-muted-foreground truncate">
            {currentTrack.artist}
          </p>
        </div>
        <Button variant="ghost" size="sm" className="ml-2 text-muted-foreground hover:text-primary">
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center w-1/2 max-w-md">
        <div className="flex items-center space-x-2 mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleShuffle}
            className={cn(
              'text-muted-foreground hover:text-foreground',
              isShuffled && 'text-primary'
            )}
          >
            <Shuffle className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={previousTrack}
            className="text-muted-foreground hover:text-foreground"
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={togglePlay}
            className="h-8 w-8 rounded-full bg-primary hover:bg-primary/90 shadow-primary"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4 ml-0.5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={nextTrack}
            className="text-muted-foreground hover:text-foreground"
          >
            <SkipForward className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleRepeatToggle}
            className={cn(
              'text-muted-foreground hover:text-foreground',
              repeatMode !== 'none' && 'text-primary'
            )}
          >
            <Repeat className="h-4 w-4" />
            {repeatMode === 'one' && (
              <span className="absolute -top-1 -right-1 text-xs">1</span>
            )}
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center w-full space-x-2">
          <span className="text-xs text-muted-foreground w-10 text-right">
            {formatTime(currentTime)}
          </span>
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground w-10">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Volume */}
      <div className="flex items-center w-1/4 justify-end space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMute}
          className="text-muted-foreground hover:text-foreground"
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
        <Slider
          value={[isMuted ? 0 : volume]}
          max={1}
          step={0.01}
          onValueChange={handleVolumeChange}
          className="w-20"
        />
      </div>
    </div>
  );
};

export default MusicPlayer;