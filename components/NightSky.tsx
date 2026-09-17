const STARS = [
  { top: "12%", left: "18%", size: 2, delay: "0s", opacity: 0.5 },
  { top: "22%", left: "78%", size: 1.5, delay: "1.2s", opacity: 0.35 },
  { top: "8%", left: "52%", size: 1.5, delay: "2.4s", opacity: 0.4 },
  { top: "34%", left: "8%", size: 1.5, delay: "0.6s", opacity: 0.3 },
  { top: "40%", left: "90%", size: 2, delay: "3s", opacity: 0.45 },
  { top: "62%", left: "14%", size: 1.5, delay: "1.8s", opacity: 0.3 },
  { top: "70%", left: "85%", size: 2, delay: "2.1s", opacity: 0.4 },
  { top: "18%", left: "35%", size: 1, delay: "3.6s", opacity: 0.25 },
  { top: "50%", left: "60%", size: 1.5, delay: "0.9s", opacity: 0.35 },
  { top: "85%", left: "45%", size: 1.5, delay: "1.5s", opacity: 0.3 },
];

export default function NightSky() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden"
    >
      {STARS.map((star, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-ink-primary animate-drift"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animationDelay: star.delay,
            animationDuration: `${5 + (i % 4)}s`,
          }}
        />
      ))}
    </div>
  );
}
