import { z } from "zod";

export const songSchema = z.object({
    title: z.string().describe("Song title"),
    artist: z.string().describe("Artist name"),
    album: z.string().describe("Album name"),
    duration: z.number().describe("Duration in seconds"),
    preview: z.string().describe("Preview URL (30 seconds)"),
    link: z.string().describe("Full song link"),
    albumCover: z.string().optional().describe("Album cover URL"),
  });

export type Song = z.infer<typeof songSchema>;

export const musicListSchema = z.object({
  title: z.string().optional().describe("Optional playlist title, e.g. '90s Grunge' or 'Top Taylor Swift Tracks'"),
  description: z
    .string()
    .optional()
    .describe(
      "A short, evocative one-liner capturing the vibe or theme of the playlist — e.g. 'Rainy-day lo-fi for late-night coding' or 'Sun-drenched 70s soft rock for a long drive'. Keep it under ~120 characters.",
    ),
  tracks: z.array(songSchema).describe("The songs in the playlist"),
});
export type MusicList = z.infer<typeof musicListSchema>;

export const searchMusicInputSchema = z.object({
  query: z
    .string()
    .describe("Music search query (song title, artist name, or genre)"),
});
export type SearchMusicInput = z.infer<typeof searchMusicInputSchema>;