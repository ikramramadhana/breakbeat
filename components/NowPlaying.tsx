"use client";

import type { Song } from "@/lib/supabase";
import { formatTime } from "@/lib/shuffle";
import BreathingOrb from "@/components/BreathingOrb";
import SleepTimer from "@/components/SleepTimer";
import { coverGradient } from "@/lib/coverGradient";

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

  return (
    <div className="fixed inset-0 z-30 flex flex-col overflow-y-auto bg-night-deep px-6 pb-10 pt-6">
      <button
        onClick={onClose}
        aria-label="close"
        className="self-center text-ink-faint"
      >
        <svg width="28" height="16" viewBox="0 0 28 16" fill="none">
          <path
            d="M2 2l12 11L26 2"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="mt-6 flex flex-col items-center gap-8">
        <BreathingOrb active={isPlaying} />

        <div className="text-center">
          <h1 className="font-display text-2xl italic text-ink-primary">
            {song?.title ?? "breakbeat"}
          </h1>
          {song?.artist && (
            <p className="mt-1 text-sm text-ink-muted">{song.artist}</p>
          )}
        </div>

        <div className="flex w-full max-w-sm flex-col gap-2">
          <div className="h-[3px] w-full overflow-hidden rounded-full bg-night-line">
            <div
              className="h-full bg-glow transition-[width]"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-ink-faint">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={onToggleShuffle}
            aria-pressed={isShuffle}
            title="shuffle"
            className={`text-sm transition ${
              isShuffle ? "text-glow" : "text-ink-faint hover:text-ink-muted"
            }`}
          >
            shuffle
          </button>

          <button
            onClick={onPrev}
            aria-label="previous"
            className="text-2xl text-ink-muted transition hover:text-ink-primary"
          >
            ‹
          </button>

          <button
            onClick={onTogglePlay}
            aria-label={isPlaying ? "pause" : "play"}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-glow/40 text-glow transition hover:bg-glow/10"
          >
            {isPlaying ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="2" y="1" width="4" height="14" rx="1" />
                <rect x="10" y="1" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M3 1.5v13l11-6.5-11-6.5z" />
              </svg>
            )}
          </button>

          <button
            onClick={onNext}
            aria-label="next"
            className="text-2xl text-ink-muted transition hover:text-ink-primary"
          >
            ›
          </button>

          <div className="w-16">
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              aria-label="volume"
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

        <div className="w-full max-w-sm">
          <p className="border-b border-night-line pb-2 text-xs text-ink-muted">
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
                  className="flex items-center gap-2 py-2"
                >
                  <div
                    className="h-8 w-8 shrink-0 rounded"
                    style={{ backgroundImage: coverGradient(song.id) }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-sm italic text-ink-primary">
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
                    className="text-ink-faint transition hover:text-ink-primary disabled:opacity-20"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => onMoveQueueItem(i, 1)}
                    disabled={i === queue.length - 1}
                    aria-label="move down"
                    className="text-ink-faint transition hover:text-ink-primary disabled:opacity-20"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => onRemoveFromQueue(i)}
                    aria-label="remove from queue"
                    className="text-ink-faint transition hover:text-glow"
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
