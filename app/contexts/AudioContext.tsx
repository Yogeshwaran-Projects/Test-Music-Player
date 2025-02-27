'use client';

import React, { createContext, useState, useContext, useRef, useEffect, useCallback } from 'react';
import { Howl } from 'howler';
import { Song, songs } from '../data/songs';


interface AudioContextProps {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
  playSong: (song: Song) => void;
  pauseSong: () => void;
  resumeSong: () => void;
  nextSong: () => void;
  prevSong: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
}

const AudioContext = createContext<AudioContextProps | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  
  const soundRef = useRef<Howl | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateMediaSessionMetadata = useCallback((song: Song) => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: song.title,
        artist: song.artist,
        album: 'NextJS Music Player',
        artwork: [
          { src: song.cover, sizes: '512x512', type: 'image/jpeg' }
        ]
      });
    }
  }, []);

  const updateMediaSessionPlaybackState = useCallback(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    }
  }, [isPlaying]);

  const setupMediaSessionHandlers = useCallback(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => resumeSong());
      navigator.mediaSession.setActionHandler('pause', () => pauseSong());
      navigator.mediaSession.setActionHandler('nexttrack', () => nextSong());
      navigator.mediaSession.setActionHandler('previoustrack', () => prevSong());
    }
  }, []);

  const clearProgressInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startProgressInterval = () => {
    clearProgressInterval();
    if (soundRef.current) {
      intervalRef.current = setInterval(() => {
        const seek = soundRef.current?.seek() || 0;
        const duration = soundRef.current?.duration() || 1;
        setProgress(seek / duration);
      }, 1000);
    }
  };

  const playSong = useCallback((song: Song) => {
    // Stop current song if playing
    if (soundRef.current) {
      soundRef.current.stop();
      clearProgressInterval();
    }

    // Create new Howl instance
    soundRef.current = new Howl({
      src: [song.file],
      html5: true, // Enable streaming (important for mobile background play)
      volume: volume,
      onplay: () => {
        setIsPlaying(true);
        updateMediaSessionMetadata(song);
        updateMediaSessionPlaybackState();
        startProgressInterval();
      },
      onpause: () => {
        setIsPlaying(false);
        updateMediaSessionPlaybackState();
        clearProgressInterval();
      },
      onend: () => {
        nextSong();
      },
      onstop: () => {
        setIsPlaying(false);
        updateMediaSessionPlaybackState();
        clearProgressInterval();
      },
    });

    // Play the song
    soundRef.current.play();
    setCurrentSong(song);
  }, [volume, updateMediaSessionMetadata, updateMediaSessionPlaybackState]);

  const pauseSong = useCallback(() => {
    soundRef.current?.pause();
  }, []);

  const resumeSong = useCallback(() => {
    if (currentSong && soundRef.current) {
      soundRef.current.play();
    } else if (currentSong) {
      playSong(currentSong);
    } else if (songs.length > 0) {
      playSong(songs[0]);
    }
  }, [currentSong, playSong]);

  const nextSong = useCallback(() => {
    if (!currentSong) {
      if (songs.length > 0) playSong(songs[0]);
      return;
    }

    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    playSong(songs[nextIndex]);
  }, [currentSong, playSong]);

  const prevSong = useCallback(() => {
    if (!currentSong) {
      if (songs.length > 0) playSong(songs[0]);
      return;
    }

    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    playSong(songs[prevIndex]);
  }, [currentSong, playSong]);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume);
    if (soundRef.current) {
      soundRef.current.volume(newVolume);
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (soundRef.current) {
      const duration = soundRef.current.duration();
      soundRef.current.seek(time * duration);
      setProgress(time);
    }
  }, []);

  useEffect(() => {
    setupMediaSessionHandlers();
    
    // Cleanup on unmount
    return () => {
      if (soundRef.current) {
        soundRef.current.stop();
      }
      clearProgressInterval();
    };
  }, [setupMediaSessionHandlers]);

  const value = {
    currentSong,
    isPlaying,
    progress,
    volume,
    playSong,
    pauseSong,
    resumeSong,
    nextSong,
    prevSong,
    setVolume,
    seek,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};