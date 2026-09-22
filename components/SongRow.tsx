"use client";

import type { Song } from "@/lib/supabase";
import { coverGradient } from "@/lib/coverGradient";
import { formatTime } from "@/lib/shuffle";
import Equalizer from "@/components/Equalizer";

export default function SongRow({
  song,
  isActive,
  isPlaying,
  onPlay,
  onAddToQueue,
}: {
  song: Song;
  isActive: boolean;
  isPlaying: boolean;
  onPlay: () => void;
  onAddToQueue: () => void;
}) {
  return (
    <div
      className={`group grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-md px-2 py-2 transition-colors duration-150 ${
        isActive
          ? "bg-base-elevated/70"
          : "hover:bg-base-elevated/50"
      }`}
    >
      <button
        onClick={onPlay}
        className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-md"
        style={{ backgroundImage: coverGradient(song.id) }}
        aria-label={`play ${song.title}`}
      >
        {/* hover overlay with play icon, like Spotify */}
        <span className="absolute inset-0 flex items-center justify-center rounded-md bg-black/0 transition group-hover:bg-black/50">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="white"
            className="opacity-0 transition group-hover:opacity-100"
          >
            <path d="M3 1.5v13l11-6.5-11-6.5z" />
          </svg>
        </span>
        {isActive && isPlaying && (
          <span className="absolute inset-0 flex items-center justify-center rounded-md bg-black/45">
            <Equalizer playing />
          </span>
        )}
      </button>

      <button
        onClick={onPlay}
        className="flex min-w-0 flex-col items-start text-left"
      >
        <p
          className={`w-full truncate text-[15px] font-medium ${
            isActive ? "text-brand" : "text-ink-primary"
          }`}
        >
          {song.title}
        </p>
        {song.artist && (
          <p className="w-full truncate text-xs text-ink-muted">
            {song.artist}
          </p>
        )}
      </button>

      <div className="flex items-center gap-1">
        {song.duration_seconds ? (
          <span className="shrink-0 text-xs tabular-nums text-ink-faint">
            {formatTime(song.duration_seconds)}
          </span>
        ) : null}
        <button
          onClick={onAddToQueue}
          aria-label="add to queue"
          title="add to queue"
          className="shrink-0 rounded-full p-2 text-ink-faint opacity-0 transition group-hover:opacity-100 hover:text-brand"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 3v10M3 8h10"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}