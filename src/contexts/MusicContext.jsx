import React, { createContext, useContext, useReducer, useCallback } from 'react';

const initialState = {
  currentTrack: null,
  isPlaying: false,
  queue: [],
  currentIndex: 0,
  volume: 0.7,
  isMuted: false,
  isShuffled: false,
  repeatMode: 'none',
  user: null,
  isAuthenticated: false,
};

const musicReducer = (state, action) => {
  switch (action.type) {
    case 'PLAY_TRACK':
      return {
        ...state,
        currentTrack: action.payload.track,
        queue: action.payload.queue || [action.payload.track],
        currentIndex: 0,
        isPlaying: true,
      };
    case 'TOGGLE_PLAY':
      return { ...state, isPlaying: !state.isPlaying };
    case 'NEXT_TRACK':
      const nextIndex = state.currentIndex + 1;
      if (nextIndex < state.queue.length) {
        return {
          ...state,
          currentIndex: nextIndex,
          currentTrack: state.queue[nextIndex],
        };
      }
      return state;
    case 'PREVIOUS_TRACK':
      const prevIndex = state.currentIndex - 1;
      if (prevIndex >= 0) {
        return {
          ...state,
          currentIndex: prevIndex,
          currentTrack: state.queue[prevIndex],
        };
      }
      return state;
    case 'SET_VOLUME':
      return { ...state, volume: action.payload, isMuted: false };
    case 'TOGGLE_MUTE':
      return { ...state, isMuted: !state.isMuted };
    case 'TOGGLE_SHUFFLE':
      return { ...state, isShuffled: !state.isShuffled };
    case 'SET_REPEAT_MODE':
      return { ...state, repeatMode: action.payload };
    case 'LOGIN':
      return { ...state, user: action.payload, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false };
    default:
      return state;
  }
};

const MusicContext = createContext(null);

export const MusicProvider = ({ children }) => {
  const [state, dispatch] = useReducer(musicReducer, initialState);

  const playTrack = useCallback((track, queue) => {
    dispatch({ type: 'PLAY_TRACK', payload: { track, queue } });
  }, []);

  const togglePlay = useCallback(() => {
    dispatch({ type: 'TOGGLE_PLAY' });
  }, []);

  const nextTrack = useCallback(() => {
    dispatch({ type: 'NEXT_TRACK' });
  }, []);

  const previousTrack = useCallback(() => {
    dispatch({ type: 'PREVIOUS_TRACK' });
  }, []);

  const setVolume = useCallback((volume) => {
    dispatch({ type: 'SET_VOLUME', payload: volume });
  }, []);

  const toggleMute = useCallback(() => {
    dispatch({ type: 'TOGGLE_MUTE' });
  }, []);

  const toggleShuffle = useCallback(() => {
    dispatch({ type: 'TOGGLE_SHUFFLE' });
  }, []);

  const setRepeatMode = useCallback((mode) => {
    dispatch({ type: 'SET_REPEAT_MODE', payload: mode });
  }, []);

  const login = useCallback((user) => {
    dispatch({ type: 'LOGIN', payload: user });
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
  }, []);

  return (
    <MusicContext.Provider
      value={{
        state,
        dispatch,
        playTrack,
        togglePlay,
        nextTrack,
        previousTrack,
        setVolume,
        toggleMute,
        toggleShuffle,
        setRepeatMode,
        login,
        logout,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};