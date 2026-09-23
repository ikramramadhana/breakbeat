// Remember the listening session between visits, so reopening the app puts
// you back where you left off — the last song cued at its last position,
// your volume, shuffle setting and "up next" queue restored.
//
// Everything is keyed off song IDs (never array indices) so it stays correct
// when rows are added, removed or reordered in Supabase between visits.
// Reads are wrapped defensively: a corrupted/partial entry must never break
// playback — worst case we fall back to fresh defaults.

const KEY = "breakbeat.session.v1";

export type SavedSession = {
  songId: string | null;
  progress: number;
  volume: number;
  isShuffle: boolean;
  queue: string[];
};

const DEFAULTS: SavedSession = {
  songId: null,
  progress: 0,
  volume: 0.8,
  isShuffle: false,
  queue: [],
};

// Reading localStorage during SSR or in a private window can throw; treat any
// failure as "no saved session" rather than letting it crash the app.
export function loadSession(): SavedSession {
  if (typeof window === "undefined") return { ...DEFAULTS };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULTS };

    const parsed = JSON.parse(raw) as Partial<SavedSession>;
    if (typeof parsed !== "object" || parsed === null) return { ...DEFAULTS };

    return {
      songId: typeof parsed.songId === "string" ? parsed.songId : null,
      progress:
        typeof parsed.progress === "number" && Number.isFinite(parsed.progress)
          ? Math.max(0, parsed.progress)
          : 0,
      volume:
        typeof parsed.volume === "number" &&
        Number.isFinite(parsed.volume) &&
        parsed.volume >= 0 &&
        parsed.volume <= 1
          ? parsed.volume
          : DEFAULTS.volume,
      isShuffle: typeof parsed.isShuffle === "boolean" ? parsed.isShuffle : false,
      queue:
        Array.isArray(parsed.queue)
          ? parsed.queue.filter((id): id is string => typeof id === "string")
          : [],
    };
  } catch {
    return { ...DEFAULTS };
  }
}

// Writing is best-effort too — storage can be full or disabled.
export function saveSession(session: SavedSession): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(session));
  } catch {
    /* ignore — persistence is a nicety, never a requirement */
  }
}
