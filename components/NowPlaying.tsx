"use client";

import type { Song } from "@/lib/supabase";
import { formatTime } from "@/lib/shuffle";
import SleepTimer from "@/components/SleepTimer";
import { coverGradient } from "@/lib/coverGradient";

function IconPlay() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
      <path d="M3 1.5v13l11-6.5-11-6.5z" />
    </svg>
  );
}

function IconPause() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
      <rect x="2" y="1" width="4" height="14" rx="1" />
      <rect x="10" y="1" width="4" height="14" rx="1" />
    </svg>
  );
}

function IconPrev() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
      <path d="M14 1.5v13L4 8l10-6.5z" />
      <rect x="1.9" y="1" width="1.6" height="14" rx="0.8" />
    </svg>
  );
}

function IconNext() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
      <path d="M2 1.5v13l10-6.5L2 1.5z" />
      <rect x="12.5" y="1" width="1.6" height="14" rx="0.8" />
    </svg>
  );
}

function IconShuffle() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
      <path
        d="M1 3.5h2.6l2.3 3-2.3 3H1M1 12.5h2.6l6.6-8.5H15M12.6 2.2 15 4l-2.4 1.8M12.6 10.2 15 12l-2.4 1.8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function NowPlaying({
  song,
  isPlaying,
  isShuffle,
  progress,
  duration,
  volume,
  queue,
  onClose,
  onTogglePlay,
  onNext,
  onPrev,
  onToggleShuffle,
  onVolumeChange,
  timerRemaining,
  timerTotal,
  timerActive,
  onStartTimer,
  onCancelTimer,
  onRemoveFromQueue,
  onMoveQueueItem,
}: {
  song: Song | null;
  isPlaying: boolean;
  isShuffle: boolean;
  progress: number;
  duration: number;
  volume: number;
  queue: Song[];
  onClose: () => void;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onToggleShuffle: () => void;
  onVolumeChange: (v: number) => void;
  timerRemaining: number;
  timerTotal: number;
  timerActive: boolean;
  onStartTimer: (minutes: number) => void;
  onCancelTimer: () => void;
  onRemoveFromQueue: (index: number) => void;
  onMoveQueueItem: (index: number, direction: -1 | 1) => void;
}) {
  const progressPct = duration > 0 ? (progress / duration) * 100 : 0;
  const volumePct = Math.round(volume * 100);

  return (
    <div className="fixed inset-0 z-30 flex flex-col overflow-y-auto bg-base-deep px-6 pb-10 pt-6">
      <button
        onClick={onClose}
        aria-label="close"
        className="self-center p-2 text-ink-faint transition hover:text-ink-primary"
      >
        <svg width="28" height="16" viewBox="0 0 28 16" fill="none">
          <path
            d="M2 2l12 11L26 2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="mt-6 flex flex-1 flex-col items-center gap-8">
        {/* Album art — big rounded square, Spotify style */}
        <div
          className="aspect-square w-full max-w-[18rem] shrink-0 rounded-lg shadow-2xl shadow-black/60"
          style={{ backgroundImage: coverGradient(song?.id ?? "breakbeat") }}
        />

        <div className="w-full max-w-sm text-center">
          <h1 className="truncate text-2xl font-bold text-ink-primary">
            {song?.title ?? "breakbeat"}
          </h1>
          {song?.artist && (
            <p className="mt-1 truncate text-sm text-ink-muted">
              {song.artist}
            </p>
          )}
        </div>

        {/* Seek bar */}
        <div className="flex w-full max-w-sm flex-col gap-2">
          <div className="group relative h-1 w-full rounded-full bg-base-line">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-brand transition-[width] duration-150"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs tabular-nums text-ink-faint">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex w-full max-w-sm items-center justify-between">
          <button
            onClick={onToggleShuffle}
            aria-pressed={isShuffle}
            aria-label="shuffle"
            title="shuffle"
            className={`transition ${
              isShuffle
                ? "text-brand"
                : "text-ink-faint hover:text-ink-muted"
            }`}
          >
            <IconShuffle />
          </button>

          <button
            onClick={onPrev}
            aria-label="previous"
            className="text-ink-primary transition hover:scale-105"
          >
            <IconPrev />
          </button>

          <button
            onClick={onTogglePlay}
            aria-label={isPlaying ? "pause" : "play"}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-black transition hover:scale-105 hover:bg-brand-soft"
          >
            {isPlaying ? <IconPause /> : <IconPlay />}
          </button>

          <button
            onClick={onNext}
            aria-label="next"
            className="text-ink-primary transition hover:scale-105"
          >
            <IconNext />
          </button>

          {/* Volume */}
          <div className="flex w-20 items-center">
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              aria-label="volume"
              className="range-fill w-full"
              style={{ ["--fill" as string]: `${volumePct}%` }}
            />
          </div>
        </div>

        <SleepTimer
          remainingSeconds={timerRemaining}
          totalSeconds={timerTotal}
          isActive={timerActive}
          onStart={onStartTimer}
          onCancel={onCancelTimer}
        />

        {/* Queue */}
        <div className="w-full max-w-sm">
          <p className="border-b border-base-line pb-2 text-xs font-medium uppercase tracking-wider text-ink-muted">
            up next {queue.length > 0 ? `· ${queue.length}` : ""}
          </p>

          {queue.length === 0 ? (
            <p className="mt-3 text-xs text-ink-faint">
              queue is empty — tap the + on any song below to line it up next.
            </p>
          ) : (
            <ul className="mt-2">
              {queue.map((song, i) => (
                <li
                  key={`${song.id}-${i}`}
                  className="group flex items-center gap-3 rounded-md py-2 transition hover:bg-base-elevated/50"
                >
                  <div
                    className="h-9 w-9 shrink-0 rounded"
                    style={{ backgroundImage: coverGradient(song.id) }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink-primary">
                      {song.title}
                    </p>
                    {song.artist && (
                      <p className="truncate text-xs text-ink-faint">
                        {song.artist}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => onMoveQueueItem(i, -1)}
                    disabled={i === 0}
                    aria-label="move up"
                    className="p-1 text-ink-faint transition hover:text-ink-primary disabled:opacity-20"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => onMoveQueueItem(i, 1)}
                    disabled={i === queue.length - 1}
                    aria-label="move down"
                    className="p-1 text-ink-faint transition hover:text-ink-primary disabled:opacity-20"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => onRemoveFromQueue(i)}
                    aria-label="remove from queue"
                    className="p-1 text-ink-faint transition hover:text-brand"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}