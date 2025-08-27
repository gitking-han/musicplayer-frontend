import React, { useState, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Heart,
  Volume2,
  VolumeX,
  Repeat,
  Repeat1,
  Shuffle,
} from "lucide-react";
import { Slider } from "components/ui/slider";
import { Button } from "components/ui/button";
import { useMusic } from "contexts/MusicContext";

const MusicPlayer = () => {
  const {
    currentSong,
    isPlaying,
    playSong,
    pauseTrack,
    audioRef,
    seek,
    setVolume,
    playNext,
    playPrevious,
    repeatMode,
    shuffle,
    toggleRepeatMode,
    toggleShuffle,
    likedSongs,
    toggleLike,
  } = useMusic();

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setLocalVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  if (!currentSong) return null;

  // ✅ check if current song is liked
  const isLiked = likedSongs.some((s) => s._id === currentSong._id);

  // Update current time & duration
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const timeUpdate = () => setCurrentTime(audio.currentTime);
    const loadedMeta = () => setDuration(audio.duration || 0);

    audio.addEventListener("timeupdate", timeUpdate);
    audio.addEventListener("loadedmetadata", loadedMeta);

    return () => {
      audio.removeEventListener("timeupdate", timeUpdate);
      audio.removeEventListener("loadedmetadata", loadedMeta);
    };
  }, [currentSong]);

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    isPlaying ? pauseTrack() : playSong(currentSong);
  };

  const handleSeek = (value) => {
    seek(value[0]);
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value) => {
    setLocalVolume(value[0]);
    setVolume(value[0]);
    if (value[0] > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    setVolume(isMuted ? volume : 0);
  };

  const coverSrc = currentSong.coverUrl || "/placeholder.svg";

  return (
    <div className="h-20 bg-gradient-glass backdrop-blur-glass border-t border-glass-border px-4 flex items-center justify-between">
      {/* Track Info */}
      <div className="flex items-center w-1/4 min-w-0">
        <img
          src={coverSrc}
          alt={currentSong.title}
          className="h-14 w-14 rounded-lg object-cover shadow-lg"
        />
        <div className="ml-3 min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-foreground truncate">
            {currentSong.title}
          </h4>
          <p className="text-xs text-muted-foreground truncate">
            {currentSong.artist}
          </p>
        </div>
        {/* ❤️ Like Button */}
        <Button
          variant="ghost"
          size="sm"
          className={`ml-2 ${isLiked ? "text-red-500" : ""}`}
          onClick={() => toggleLike(currentSong)}
        >
          <Heart className="h-4 w-4 fill-current" />
        </Button>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center w-1/2 max-w-md">
        <div className="flex items-center space-x-2 mb-2">
          <Button onClick={toggleShuffle} variant={shuffle ? "default" : "ghost"}>
            <Shuffle className="h-4 w-4" />
          </Button>
          <Button onClick={playPrevious} variant="ghost">
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button onClick={handlePlayPause} variant="default">
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button onClick={playNext} variant="ghost">
            <SkipForward className="h-4 w-4" />
          </Button>
          <Button
            onClick={toggleRepeatMode}
            variant={repeatMode !== "none" ? "default" : "ghost"}
          >
            {repeatMode === "one" ? (
              <Repeat1 className="h-4 w-4" />
            ) : (
              <Repeat className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Progress */}
        <div className="flex items-center w-full space-x-2">
          <span className="text-xs w-10 text-right">{formatTime(currentTime)}</span>
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
          />
          <span className="text-xs w-10">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume */}
      <div className="flex items-center w-1/4 justify-end space-x-2">
        <Button onClick={toggleMute} variant="ghost">
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
