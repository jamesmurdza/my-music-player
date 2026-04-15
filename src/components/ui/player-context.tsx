"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { Song } from "@/lib/types";

type PlayerContextValue = {
  currentTrack: Song | null;
  isPlaying: boolean;
  time: number;
  duration: number;
  play: (track: Song, onEnded?: () => void) => void;
  pause: () => void;
  toggle: (track: Song, onEnded?: () => void) => void;
  seek: (t: number) => void;
  isCurrent: (track: Song) => boolean;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onEndedRef = useRef<(() => void) | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const currentTrackRef = useRef<Song | null>(null);
  const isPlayingRef = useRef(false);
  currentTrackRef.current = currentTrack;
  isPlayingRef.current = isPlaying;

  useEffect(() => {
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      audioRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      tickRef.current = setInterval(() => {
        if (audioRef.current) setTime(audioRef.current.currentTime);
      }, 100);
    }
    return () => {
      if (tickRef.current) {
        clearInterval(tickRef.current);
        tickRef.current = null;
      }
    };
  }, [isPlaying]);

  const play = useCallback((track: Song, onEnded?: () => void) => {
    const isSame = currentTrackRef.current?.preview === track.preview;
    if (isSame && audioRef.current) {
      if (onEnded !== undefined) onEndedRef.current = onEnded;
      if (!isPlayingRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
      }
      return;
    }
    audioRef.current?.pause();
    const a = new Audio(track.preview);
    a.onloadedmetadata = () => setDuration(a.duration || 30);
    a.onended = () => {
      setIsPlaying(false);
      setTime(0);
      const cb = onEndedRef.current;
      if (cb) cb();
    };
    audioRef.current = a;
    onEndedRef.current = onEnded ?? null;
    setCurrentTrack(track);
    setTime(0);
    setDuration(30);
    a.play();
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(
    (track: Song, onEnded?: () => void) => {
      const isSame = currentTrackRef.current?.preview === track.preview;
      if (isSame && isPlayingRef.current) {
        pause();
        return;
      }
      play(track, onEnded);
    },
    [pause, play],
  );

  const seek = useCallback((t: number) => {
    if (audioRef.current) audioRef.current.currentTime = t;
    setTime(t);
  }, []);

  const isCurrent = useCallback(
    (track: Song) => currentTrack?.preview === track.preview,
    [currentTrack],
  );

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        time,
        duration,
        play,
        pause,
        toggle,
        seek,
        isCurrent,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within a PlayerProvider");
  return ctx;
}
