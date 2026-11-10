import { motion } from "framer-motion";

export default function ScoreRing({ value = 0, size = 120, stroke = 10, label = "score" }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const id = `ring-${size}-${stroke}`;

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7c5cff" />
            <stop offset="60%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#5eead4" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgb(124 92 255 / 0.12)" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={`url(#${id})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (c * Math.min(value, 100)) / 100 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute text-center">
        <p className="font-display text-[length:calc(var(--s)*0.26)] font-extrabold leading-none text-ink" style={{ "--s": `${size}px` }}>
          {value}
        </p>
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-ink-soft">{label}</p>
      </div>
    </div>
  );
}
