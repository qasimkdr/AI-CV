import { Link } from "react-router-dom";

export function LogoMark({ size = 40 }) {
  return (
    <span
      className="relative grid shrink-0 place-items-center rounded-[30%] bg-brand text-white shadow-[0_10px_24px_-10px_rgb(124_92_255/0.8)]"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span className="absolute inset-[2px] rounded-[28%] bg-gradient-to-b from-white/35 to-transparent" />
      <svg
        viewBox="0 0 24 24"
        width={size * 0.52}
        height={size * 0.52}
        fill="none"
        className="relative"
      >
        <path
          d="M7 3.5h6.5L18 8v11a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19V5A1.5 1.5 0 0 1 7.5 3.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M12.2 10.2l.75 1.85 1.85.75-1.85.75-.75 1.85-.75-1.85-1.85-.75 1.85-.75.75-1.85Z"
          fill="currentColor"
        />
        <path d="M9 17h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export default function Logo({ to = "/", size = 40, className = "" }) {
  return (
    <Link
      to={to}
      aria-label="AI CV home"
      className={`group inline-flex items-center gap-2.5 ${className}`}
    >
      <span className="transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-105">
        <LogoMark size={size} />
      </span>
      <span className="font-display text-xl font-extrabold tracking-tight text-ink">
        AI<span className="text-gradient"> CV</span>
      </span>
    </Link>
  );
}
