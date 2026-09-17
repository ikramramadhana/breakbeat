"use client";

import type { Song } from "@/lib/supabase";
import { coverGradient } from "@/lib/coverGradient";

export default function PlayerBar({
  song,
  isPlaying,
  progressPct,
  onTogglePlay,
  onNext,
  onExpand,
}: {
  song: Song | null;
  isPlaying: boolean;
  progressPct: number;
  onTogglePlay: () => void;
  onNext: () => void;
  onExpand: () => void;
}) {
  if (!song) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-night-line bg-night-mid/95 backdrop-blur">
      <div className="h-[2px] w-full bg-night-line">
        <div
          className="h-full bg-glow transition-[width]"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="flex items-center gap-3 px-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2">
        <button
          onClick={onExpand}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <div
            className="h-10 w-10 shrink-0 rounded-md"
            style={{ backgroundImage: coverGradient(song.id) }}
          />
          <div className="min-w-0">
            <p className="truncate font-display text-sm italic text-ink-primary">
              {song.title}
            </p>
            {song.artist && (
              <p className="truncate text-xs text-ink-muted">{song.artist}</p>
            )}
          </div>
        </button>

        <button
          onClick={onTogglePlay}
          aria-label={isPlaying ? "pause" : "play"}
          className="flex h-9 w-9 shrink-0 items-center justify-center text-ink-primary"
        >
          {isPlaying ? (
            <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
              <rect x="2" y="1" width="4" height="14" rx="1" />
              <rect x="10" y="1" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3 1.5v13l11-6.5-11-6.5z" />
            </svg>
          )}
        </button>

        <button
          onClick={onNext}
          aria-label="next"
          className="shrink-0 text-2xl text-ink-muted"
        >
          ›
        </button>
      </div>
    </div>
  );
}
