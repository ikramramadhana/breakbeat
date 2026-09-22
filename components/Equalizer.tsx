export default function Equalizer({ playing }: { playing: boolean }) {
  return (
    <span
      className="flex h-4 w-4 items-end justify-center gap-[2px]"
      aria-hidden
    >
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className={`w-[2px] rounded-full bg-brand ${
            playing ? "animate-equalize" : "h-[20%] opacity-60"
          }`}
          style={{
            animationDelay: `${i * 0.15}s`,
            height: playing ? undefined : "20%",
          }}
        />
      ))}
    </span>
  );
}