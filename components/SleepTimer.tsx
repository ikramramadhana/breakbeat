"use client";

import { useState } from "react";
import { formatTime } from "@/lib/shuffle";

const PRESETS = [15, 30, 45, 60];

export default function SleepTimer({
  remainingSeconds,
  totalSeconds,
  isActive,
  onStart,
  onCancel,
}: {
  remainingSeconds: number;
  totalSeconds: number;
  isActive: boolean;
  onStart: (minutes: number) => void;
  onCancel: () => void;
}) {
  const [customOpen, setCustomOpen] = useState(false);
  const [customValue, setCustomValue] = useState("20");

  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const progress = isActive && totalSeconds > 0 ? remainingSeconds / totalSeconds : 0;
  const dashoffset = circumference * (1 - progress);

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      <div className="flex items-center gap-3">
        <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke="#2A2A2A"
            strokeWidth="3"
          />
          {isActive && (
            <circle
              cx="32"
              cy="32"
              r={radius}
              fill="none"
              stroke="#1DB954"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashoffset}
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          )}
        </svg>

        <div className="text-sm text-ink-muted">
          {isActive ? (
            <div className="flex flex-col">
              <span className="font-medium text-ink-primary">
                {formatTime(remainingSeconds)}
              </span>
              <button
                onClick={onCancel}
                className="text-left text-xs text-ink-faint transition hover:text-brand"
              >
                cancel timer
              </button>
            </div>
          ) : (
            <span>no sleep timer set</span>
          )}
        </div>
      </div>

      {!isActive && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {PRESETS.map((m) => (
            <button
              key={m}
              onClick={() => onStart(m)}
              className="rounded-full border border-base-line px-3 py-1 text-xs text-ink-muted transition hover:border-brand hover:text-brand"
            >
              {m}m
            </button>
          ))}
          {!customOpen ? (
            <button
              onClick={() => setCustomOpen(true)}
              className="rounded-full border border-base-line px-3 py-1 text-xs text-ink-muted transition hover:border-brand hover:text-brand"
            >
              custom
            </button>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const n = parseInt(customValue, 10);
                if (n > 0) onStart(n);
                setCustomOpen(false);
              }}
              className="flex items-center gap-1"
            >
              <input
                autoFocus
                type="number"
                min={1}
                max={240}
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                className="w-14 rounded-full border border-base-line bg-transparent px-2 py-1 text-xs text-ink-primary outline-none focus:border-brand"
              />
              <span className="text-xs text-ink-faint">min</span>
            </form>
          )}
        </div>
      )}
    </div>
  );
}