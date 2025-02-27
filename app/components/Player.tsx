'use client';

import { useState, useEffect } from 'react';
import { useAudio } from '../contexts/AudioContext';
import { songs } from '../data/songs';

export default function Player() {
  const {
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
  } = useAudio();

  const [durationDisplay, setDurationDisplay] = useState('0:00');
  const [currentTimeDisplay, setCurrentTimeDisplay] = useState('0:00');
  const [isPlaylistExpanded, setIsPlaylistExpanded] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (currentSong) {
      setDurationDisplay(formatTime(currentSong.duration));
      setCurrentTimeDisplay(formatTime(progress * currentSong.duration));
    }
  }, [currentSong, progress]);

  return (
    <div className="flex flex-col w-full max-w-md mx-auto bg-gradient-to-b from-gray-900 to-gray-800 text-white rounded-xl shadow-2xl overflow-hidden">
      {/* Top section with gradient overlay and album art */}
      <div className="relative">
        {/* Background with blur effect */}
        {currentSong && (
          <div className="absolute inset-0 w-full h-full">
            <img 
              src={currentSong.cover} 
              alt="" 
              className="w-full h-full object-cover opacity-30 blur-sm"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 to-gray-900/90" />
          </div>
        )}

        {/* Actual content */}
        <div className="relative z-10 px-6 pt-8 pb-4">
          {/* Album Art with elegant shadow */}
          <div className="w-48 h-48 mx-auto mb-6 rounded-lg overflow-hidden shadow-xl transform transition-transform hover:scale-105">
            {currentSong ? (
              <img 
                src={currentSong.cover} 
                alt={`${currentSong.title} cover`} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
            )}
          </div>

          {/* Song Info with elegant typography */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold tracking-tight truncate">
              {currentSong ? currentSong.title : 'Select a song'}
            </h2>
            <p className="text-gray-400 font-medium mt-1 tracking-wide truncate">
              {currentSong ? currentSong.artist : 'Artist'}
            </p>
          </div>
        </div>
      </div>

      {/* Controls section with soft background */}
      <div className="px-6 py-4 bg-gray-800/60 backdrop-blur-sm">
        {/* Progress Bar */}
        <div className="mb-5">
          <div className="flex justify-between text-xs text-gray-400 mb-2 font-medium">
            <span>{currentTimeDisplay}</span>
            <span>{durationDisplay}</span>
          </div>
          <div className="relative h-1 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
              style={{ width: `${progress * 100}%` }}
            ></div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.001"
              value={progress}
              onChange={(e) => seek(parseFloat(e.target.value))}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex justify-center items-center gap-8 mb-5">
          <button
            onClick={prevSong}
            className="p-2 rounded-full text-gray-400 hover:text-white transition-colors"
            aria-label="Previous song"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
            </svg>
          </button>

          <button
            onClick={isPlaying ? pauseSong : resumeSong}
            className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-indigo-500/50 transition-all transform hover:scale-105"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 9v6m4-6v6" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              </svg>
            )}
          </button>

          <button
            onClick={nextSong}
            className="p-2 rounded-full text-gray-400 hover:text-white transition-colors"
            aria-label="Next song"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
            </svg>
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center mb-4 px-2">
          <button className="text-gray-400 hover:text-white p-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              {volume > 0.5 && (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.07 9.93a4 4 0 010 4.14M19.07 7.93a8 8 0 010 8.14" />
              )}
              {volume > 0 && volume <= 0.5 && (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072" />
              )}
            </svg>
          </button>
          <div className="relative w-full h-1 mx-3 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
              style={{ width: `${volume * 100}%` }}
            ></div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Playlist Toggle */}
      <button 
        onClick={() => setIsPlaylistExpanded(!isPlaylistExpanded)}
        className="flex items-center justify-center py-2 text-gray-400 hover:text-white bg-gray-800/80 transition-colors border-t border-gray-700"
      >
        <span className="font-medium mr-2">{isPlaylistExpanded ? 'Hide Playlist' : 'Show Playlist'}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-4 w-4 transition-transform duration-300 ${isPlaylistExpanded ? 'rotate-180' : ''}`} 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Playlist */}
      <div className={`max-h-[300px] overflow-y-auto transition-all duration-300 ease-in-out ${isPlaylistExpanded ? 'opacity-100' : 'opacity-0 h-0'}`}>
      <div className="bg-gray-900/90 backdrop-blur-sm p-2">
          {songs.map((song) => (
            <div
              key={song.id}
              onClick={() => playSong(song)}
              className={`flex items-center p-2 rounded-lg mb-1 transition-colors ${
                currentSong?.id === song.id 
                  ? 'bg-gradient-to-r from-blue-500/20 to-indigo-600/20 border-l-4 border-indigo-500' 
                  : 'hover:bg-gray-800/70'
              }`}
            >
              <img
                src={song.cover}
                alt={song.title}
                className="w-12 h-12 rounded-md object-cover shadow-md"
              />
              <div className="flex-1 ml-3">
                <p className={`font-medium truncate ${currentSong?.id === song.id ? 'text-white' : ''}`}>
                  {song.title}
                </p>
                <p className="text-sm text-gray-400 truncate">
                  {song.artist}
                </p>
              </div>
              <span className="text-xs text-gray-400 ml-2">
                {formatTime(song.duration)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
