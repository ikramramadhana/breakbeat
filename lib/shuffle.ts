export function shuffledIndices(length: number, avoidFirst?: number): number[] {
  const arr = Array.from({ length }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  // if the shuffle happens to put the currently playing track first, nudge it
  if (avoidFirst !== undefined && arr.length > 1 && arr[0] === avoidFirst) {
    [arr[0], arr[1]] = [arr[1], arr[0]];
  }
  return arr;
}

export function formatTime(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "0:00";
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
