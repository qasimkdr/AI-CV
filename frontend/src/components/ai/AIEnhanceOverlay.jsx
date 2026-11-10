import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Sparkles, X } from "lucide-react";

const AuroraScene = lazy(() => import("./AuroraScene"));

// Aurora palette only — no purple/violet anywhere in this experience.
const GRADIENT = "linear-gradient(100deg, #0d9488 0%, #06b6d4 35%, #0ea5e9 60%, #f59e0b 100%)";

const STAGES = [
  "Reading your experience…",
  "Understanding your field…",
  "Finding stronger action verbs…",
  "Highlighting measurable impact…",
  "Matching recruiter keywords…",
  "Tightening every sentence…",
  "Polishing your summary…",
  "Final quality check…",
];

const UPGRADES = [
  ["worked on", "spearheaded"],
  ["helped", "championed"],
  ["responsible for", "led"],
  ["did", "delivered"],
  ["made", "designed"],
  ["handled", "managed"],
  ["assisted", "supported"],
  ["improved", "accelerated"],
  ["was part of", "collaborated on"],
  ["in charge of", "directed"],
];

// Fixed slots around the centre (percent positions).
const SLOTS = [
  [12, 22],
  [80, 18],
  [8, 58],
  [86, 54],
  [18, 82],
  [76, 84],
  [24, 38],
  [76, 36],
];

