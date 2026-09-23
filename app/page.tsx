"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase, type Song } from "@/lib/supabase";
import { shuffledIndices } from "@/lib/shuffle";
import { loadSession, saveSession, type SavedSession } from "@/lib/session";
import SongRow from "@/components/SongRow";
import PlayerBar from "@/components/PlayerBar";
import NowPlaying from "@/components/NowPlaying";

const FADE_SECONDS = 20;

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  const [isShuffle, setIsShuffle] = useState(false);
  const shuffleOrderRef = useRef<number[]>([]);
  const shufflePosRef = useRef(0);

  const [manualQueue, setManualQueue] = useState<string[]>([]);
  const [nowPlayingOpen, setNowPlayingOpen] = useState(false);

  const [timerActive, setTimerActive] = useState(false);
  const [timerTotal, setTimerTotal] = useState(0);
  const [timerRemaining, setTimerRemaining] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Session persistence — restored once the library has loaded (see the load
  // effect below) and written back whenever any of these values change.
  // Until the restore has run we hold off on saving, so the initial defaults
  // can't overwrite the stored session before it's been read.
  const hydratedRef = useRef(false);
  const resumeTimeRef = useRef(0);
  const lastSavedRef = useRef<SavedSession | null>(null);
  const lastProgressSaveAtRef = useRef(0);

  // load songs
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data, error } = await supabase
        .from("songs")
        .select("*")
        .order("sort_order", { ascending: true, nullsFirst: false })
        .order("title", { ascending: true });
      if (cancelled) return;
      if (error) {
        setLoadError(error.message);
      } else {
        setSongs(data ?? []);

        // Restore the previous session: cue the last song at its last
        // position and bring back the volume, shuffle and queue. We only
        // restore values that still exist in the library; anything whose id
        // is no longer there is dropped.
        if (!hydratedRef.current) {
          const saved = loadSession();
          const ids = new Set((data ?? []).map((s) => s.id));
          if (saved.songId && ids.has(saved.songId)) {
            const idx = (data ?? []).findIndex((s) => s.id === saved.songId);
            if (idx !== -1) {
              setCurrentIndex(idx);
              resumeTimeRef.current = saved.progress;
            }
          }
          if (saved.volume >= 0 && saved.volume <= 1) setVolume(saved.volume);
          if (saved.isShuffle && (data ?? []).length > 0) {
            const order = shuffledIndices((data ?? []).length, undefined);
            if (saved.songId && ids.has(saved.songId)) {
              const idx = (data ?? []).findIndex((s) => s.id === saved.songId);
              if (idx !== -1) {
                const pos = order.indexOf(idx);
                if (pos !== -1) {
                  order.splice(pos, 1);
                  order.unshift(idx);
                }
              }
            }
            shuffleOrderRef.current = order;
            shufflePosRef.current = 0;
            setIsShuffle(true);
          }
          const validQueue = saved.queue.filter((id) => ids.has(id));
          if (validQueue.length > 0) setManualQueue(validQueue);
          hydratedRef.current = true;
        }
      }
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const currentSong = currentIndex !== null ? songs[currentIndex] : null;
  const queueSongs = manualQueue
    .map((id) => songs.find((s) => s.id === id))
    .filter((s): s is Song => !!s);

  const playIndex = useCallback((index: number) => {
    setCurrentIndex(index);
    // A user-initiated jump to this song always starts it at the beginning —
    // clear any position carried over from the previous session or track.
    resumeTimeRef.current = 0;
    requestAnimationFrame(() => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.play().catch(() => {});
    });
    setIsPlaying(true);
  }, []);

  const playSong = useCallback(
    (id: string) => {
      const idx = songs.findIndex((s) => s.id === id);
      if (idx === -1) return;
      if (isShuffle) {
        const order = shuffledIndices(songs.length, idx);
        const pos = order.indexOf(idx);
        order.splice(pos, 1);
        order.unshift(idx);
        shuffleOrderRef.current = order;
        shufflePosRef.current = 0;
      }
      playIndex(idx);
    },
    [songs, isShuffle, playIndex]
  );

  const addToQueue = useCallback((id: string) => {
    setManualQueue((q) => [...q, id]);
  }, []);

  const removeFromQueue = useCallback((index: number) => {
    setManualQueue((q) => q.filter((_, i) => i !== index));
  }, []);

  const moveQueueItem = useCallback((index: number, direction: -1 | 1) => {
    setManualQueue((q) => {
      const next = [...q];
      const target = index + direction;
      if (target < 0 || target >= next.length) return q;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }, []);

  const goNext = useCallback(() => {
    if (manualQueue.length > 0) {
      const nextId = manualQueue[0];
      const idx = songs.findIndex((s) => s.id === nextId);
      setManualQueue((q) => q.slice(1));
      if (idx !== -1) {
        playIndex(idx);
        return;
      }
    }
    if (songs.length === 0) return;
    if (isShuffle) {
      const order = shuffleOrderRef.current;
      const nextPos = shufflePosRef.current + 1;
      if (nextPos >= order.length) {
        const fresh = shuffledIndices(songs.length, currentIndex ?? undefined);
        shuffleOrderRef.current = fresh;
        shufflePosRef.current = 0;
        playIndex(fresh[0]);
      } else {
        shufflePosRef.current = nextPos;
        playIndex(order[nextPos]);
      }
    } else {
      const next = currentIndex === null ? 0 : (currentIndex + 1) % songs.length;
      playIndex(next);
    }
  }, [manualQueue, songs, isShuffle, currentIndex, playIndex]);

  const goPrev = useCallback(() => {
    if (songs.length === 0) return;
    if (isShuffle) {
      const prevPos = shufflePosRef.current - 1;
      if (prevPos >= 0) {
        shufflePosRef.current = prevPos;
        playIndex(shuffleOrderRef.current[prevPos]);
      }
    } else {
      const prev =
        currentIndex === null ? 0 : (currentIndex - 1 + songs.length) % songs.length;
      playIndex(prev);
    }
  }, [songs.length, isShuffle, currentIndex, playIndex]);

  const toggleShuffle = useCallback(() => {
    setIsShuffle((was) => {
      const now = !was;
      if (now && songs.length > 0) {
        const order = shuffledIndices(songs.length, currentIndex ?? undefined);
        if (currentIndex !== null) {
          const pos = order.indexOf(currentIndex);
          if (pos !== -1) {
            order.splice(pos, 1);
            order.unshift(currentIndex);
          }
        }
        shuffleOrderRef.current = order;
        shufflePosRef.current = 0;
      }
      return now;
    });
  }, [songs.length, currentIndex]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (currentIndex === null && songs.length > 0) {
      playIndex(0);
      return;
    }
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [isPlaying, currentIndex, songs.length, playIndex]);

  // Seek: jump to an exact time within the current track (e.g. straight to
  // the chorus). Falls back to the last known duration if metadata is still
  // loading, and is a no-op when we don't know how long the track is.
  const seek = useCallback(
    (time: number) => {
      const audio = audioRef.current;
      if (!audio) return;
      const max = audio.duration || duration;
      if (!(max > 0) || !Number.isFinite(time)) return;
      const clamped = Math.max(0, Math.min(time, max));
      audio.currentTime = clamped;
      setProgress(clamped);
      // A scrub fires many times mid-drag; only persist the final resting
      // position, otherwise we'd stamp every intermediate point along the way.
      lastProgressSaveAtRef.current = Date.now();
      lastSavedRef.current = {
        songId: currentSong?.id ?? null,
        progress: clamped,
        volume,
        isShuffle,
        queue: manualQueue,
      };
      saveSession(lastSavedRef.current);
    },
    [duration, currentSong, volume, isShuffle, manualQueue]
  );

  // keep audio element volume in sync when not mid-fade
  useEffect(() => {
    if (audioRef.current && !timerActive) {
      audioRef.current.volume = volume;
    }
  }, [volume, timerActive]);

  // sleep timer countdown + fade-out
  useEffect(() => {
    if (!timerActive) return;
    const interval = setInterval(() => {
      setTimerRemaining((prev) => {
        const next = prev - 1;
        const audio = audioRef.current;
        if (audio) {
          if (next <= FADE_SECONDS && next > 0) {
            audio.volume = Math.max(0, volume * (next / FADE_SECONDS));
          }
          if (next <= 0) {
            audio.pause();
            audio.volume = volume;
            setIsPlaying(false);
          }
        }
        if (next <= 0) {
          setTimerActive(false);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, volume]);

  const startTimer = useCallback((minutes: number) => {
    const seconds = minutes * 60;
    setTimerTotal(seconds);
    setTimerRemaining(seconds);
    setTimerActive(true);
  }, []);

  const cancelTimer = useCallback(() => {
    setTimerActive(false);
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Persist the session so reopening the app puts you back where you left
  // off: the last song and position, volume, shuffle and the "up next"
  // queue. Skipped until the restore above has run. Progress is throttled —
  // onTimeUpdate fires several times a second, so we only write it every
  // couple of seconds and on pause/seek/leave (see flush below).
  useEffect(() => {
    if (!hydratedRef.current) return;
    const now = Date.now();
    const progressChanged = lastSavedRef.current?.progress !== progress;
    if (
      progressChanged &&
      now - lastProgressSaveAtRef.current < 2500 &&
      lastSavedRef.current?.songId === currentSong?.id
    ) {
      return; // too soon; position is flushed on pause / hidden / unload
    }
    if (progressChanged) lastProgressSaveAtRef.current = now;
    const next: SavedSession = {
      songId: currentSong?.id ?? null,
      progress,
      volume,
      isShuffle,
      queue: manualQueue,
    };
    // Avoid churning localStorage when nothing actually changed.
    if (
      lastSavedRef.current &&
      lastSavedRef.current.songId === next.songId &&
      lastSavedRef.current.progress === next.progress &&
      lastSavedRef.current.volume === next.volume &&
      lastSavedRef.current.isShuffle === next.isShuffle &&
      lastSavedRef.current.queue.length === next.queue.length &&
      lastSavedRef.current.queue.every((id, i) => id === next.queue[i])
    ) {
      return;
    }
    lastSavedRef.current = next;
    saveSession(next);
  }, [currentSong, progress, volume, isShuffle, manualQueue]);

  // Flush the current position when the page is hidden or closing — progress
  // only saves periodically otherwise, so this catches a pause-then-leave and
  // always stores the exact spot you stopped at.
  useEffect(() => {
    function flush() {
      const audio = audioRef.current;
      saveSession({
        songId: currentSong?.id ?? null,
        progress: audio?.currentTime ?? progress,
        volume,
        isShuffle,
        queue: manualQueue,
      });
    }
    function onVisibilityChange() {
      if (document.visibilityState === "hidden") flush();
    }
    window.addEventListener("beforeunload", flush);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("beforeunload", flush);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [currentSong, progress, volume, isShuffle, manualQueue]);

  // Media Session: lock-screen / notification playback controls, and it
  // signals the browser this is real media playback (helps it survive in
  // the background instead of being treated like a random silent tab).
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    if (currentSong) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentSong.title,
        artist: currentSong.artist ?? "breakbeat",
        album: "breakbeat",
      });
    }
    navigator.mediaSession.setActionHandler("play", () => togglePlay());
    navigator.mediaSession.setActionHandler("pause", () => togglePlay());
    navigator.mediaSession.setActionHandler("previoustrack", () => goPrev());
    navigator.mediaSession.setActionHandler("nexttrack", () => goNext());
  }, [currentSong, togglePlay, goPrev, goNext]);

  useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
    }
  }, [isPlaying]);

  const progressPct = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <main className="relative min-h-screen">
      <div className="mx-auto w-full max-w-sm px-5 pb-28 pt-8">
        <div className="flex items-baseline justify-between gap-3">
          <div>
            <h1 className="text-xs font-medium tracking-wide text-ink-faint">
              breakbeat
            </h1>
            <p className="mt-1 text-xl font-bold text-ink-primary">
              your music, no ads, no rush
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-base-line px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-ink-faint">
            @ikramramadhana
          </span>
        </div>

        <div className="mt-8">
          <p className="pb-2 text-xs font-medium uppercase tracking-wider text-ink-muted">
            songs
          </p>

          {loading && (
            <div className="mt-4 flex flex-col gap-2">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-md px-2 py-2"
                >
                  <div className="h-11 w-11 shrink-0 animate-pulse rounded-md bg-base-elevated" />
                  <div className="flex-1">
                    <div className="h-3.5 w-3/4 animate-pulse rounded bg-base-elevated" />
                    <div className="mt-2 h-2.5 w-1/2 animate-pulse rounded bg-base-elevated" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && loadError && (
            <div className="mt-4 text-sm text-ink-muted">
              <p>couldn't reach your music.</p>
              <p className="mt-1 text-xs text-ink-faint">{loadError}</p>
            </div>
          )}

          {!loading && !loadError && songs.length === 0 && (
            <div className="mt-4 text-sm text-ink-muted">
              <p>no songs yet.</p>
              <p className="mt-1 text-xs text-ink-faint">
                add rows to the{" "}
                <span className="text-ink-muted">songs</span> table in
                Supabase to see them here.
              </p>
            </div>
          )}

          {!loading &&
            !loadError &&
            songs.map((song) => (
              <SongRow
                key={song.id}
                song={song}
                isActive={song.id === currentSong?.id}
                isPlaying={isPlaying}
                onPlay={() => playSong(song.id)}
                onAddToQueue={() => addToQueue(song.id)}
              />
            ))}
        </div>
      </div>

      <PlayerBar
        song={currentSong}
        isPlaying={isPlaying}
        progressPct={progressPct}
        onTogglePlay={togglePlay}
        onNext={goNext}
        onExpand={() => setNowPlayingOpen(true)}
        onSeek={seek}
        duration={duration}
      />

      {nowPlayingOpen && (
        <NowPlaying
          song={currentSong}
          isPlaying={isPlaying}
          isShuffle={isShuffle}
          progress={progress}
          duration={duration}
          volume={volume}
          queue={queueSongs}
          onClose={() => setNowPlayingOpen(false)}
          onTogglePlay={togglePlay}
          onNext={goNext}
          onPrev={goPrev}
          onToggleShuffle={toggleShuffle}
          onVolumeChange={setVolume}
          onSeek={seek}
          timerRemaining={timerRemaining}
          timerTotal={timerTotal}
          timerActive={timerActive}
          onStartTimer={startTimer}
          onCancelTimer={cancelTimer}
          onRemoveFromQueue={removeFromQueue}
          onMoveQueueItem={moveQueueItem}
        />
      )}

      <audio
        ref={audioRef}
        src={currentSong?.file_url}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration);
          // Cue the restored position once the track's metadata is known —
          // currentTime can only be set once we know how long the track is.
          // Consumed once so a fresh tap on this song always starts at 0.
          if (resumeTimeRef.current > 0) {
            const target = resumeTimeRef.current;
            resumeTimeRef.current = 0;
            const d = e.currentTarget.duration;
            if (d && Number.isFinite(d) && target < d) {
              e.currentTarget.currentTime = target;
              setProgress(target);
            }
          }
        }}
        onEnded={goNext}
      />
    </main>
  );
}
