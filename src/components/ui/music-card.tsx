"use client";

import { z } from "zod";

import { songSchema } from "@/lib/types";
import { usePlayer } from "@/components/ui/player-context";

export type MusicCardProps = z.infer<typeof songSchema>;

const Icon = ({ d, ...props }: { d: string } & React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d={d} /></svg>
);

export function MusicCard(props: MusicCardProps) {
  const { title, artist, album, link, albumCover } = props;
  const { toggle, seek, isCurrent, isPlaying, time, duration } = usePlayer();

  const active = isCurrent(props);
  const playing = active && isPlaying;
  const shownTime = active ? time : 0;
  const shownDuration = active ? duration : 30;
  const pct = (shownTime / shownDuration) * 100;
  const fmt = (s: number) => `${Math.floor(s / 60)}:${(Math.floor(s) % 60).toString().padStart(2, "0")}`;

  const query = encodeURIComponent(`${title ?? ""} ${artist ?? ""}`.trim());
  const spotifyUrl = `https://open.spotify.com/search/${query}`;
  const appleUrl = `https://music.apple.com/search?term=${query}`;

  return (
    <div className="w-full max-w-full mx-auto p-3">
      <div className="relative">
        <div className="relative rounded-xl overflow-hidden border border-gray-700 bg-gray-800/60 backdrop-blur-xl">
          <div className="absolute top-2 right-2 flex items-center gap-1">
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="h-7 px-2 flex items-center text-[11px] font-semibold text-white rounded-full bg-gray-700/60 border border-gray-600 hover:bg-gray-600/60"
              >
                Deezer
              </a>
            )}
            <a
              href={spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-7 px-2 flex items-center text-[11px] font-semibold text-white rounded-full bg-[#1DB954]/80 border border-[#1DB954] hover:bg-[#1DB954]"
            >
              Spotify
            </a>
            <a
              href={appleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-7 px-2 flex items-center text-[11px] font-semibold text-white rounded-full bg-[#FA2D48]/80 border border-[#FA2D48] hover:bg-[#FA2D48]"
            >
              Apple
            </a>
          </div>
          <div className="p-4 flex items-center gap-4">
            <img
              src={albumCover || undefined}
              alt={album}
              className="w-32 h-32 rounded-md object-cover ring-1 ring-gray-600"
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-white text-2xl font-bold truncate">
                {title}
              </h2>
              <div className="text-gray-300 font-medium truncate">{artist}</div>
              <div className="text-gray-300 text-sm truncate">{album}</div>
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => toggle(props)}
                  className="h-9 w-9 rounded-full border border-gray-600 bg-gray-700/50 flex items-center justify-center"
                >
                  <Icon d={playing ? "M6 5h4v14H6zM14 5h4v14h-4z" : "M8 5v14l11-7-11-7z"} className="text-white w-6 h-6" />
                </button>
                <div className="relative flex-1 h-2">
                  <div className="absolute inset-0 rounded-full bg-gray-600 border border-gray-700" />
                  <div
                    className="absolute left-0 top-0 h-2 rounded-full bg-white/60"
                    style={{ width: `${pct}%` }}
                  />
                  <input
                    type="range"
                    min={0}
                    max={shownDuration}
                    value={shownTime}
                    disabled={!active}
                    onChange={(e) => seek(+e.target.value)}
                    className="absolute inset-0 w-full opacity-0 cursor-pointer"
                  />
                </div>
                <span className="text-[11px] text-gray-300 font-mono">
                  {fmt(shownTime)}
                </span>
              </div>
            </div>
          </div>
          <div
            className="pointer-events-none absolute -z-10 blur-[30px] opacity-20"
            style={{ inset: "-20%", background: `radial-gradient(50% 50% at 20% 10%, rgba(255,255,255,0.1), transparent 60%), radial-gradient(60% 60% at 80% 90%, rgba(255,255,255,0.05), transparent 60%)` }}
          />
        </div>
        <div
          className="absolute inset-0 -z-20 rounded-xl blur-md opacity-70"
          style={{
            background: `url(${albumCover}) center/cover`,
          }}
        />
      </div>
    </div>
  );
}