function WordChip({ pair, slot, delay }) {
  const [upgraded, setUpgraded] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setUpgraded(true), 900 + delay);
    return () => clearTimeout(id);
  }, [delay]);

  return (
    <motion.div
      className="absolute hidden -translate-x-1/2 -translate-y-1/2 sm:block"
      style={{ left: `${slot[0]}%`, top: `${slot[1]}%` }}
      initial={{ opacity: 0, scale: 0.6, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
      exit={{ opacity: 0, scale: 0.6 }}
      transition={{ opacity: { duration: 0.4, delay: delay / 1000 }, scale: { duration: 0.4, delay: delay / 1000 }, y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
    >
      <div className="flex items-center gap-2 rounded-2xl border border-white/80 bg-white/70 px-4 py-2 text-sm font-medium shadow-[0_12px_30px_-16px_rgba(13,148,136,.55)] backdrop-blur-xl">
        <span className={`transition duration-500 ${upgraded ? "text-slate-400 line-through decoration-rose-400/70" : "text-slate-700"}`}>{pair[0]}</span>
        <AnimatePresence>
          {upgraded && (
            <motion.span initial={{ opacity: 0, x: -8, filter: "blur(4px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} className="flex items-center gap-1.5 font-semibold">
              <span className="text-teal-500">→</span>
              <span style={{ backgroundImage: GRADIENT, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{pair[1]}</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function ProgressRing({ value, done }) {
  const size = 76;
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="aurora-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#14b8a6" />
            <stop offset="55%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(20,184,166,.15)" strokeWidth={stroke} fill="none" />
        <motion.circle cx={size / 2} cy={size / 2} r={r} stroke="url(#aurora-ring)" strokeWidth={stroke} strokeLinecap="round" fill="none" strokeDasharray={c} animate={{ strokeDashoffset: c - c * value }} transition={{ duration: 0.6 }} />
      </svg>
      <span className="absolute font-display text-lg font-extrabold text-slate-800">
        {done ? <Check size={26} className="text-emerald-500" strokeWidth={3} /> : `${Math.round(value * 100)}%`}
      </span>
    </div>
  );
}

const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/**
 * Full-screen "AI at work" experience shown while Gemini rewrites the resume.
 * status: "working" | "done"
 */
export default function AIEnhanceOverlay({ status, resume, onCancel }) {
  const reduce = useReducedMotion();
  const [elapsed, setElapsed] = useState(0);
  const [stage, setStage] = useState(0);
  const done = status === "done";

  useEffect(() => {
    if (done) return;
    const start = Date.now() - elapsed * 1000;
    const id = setInterval(() => setElapsed((Date.now() - start) / 1000), 200);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  useEffect(() => {
    if (done) return;
    const id = setInterval(() => setStage((s) => (s + 1) % STAGES.length), 2600);
    return () => clearInterval(id);
  }, [done]);

  // Lock page scroll while open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const progress = done ? 1 : Math.min(0.94, 1 - Math.exp(-elapsed / 9));

  // Prefer weak phrases actually found in the resume, then common ones.
  const pairs = useMemo(() => {
    const text = [resume?.summary, ...(resume?.experience || []).map((e) => e?.description), ...(resume?.projects || []).map((p) => p?.description)].join(" ").toLowerCase();
    const found = UPGRADES.filter(([weak]) => text.includes(weak));
    return [...found, ...UPGRADES.filter((p) => !found.includes(p))].slice(0, SLOTS.length);
  }, [resume]);

  // Cycle which chips are visible so the scene keeps changing.
  const [wave, setWave] = useState(0);
  useEffect(() => {
    if (done) return;
    const id = setInterval(() => setWave((w) => w + 1), 4200);
    return () => clearInterval(id);
  }, [done]);
  const visible = SLOTS.map((slot, i) => ({ slot, pair: pairs[(i + wave * 3) % pairs.length], key: `${wave}-${i}`, delay: i * 260 })).filter((_, i) => (i + wave) % 2 === 0 || i < 4);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="AI is enhancing your resume"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="fixed inset-0 z-[90] overflow-hidden"
      style={{
        background:
          "radial-gradient(60rem 40rem at 15% 10%, rgba(153,246,228,.55), transparent 60%), radial-gradient(50rem 36rem at 90% 15%, rgba(186,230,253,.6), transparent 60%), radial-gradient(44rem 32rem at 75% 95%, rgba(253,230,138,.5), transparent 60%), radial-gradient(40rem 30rem at 5% 90%, rgba(167,243,208,.5), transparent 60%), #f7fdfc",
      }}
    >
      {/* 3D scene */}
      {!reduce && (
        <div className="absolute inset-0">
          <Suspense fallback={null}>
            <AuroraScene done={done} />
          </Suspense>
        </div>
      )}
      {reduce && (
        <motion.div
          aria-hidden="true"
          className="absolute inset-0"
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 12, repeat: Infinity }}
          style={{ backgroundImage: "linear-gradient(120deg, rgba(20,184,166,.18), rgba(14,165,233,.18), rgba(245,158,11,.18))", backgroundSize: "200% 200%" }}
        />
      )}

      {/* Floating word upgrades */}
      {!reduce && !done && (
        <div className="pointer-events-none absolute inset-0">
          <AnimatePresence>
            {visible.map((v) => (
              <WordChip key={v.key} pair={v.pair} slot={v.slot} delay={v.delay} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Title */}
      <div className="pointer-events-none absolute inset-x-0 top-8 px-4 text-center sm:top-12">
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-white bg-white/70 px-4 py-1.5 text-xs font-semibold tracking-wide text-teal-700 shadow-sm backdrop-blur-xl"
        >
          <Sparkles size={13} className="animate-spin text-amber-500 [animation-duration:4s]" />
          AI Resume Studio
        </motion.span>
        <motion.h2 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-4 text-3xl font-extrabold text-slate-900 sm:text-5xl">
          {done ? (
            "Your resume just levelled up"
          ) : (
            <>
              Enhancing your{" "}
              <span className="bg-[length:200%_auto] [animation:gradient-pan_6s_ease_infinite]" style={{ backgroundImage: GRADIENT, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                resume
              </span>
            </>
          )}
        </motion.h2>
      </div>

      {/* Status card */}
      <div className="absolute inset-x-0 bottom-6 flex justify-center px-4 sm:bottom-10">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 160, damping: 20 }}
          className="flex w-full max-w-lg items-center gap-5 rounded-[1.75rem] border border-white bg-white/75 p-4 pr-5 shadow-[0_30px_70px_-30px_rgba(13,148,136,.55)] backdrop-blur-2xl"
        >
          <ProgressRing value={progress} done={done} />
          <div className="min-w-0 flex-1">
            <AnimatePresence mode="wait">
              <motion.p
                key={done ? "done" : stage}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="line-clamp-2 font-display text-base font-bold leading-snug text-slate-800 sm:truncate sm:text-lg"
              >
                {done ? "Done! Preparing your review…" : STAGES[stage]}
              </motion.p>
            </AnimatePresence>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-teal-100">
              <motion.div className="h-full rounded-full" style={{ backgroundImage: GRADIENT }} animate={{ width: `${progress * 100}%` }} transition={{ duration: 0.6 }} />
            </div>
            <p className="mt-1.5 text-xs text-slate-500">
              {fmt(elapsed)} elapsed · Free AI can take up to a minute
            </p>
          </div>
          {!done && (
            <button type="button" onClick={onCancel} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-rose-200 hover:text-rose-500" aria-label="Cancel enhancement">
              <X size={18} />
            </button>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
