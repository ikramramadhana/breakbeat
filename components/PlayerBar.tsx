"use client";

import type { Song } from "@/lib/supabase";
import { coverGradient } from "@/lib/coverGradient";

function IconPlay() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
      <path d="M3 1.5v13l11-6.5-11-6.5z" />
    </svg>
  );
}

function IconPause() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
      <rect x="2" y="1" width="4" height="14" rx="1" />
      <rect x="10" y="1" width="4" height="14" rx="1" />
    </svg>
  );
}

function IconNext() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
      <path d="M2 1.5v13l10-6.5L2 1.5z" />
      <rect x="12.5" y="1" width="1.6" height="14" rx="0.8" />
    </svg>
  );
}

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
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-base-line bg-base-panel/95 backdrop-blur-md">
      {/* progress track */}
      <div className="group relative h-[3px] w-full cursor-pointer bg-base-line">
        <div
          className="absolute inset-y-0 left-0 bg-brand transition-[width] duration-150"
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
            <p className="truncate text-sm font-medium text-ink-primary">
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
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-primary transition hover:scale-105 hover:text-white"
        >
          {isPlaying ? <IconPause /> : <IconPlay />}
        </button>

        <button
          onClick={onNext}
          aria-label="next"
          className="flex h-9 w-9 shrink-0 items-center justify-center text-ink-muted transition hover:text-white"
        >
          <IconNext />
        </button>
      </div>
    </div>
  );
}