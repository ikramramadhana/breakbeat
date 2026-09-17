export default function BreathingOrb({ active }: { active: boolean }) {
  return (
    <div className="relative flex h-40 w-40 items-center justify-center sm:h-48 sm:w-48">
      <div
        className={`absolute inset-0 rounded-full bg-glow/10 blur-2xl ${
          active ? "animate-breathe" : ""
        }`}
      />
      <div
        className={`absolute inset-6 rounded-full border border-glow/25 ${
          active ? "animate-breathe" : ""
        }`}
        style={{ animationDelay: "0.3s" }}
      />
      <div
        className={`absolute inset-12 rounded-full border border-glow/40 ${
          active ? "animate-breathe" : ""
        }`}
        style={{ animationDelay: "0.6s" }}
      />
      <div className="h-3 w-3 rounded-full bg-glow shadow-[0_0_18px_4px_rgba(232,185,117,0.5)]" />
    </div>
  );
}
