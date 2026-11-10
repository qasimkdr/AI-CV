import { toBullets } from "./resumeData";

// Shared building blocks for resume templates. Templates are fixed-width documents
// (not responsive) so the preview, thumbnails and the printed PDF match.

export function Description({ text, className = "", bulletClass = "" }) {
  const items = toBullets(text);
  if (!items.length) return null;
  if (items.length === 1) return <p className={className}>{items[0]}</p>;
  return (
    <ul className={`space-y-1 ${className}`}>
      {items.map((item, i) => (
        <li key={i} className="flex gap-2">
          <span aria-hidden="true" className={`mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-current opacity-60 ${bulletClass}`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

const ICON_PATHS = {
  email: "M4 6h16v12H4z M4 7l8 6 8-6",
  phone: "M6.6 3h3l1.5 4-2 1.3a12 12 0 0 0 6.6 6.6l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.6 5.2 2 2 0 0 1 6.6 3z",
  address: "M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z M12 12.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  linkedin: "M4 4h16v16H4z M8 10v6 M8 7.5v.01 M12 16v-3.5a2 2 0 0 1 4 0V16 M12 10v6",
  github: "M9 19c-4 1.3-4-2-6-2.5m12 4.5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6.2 0C6.6 2.8 5.6 3.1 5.6 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4.2 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21",
};

export function ContactIcon({ type, className = "", style }) {
  return (
    <svg style={style} viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`} aria-hidden="true">
      <path d={ICON_PATHS[type]} />
    </svg>
  );
}

/** Base document wrapper: fixed A4-ish width, print-safe colours, no shadows. */
export function Page({ className = "", style, children }) {
  return (
    <article
      className={`resume-page mx-auto w-full max-w-[820px] bg-white text-[13px] leading-relaxed antialiased ${className}`}
      style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact", ...style }}
    >
      {children}
    </article>
  );
}
