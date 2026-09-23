# breakbeat

A quiet, ad-free player for your own music, built for falling asleep. A real
queue you control, shuffle, and a sleep timer that fades the volume out
before it stops — no ads, no algorithm, no login.

Your songs live in **Supabase** (Postgres table + Storage bucket). You add
them from the Supabase dashboard; the app only reads and plays them.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → **New project**. Free tier is enough.
2. Open **SQL Editor → New query**, paste the contents of `supabase-schema.sql`
   from this repo, and run it. This creates a `songs` table with public read
   access (read-only — the app never writes to it).

## 2. Upload your songs

1. In the Supabase dashboard, go to **Storage → New bucket**. Name it
   `songs` and toggle **Public bucket** on (so the audio files can be
   streamed straight into the browser).
2. Upload your audio files (mp3, m4a, wav, etc.) into that bucket.
3. For each file, click it → **Copy URL** to get its public URL.
4. Go to **Table Editor → songs → Insert row**, and fill in `title`,
   `artist` (optional), and `file_url` (the URL you just copied).

Add more songs any time straight from the dashboard — no upload page needed.

## 3. Get your API keys

In Supabase: **Project Settings → API Keys**. You need the **Project URL**
and the **anon / public** key.

## 4. Run it locally

```bash
npm install
cp .env.local.example .env.local
# then paste your Project URL and anon key into .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 5. Deploy to Vercel

1. Push this folder to a GitHub repo (or run `vercel` from inside it with the
   [Vercel CLI](https://vercel.com/docs/cli)).
2. In the Vercel dashboard, **Import Project**, select the repo.
3. Under **Environment Variables**, add `NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Deploy. Every push to your main branch redeploys automatically.

## How it works

- **Library** — the main screen lists every song. Tap one to play it now, or
  tap the **+** to line it up in the queue without interrupting what's
  playing.
- **Mini player** — a bar pinned to the bottom, like a streaming app. Tap it
  (not the buttons) to open the full Now Playing screen.
- **Now Playing** — the expanded view: shuffle, previous/next, volume, the
  sleep timer, and your **Up next** queue, where you can reorder or remove
  tracks before they play. The progress bar on both the mini player and this
  screen is scrubbable — tap or drag it to jump to any part of a track.
- **Sleep timer** — pick a preset or a custom number of minutes. In the last
  20 seconds the volume fades to silence instead of cutting off abruptly,
  then playback pauses and your volume is restored for next time.
- **Shuffle** — picks a fresh random order each time you turn it on, and
  reshuffles once it's been through the whole list. It only affects the
  fallback order — songs you've explicitly queued always play next, in the
  order you put them.
- **It remembers where you stopped** — the last song, its position, your
  volume, shuffle setting and "up next" queue are saved in your browser and
  restored next time you open the app. The song is cued up where you left it,
  paused, so press play to carry on. Nothing is uploaded anywhere and there
  are still no accounts — it's a single entry in your browser's local
  storage, and it's dropped automatically if a song is removed from the
  library.

## Playing with the screen off / in the background

The app uses the **Media Session API**, so once a song is playing you'll get
proper lock-screen / notification-shade controls (title, artist, play,
pause, next, previous) instead of the browser just muting it. In practice:

- Locking the phone while the tab stays open in the background — normal use
  for a sleep timer — keeps playing on both Android (Chrome) and iOS
  (Safari).
- Switching to another app briefly is usually fine too, as long as you don't
  fully close the browser or swipe it away from the app switcher — if the
  browser itself gets killed, playback stops, same as any other website.
- For the most reliable, app-like feel, open the site and use your browser's
  **"Add to Home Screen"** option — it installs as a standalone icon
  (manifest + icon are already set up for this) and browsers tend to treat
  installed apps more gently when it comes to background playback.

This is still a website, not a native app, so it can't fully match Spotify's
guarantees on very aggressive battery-saver settings — but for a normal
night's sleep timer, it holds up.

## Notes

- Nothing is stored between visits (no accounts) — it's a single shared
  library, meant for just you.
- Built with Next.js 14 (App Router), Tailwind CSS, and `@supabase/supabase-js`.
