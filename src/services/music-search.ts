"use server";

import { SearchMusicInput, Song } from "@/lib/types";

export async function searchMusic({ query }: SearchMusicInput): Promise<Song[]> {
  const response = await fetch(
    `https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=10`
  );
  const data = await response.json();
  if (data.error) throw new Error(data.error);
  // Map Deezer API results to MusicSearchResult type
  interface DeezerTrack {
    title: string;
    duration: number;
    preview: string;
    link: string;
    artist?: { name?: string };
    album?: { title?: string; cover?: string };
  }
  return ((data.data || []) as DeezerTrack[]).map((item) => ({
    title: item.title,
    duration: item.duration,
    preview: item.preview,
    link: item.link,
    artist: item.artist?.name || "",
    album: item.album?.title || "",
    albumCover: item.album?.cover || "",
  }));
}