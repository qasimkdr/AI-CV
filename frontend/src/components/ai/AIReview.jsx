import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Sparkles, Undo2, X } from "lucide-react";

import { diffResume } from "../../lib/aiDiff";

const norm = (v) => (typeof v === "string" ? v.trim() : "");

function Lines({ text, muted }) {
  const lines = norm(text).split(/\n+/).filter(Boolean);
  if (!lines.length) return <p className="text-sm italic text-ink-soft">Empty</p>;
  return (
    <ul className={`space-y-1.5 text-sm ${muted ? "text-ink-soft" : "text-ink"}`}>
      {lines.map((l, i) => (
        <li key={i} className="flex gap-2">
          <span className={`mt-2 h-1 w-1 shrink-0 rounded-full ${muted ? "bg-ink-soft/50" : "bg-emerald-500"}`} />
          {l.replace(/^[-•*]\s*/, "")}
        </li>
      ))}
    </ul>
  );
}

function SkillsDiff({ before, after }) {
  const lower = new Set(before.map((s) => s.toLowerCase()));
  return (
    <div className="flex flex-wrap gap-1.5">
      {after.map((s) => (
        <span key={s} className={`rounded-full px-2.5 py-1 text-xs font-medium ${lower.has(s.toLowerCase()) ? "bg-white text-ink ring-1 ring-black/5" : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"}`}>
          {!lower.has(s.toLowerCase()) && "+ "}
          {s}
        </span>
      ))}
    </div>
  );
}

export default function AIReview({ original, enhanced, onApply, onClose, applying }) {
  const items = useMemo(() => diffResume(original, enhanced), [original, enhanced]);
  const [accepted, setAccepted] = useState(() => new Set(items.map((i) => i.key)));

  const toggle = (key) =>
    setAccepted((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[85] grid place-items-center bg-ink/25 p-3 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-label="Review AI suggestions">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 200, damping: 24 }}
        className="glass-strong flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-hidden rounded-[2rem]"
      >
        <header className="flex items-start gap-4 border-b border-violet/10 p-6">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white shadow-lg" style={{ backgroundImage: "linear-gradient(135deg,#14b8a6,#0ea5e9,#f59e0b)" }}>
            <Sparkles size={22} />
          </span>
          <div className="flex-1">
            <h2 className="text-2xl font-extrabold text-ink">Review AI suggestions</h2>
            <p className="text-sm text-ink-soft">
              {items.length ? `${items.length} improvement${items.length > 1 ? "s" : ""} found. Keep what you like — nothing is saved until you apply.` : "The AI didn't find anything to change. Your resume already reads well!"}
            </p>
          </div>
          <button type="button" onClick={onClose} className="btn btn-glass h-10 w-10 px-0" aria-label="Close">
            <X size={18} />
          </button>
        </header>

        {items.length > 0 && (
          <div className="flex items-center justify-between gap-3 px-6 pt-4 text-sm">
            <span className="text-ink-soft">
              {accepted.size} of {items.length} selected
            </span>
            <div className="flex gap-2">
              <button type="button" onClick={() => setAccepted(new Set(items.map((i) => i.key)))} className="font-semibold text-violet hover:underline">
                Select all
              </button>
              <span className="text-ink-soft/40">|</span>
              <button type="button" onClick={() => setAccepted(new Set())} className="font-semibold text-ink-soft hover:underline">
                None
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          <AnimatePresence initial={false}>
            {items.map((item, idx) => {
              const on = accepted.has(item.key);
              return (
                <motion.div key={item.key} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }} className={`rounded-3xl border p-5 transition ${on ? "border-emerald-200 bg-white/80" : "border-white bg-white/40"}`}>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="font-display font-bold text-ink">{item.label}</h3>
                    <button
                      type="button"
                      onClick={() => toggle(item.key)}
                      aria-pressed={on}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${on ? "bg-emerald-500 text-white" : "bg-white text-ink-soft ring-1 ring-black/10"}`}
                    >
                      {on ? <Check size={13} strokeWidth={3} /> : <Undo2 size={13} />}
                      {on ? "Using AI version" : "Keeping original"}
                    </button>
                  </div>
                  {item.kind === "skills" ? (
                    <SkillsDiff before={item.before} after={item.after} />
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className={`rounded-2xl p-4 ${on ? "bg-slate-50/80" : "bg-white ring-2 ring-emerald-200"}`}>
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-ink-soft">Original</p>
                        <Lines text={item.before} muted={on} />
                      </div>
                      <div className={`rounded-2xl p-4 ${on ? "bg-emerald-50/70 ring-2 ring-emerald-200" : "bg-slate-50/80 opacity-70"}`}>
                        <p className="mb-2 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                          <Sparkles size={11} /> AI version
                        </p>
                        <Lines text={item.after} />
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <footer className="flex flex-col-reverse gap-2 border-t border-violet/10 p-5 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="btn btn-glass">
            Keep my original
          </button>
          {items.length > 0 && (
            <button type="button" onClick={() => onApply([...accepted])} disabled={!accepted.size || applying} className="btn btn-primary">
              <Check size={16} /> {applying ? "Applying…" : `Apply ${accepted.size} change${accepted.size === 1 ? "" : "s"}`}
            </button>
          )}
        </footer>
      </motion.div>
    </motion.div>
  );
}
