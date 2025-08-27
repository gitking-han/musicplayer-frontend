// contexts/MusicContext.js
import React, { createContext, useState, useContext, useEffect, useRef } from "react";

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [songs, setSongs] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  const [highQuality, setHighQuality] = useState(false);
  const [showUnplayable, setShowUnplayable] = useState(true);

  // Repeat & shuffle
  const [repeatMode, setRepeatMode] = useState("none"); // none | all | one
  const [shuffle, setShuffle] = useState(false);

  // Liked songs
  const [likedSongs, setLikedSongs] = useState([]);

  const audioRef = useRef(new Audio());

  const currentSong = playlist[currentIndex] || null;

  // Fetch songs from backend
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/songs");
        const data = await res.json();
        setSongs(data);
      } catch (err) {
        console.error("Error fetching songs:", err);
      }
    };
    fetchSongs();
  }, []);

  // Load song into audio when currentSong changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!currentSong) return;

    const src = currentSong.audioUrl?.startsWith("http")
      ? currentSong.audioUrl
      : `http://localhost:5000${currentSong.audioUrl}`;

    audio.src = src;

    if (isPlaying) {
      audio.play().catch(() => {});
    }

    return () => {
      audio.pause();
    };
  }, [currentSong]);

  // Play / Pause control
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio.src) return;

    if (isPlaying) audio.play().catch(() => {});
    else audio.pause();
  }, [isPlaying]);

  // Handle song ended
  useEffect(() => {
    const audio = audioRef.current;

    const handleEnded = () => {
      if (repeatMode === "one") {
        // 🔁 Repeat same song
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else if (shuffle) {
        // 🔀 Shuffle mode
        const randomIndex = Math.floor(Math.random() * playlist.length);
        setCurrentIndex(randomIndex);
        setIsPlaying(true);
      } else {
        // ▶️ Normal or repeat-all
        const nextIndex = currentIndex + 1;
        if (nextIndex < playlist.length) {
          setCurrentIndex(nextIndex);
          setIsPlaying(true);
        } else if (repeatMode === "all") {
          setCurrentIndex(0); // restart playlist
          setIsPlaying(true);
        } else {
          setIsPlaying(false); // stop
        }
      }
    };

    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [repeatMode, shuffle, playlist, currentIndex]);

  // 🔹 Core playback
  const playSong = (song, list = songs) => {
    const index = list.findIndex((s) => s._id === song._id);
    setPlaylist(list);
    setCurrentIndex(index !== -1 ? index : 0);
    setIsPlaying(true);
  };

  // 🔹 NEW: play whole playlist
  const playPlaylist = (list, startIndex = 0) => {
    if (!list || list.length === 0) return;
    setPlaylist(list);
    setCurrentIndex(startIndex);
    setIsPlaying(true);
  };

  const playTrack = (song) => playSong(song); // alias for clarity
  const pauseTrack = () => setIsPlaying(false);
  const resumeSong = () => setIsPlaying(true);

  const stopSong = () => {
    setIsPlaying(false);
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
  };

  const seek = (time) => {
    audioRef.current.currentTime = time;
  };

  const setVolume = (volume) => {
    audioRef.current.volume = volume;
  };

  // 🔹 Next / Previous
  const playNext = () => {
    if (playlist.length === 0) return;
    if (shuffle) {
      const randomIndex = Math.floor(Math.random() * playlist.length);
      setCurrentIndex(randomIndex);
    } else {
      const nextIndex = currentIndex + 1;
      if (nextIndex < playlist.length) {
        setCurrentIndex(nextIndex);
      } else if (repeatMode === "all") {
        setCurrentIndex(0);
      }
    }
    setIsPlaying(true);
  };

  const playPrevious = () => {
    if (playlist.length === 0) return;
    if (shuffle) {
      const randomIndex = Math.floor(Math.random() * playlist.length);
      setCurrentIndex(randomIndex);
    } else {
      const prevIndex = currentIndex - 1;
      if (prevIndex >= 0) {
        setCurrentIndex(prevIndex);
      } else if (repeatMode === "all") {
        setCurrentIndex(playlist.length - 1);
      }
    }
    setIsPlaying(true);
  };

  // 🔹 Toggles
  const toggleHighQuality = () => setHighQuality((prev) => !prev);
  const toggleShowUnplayable = () => setShowUnplayable((prev) => !prev);
  const toggleRepeatMode = () => {
    if (repeatMode === "none") setRepeatMode("all");
    else if (repeatMode === "all") setRepeatMode("one");
    else setRepeatMode("none");
  };
  const toggleShuffle = () => setShuffle((prev) => !prev);

  // 🔹 Liked songs
  const toggleLike = (song) => {
    setLikedSongs((prev) => {
      const exists = prev.find((s) => s._id === song._id);
      if (exists) {
        return prev.filter((s) => s._id !== song._id);
      } else {
        return [...prev, song];
      }
    });
  };

  const deleteSong = (songId) => {
    setLikedSongs((prev) => prev.filter((s) => s._id !== songId));
  };

  return (
    <MusicContext.Provider
      value={{
        songs,
        playlist,
        currentSong,
        currentIndex,
        isPlaying,
        audioRef,
        playSong,
        playTrack,
        playPlaylist, // ✅ exposed for LikedSongs page
        pauseTrack,
        resumeSong,
        stopSong,
        playNext,
        playPrevious,
        seek,
        setVolume,
        highQuality,
        showUnplayable,
        repeatMode,
        shuffle,
        likedSongs,
        toggleLike,
        deleteSong,
        toggleHighQuality,
        toggleShowUnplayable,
        toggleRepeatMode,
        toggleShuffle,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);
