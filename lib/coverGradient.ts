// Rich, saturated gradients so every song gets a distinct-looking tile
// without needing real album art. Spotify-like vibrancy, dark-friendly.
const GRADIENTS = [
  "linear-gradient(135deg, #1DB954 0%, #0A4D2E 100%)",
  "linear-gradient(135deg, #7C3AED 0%, #2E1065 100%)",
  "linear-gradient(135deg, #EC4899 0%, #831843 100%)",
  "linear-gradient(135deg, #F59E0B 0%, #7C2D12 100%)",
  "linear-gradient(135deg, #3B82F6 0%, #1E3A8A 100%)",
  "linear-gradient(135deg, #EF4444 0%, #7F1D1D 100%)",
  "linear-gradient(135deg, #14B8A6 0%, #134E4A 100%)",
  "linear-gradient(135deg, #A855F7 0%, #4C1D95 100%)",
  "linear-gradient(135deg, #22C55E 0%, #14532D 100%)",
  "linear-gradient(135deg, #0EA5E9 0%, #0C4A6E 100%)",
  "linear-gradient(135deg, #F97316 0%, #9A3412 100%)",
  "linear-gradient(135deg, #64748B 0%, #1E293B 100%)",
];

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function coverGradient(seed: string): string {
  return GRADIENTS[hashString(seed) % GRADIENTS.length];
}