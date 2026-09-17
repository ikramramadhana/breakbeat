// Small set of on-brand gradients (built only from the palette already in
// tailwind.config.js) so every song gets a distinct-looking tile without
// needing real album art or drifting into random, clashing hues.
const GRADIENTS = [
  "linear-gradient(135deg, #E8B975 0%, #8A6A3F 100%)",
  "linear-gradient(135deg, #5B7A9D 0%, #1A2338 100%)",
  "linear-gradient(135deg, #7C97B5 0%, #252E45 100%)",
  "linear-gradient(135deg, #F2CC94 0%, #5B7A9D 100%)",
  "linear-gradient(135deg, #8A6A3F 0%, #141B2E 100%)",
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
