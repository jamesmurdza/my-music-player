"use client";

// Central configuration file for Tambo components and tools
// Read more about Tambo at https://tambo.co/docs

import { TamboComponent, TamboTool } from "@tambo-ai/react";

import { z } from "zod";

import { MusicCard } from "@/components/ui/music-card";
import { MusicList } from "@/components/ui/music-list";
import { searchMusic } from "@/services/music-search";
import {
  songSchema,
  musicListSchema,
  searchMusicInputSchema,
} from "@/lib/types";

// Tambo tools registered for AI use.
export const tools: TamboTool[] = [
  {
    name: "searchMusic",
    description:
      "Searches for music by song title, artist name, or any music-related query.",
    tool: searchMusic,
    inputSchema: searchMusicInputSchema,
    outputSchema: z.array(songSchema),
  },
];

// Tambo components registered for AI use.
export const components: TamboComponent[] = [
  {
    name: "MusicCard",
    description:
      "Plays a single song from Deezer. Use when the user asks for one specific song.",
    component: MusicCard,
    propsSchema: songSchema,
  },
  {
    name: "MusicList",
    description:
      "A playlist of songs with a shared player — only one song plays at a time. Use when the user asks for multiple songs, a playlist, top tracks, a mix, or any multi-song result.",
    component: MusicList,
    propsSchema: musicListSchema,
  },
];
