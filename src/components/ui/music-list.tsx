"use client";

import { useRef, useState } from "react";
import { z } from "zod";

import { musicListSchema, type Song } from "@/lib/types";
import { usePlayer } from "@/components/ui/player-context";

export type MusicListProps = z.infer<typeof musicListSchema>;

const Icon = ({ d, ...props }: { d: string } & React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d={d} />
  </svg>
);

const PLAY_D = "M8 5v14l11-7-11-7z";
const PAUSE_D = "M6 5h4v14H6zM14 5h4v14h-4z";
const PREV_D = "M6 6h2v12H6zm3.5 6 8.5 6V6z";
const NEXT_D = "M6 18l8.5-6L6 6v12zM16 6h2v12h-2z";
const SHUFFLE_D =
  "M10.59 9.17 5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z";
const LOOP_D =
  "M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z";

const fmt = (s: number) =>
  `${Math.floor(s / 60)}:${(Math.floor(s) % 60).toString().padStart(2, "0")}`;

export function MusicList({ title, description, tracks }: MusicListProps) {
  const list = (tracks ?? []).filter(
    (t): t is Song => !!t && typeof t.preview === "string" && t.preview.length > 0,
  );
  const { play, pause, toggle, isPlaying, isCurrent } = usePlayer();
  const [shuffle, setShuffle] = useState(false);
  const [loop, setLoop] = useState(true);

  const shuffleRef = useRef(shuffle);
  const loopRef = useRef(loop);
  const listRef = useRef(list);
  shuffleRef.current = shuffle;
  loopRef.current = loop;
  listRef.current = list;

  const nextIndex = (curr: number): number | null => {
    const l = listRef.current;
    if (l.length === 0) return null;
    if (shuffleRef.current) {
      if (l.length === 1) return loopRef.current ? 0 : null;
      let n = curr;
      while (n === curr) n = Math.floor(Math.random() * l.length);
      return n;
    }
    const n = curr + 1;
    if (n >= l.length) return loopRef.current ? 0 : null;
    return n;
  };

  const prevIndex = (curr: number): number | null => {
    const l = listRef.current;
    if (l.length === 0) return null;
    if (shuffleRef.current) return nextIndex(curr);
    const n = curr - 1;
    if (n < 0) return loopRef.current ? l.length - 1 : null;
    return n;
  };

  const currentListIndex = () =>
    list.findIndex((t) => t && isCurrent(t));

  const playAt = (i: number) => {
    const track = listRef.current[i];
    if (!track) return;
    play(track, () => {
      const n = nextIndex(i);
      if (n !== null) playAt(n);
    });
  };

  const toggleAt = (i: number) => {
    const track = list[i];
    if (!track) return;
    if (isCurrent(track) && isPlaying) {
      toggle(track);
      return;
    }
    playAt(i);
  };

  const handlePlayPause = () => {
    const idx = currentListIndex();
    if (idx >= 0 && isPlaying) {
      pause();
      return;
    }
    playAt(idx >= 0 ? idx : 0);
  };

  const handlePrev = () => {
    const idx = currentListIndex();
    const base = idx >= 0 ? idx : 0;
    const n = prevIndex(base);
    if (n !== null) playAt(n);
  };

  const handleNext = () => {
    const idx = currentListIndex();
    const base = idx >= 0 ? idx : -1;
    const n = nextIndex(base);
    if (n !== null) playAt(n);
  };

  const listIdx = currentListIndex();
  const listIsPlaying = listIdx >= 0 && isPlaying;

  return (
    <div className="w-full max-w-full mx-auto p-3">
      <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-neutral-200 bg-neutral-50">
          <div className="min-w-0">
            {title && (
              <h2 className="text-neutral-900 text-xl font-bold truncate tracking-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-neutral-600 text-sm italic mt-0.5 line-clamp-2">
                {description}
              </p>
            )}
            <div className="text-neutral-500 text-xs mt-1">
              {list.length} {list.length === 1 ? "song" : "songs"}
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setShuffle((s) => !s)}
              title="Shuffle"
              className={`h-9 w-9 rounded-full flex items-center justify-center transition ${
                shuffle
                  ? "bg-green-100 text-green-700"
                  : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
              }`}
            >
              <Icon d={SHUFFLE_D} className="w-[18px] h-[18px]" />
            </button>
            <button
              onClick={handlePrev}
              title="Previous"
              className="h-9 w-9 rounded-full text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 flex items-center justify-center transition"
            >
              <Icon d={PREV_D} className="w-5 h-5" />
            </button>
            <button
              onClick={handlePlayPause}
              title={listIsPlaying ? "Pause" : "Play"}
              className="h-11 w-11 rounded-full bg-neutral-900 text-white flex items-center justify-center hover:scale-105 hover:bg-black transition shadow-md"
            >
              <Icon d={listIsPlaying ? PAUSE_D : PLAY_D} className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              title="Next"
              className="h-9 w-9 rounded-full text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 flex items-center justify-center transition"
            >
              <Icon d={NEXT_D} className="w-5 h-5" />
            </button>
            <button
              onClick={() => setLoop((l) => !l)}
              title="Loop"
              className={`h-9 w-9 rounded-full flex items-center justify-center transition ${
                loop
                  ? "bg-green-100 text-green-700"
                  : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
              }`}
            >
              <Icon d={LOOP_D} className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>
        <div className="flex flex-col">
          {list.map((track, i) => (
            <Row
              key={track?.preview ?? i}
              track={track}
              index={i}
              onToggle={() => toggleAt(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Row({
  track,
  index,
  onToggle,
}: {
  track: Song;
  index: number;
  onToggle: () => void;
}) {
  const { isCurrent, isPlaying } = usePlayer();
  if (!track) return null;
  const active = isCurrent(track);
  const playing = active && isPlaying;
  const q = encodeURIComponent(`${track.title ?? ""} ${track.artist ?? ""}`.trim());
  const spotifyUrl = `https://open.spotify.com/search/${q}`;
  const appleUrl = `https://music.apple.com/search?term=${q}`;

  return (
    <div
      className={`group flex items-center gap-4 px-5 py-3 border-t border-neutral-200 transition-colors ${
        active ? "bg-green-50" : "hover:bg-neutral-50"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-6 h-6 flex items-center justify-center shrink-0"
      >
        <span
          className={`text-sm tabular-nums ${
            active ? "hidden" : "text-neutral-500 group-hover:hidden"
          }`}
        >
          {index + 1}
        </span>
        <Icon
          d={playing ? PAUSE_D : PLAY_D}
          className={`w-5 h-5 text-neutral-900 ${
            active ? "block" : "hidden group-hover:block"
          }`}
        />
      </button>
      {track.albumCover ? (
        <img
          src={track.albumCover}
          alt={track.album ?? ""}
          className="w-12 h-12 rounded object-cover shrink-0 shadow-sm ring-1 ring-black/5"
        />
      ) : (
        <div className="w-12 h-12 rounded bg-neutral-200 shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <div
          className={`truncate text-[15px] font-semibold leading-tight ${
            active ? "text-green-700" : "text-neutral-900"
          }`}
        >
          {track.title}
        </div>
        <div className="text-sm text-neutral-600 truncate mt-0.5">
          {track.artist}
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-1.5 shrink-0">
        {track.link && (
          <a
            href={track.link}
            target="_blank"
            rel="noopener noreferrer"
            className="h-7 px-3 flex items-center text-[11px] font-semibold text-white rounded-full bg-[#A238FF] hover:brightness-110 transition"
          >
            Deezer
          </a>
        )}
        <a
          href={spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="h-7 px-3 flex items-center text-[11px] font-semibold text-white rounded-full bg-[#1DB954] hover:brightness-110 transition"
        >
          Spotify
        </a>
        <a
          href={appleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="h-7 px-3 flex items-center text-[11px] font-semibold text-white rounded-full bg-[#FA2D48] hover:brightness-110 transition"
        >
          Apple
        </a>
      </div>
      <span className="text-xs text-neutral-500 font-mono w-10 text-right shrink-0 tabular-nums">
        {track.duration ? fmt(track.duration) : "--:--"}
      </span>
    </div>
  );
}
