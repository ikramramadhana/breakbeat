"use client";

import type { Song } from "@/lib/supabase";
import { coverGradient } from "@/lib/coverGradient";
import { formatTime } from "@/lib/shuffle";

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
      className={`group flex items-center gap-3 rounded-lg px-2 py-2 transition ${
        isActive ? "bg-night-panel/60" : "hover:bg-night-panel/30"
      }`}
    >
      <button
        onClick={onPlay}
        className="flex flex-1 items-center gap-3 text-left min-w-0"
      >
        <div
          className="relative h-11 w-11 shrink-0 rounded-md"
          style={{ backgroundImage: coverGradient(song.id) }}
        >
          {isActive && isPlaying && (
            <span className="absolute inset-0 flex items-center justify-center gap-[2px] rounded-md bg-night-deep/40">
              <span className="h-3 w-[2px] animate-breathe bg-glow" />
              <span
                className="h-4 w-[2px] animate-breathe bg-glow"
                style={{ animationDelay: "0.2s" }}
              />
              <span
                className="h-2 w-[2px] animate-breathe bg-glow"
                style={{ animationDelay: "0.4s" }}
              />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p
            className={`truncate font-display text-[15px] italic ${
              isActive ? "text-glow" : "text-ink-primary"
            }`}
          >
            {song.title}
          </p>
          {song.artist && (
            <p className="truncate text-xs text-ink-muted">{song.artist}</p>
          )}
        </div>
      </button>

      {song.duration_seconds ? (
        <span className="hidden shrink-0 text-xs text-ink-faint sm:inline">
          {formatTime(song.duration_seconds)}
        </span>
      ) : null}

      <button
        onClick={onAddToQueue}
        aria-label="add to queue"
        title="add to queue"
        className="shrink-0 rounded-full p-2 text-ink-faint opacity-70 transition hover:text-glow hover:opacity-100"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 3v10M3 8h10"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
