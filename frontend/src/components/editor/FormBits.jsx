import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Trash2, X } from "lucide-react";

export function SectionCard({ eyebrow, title, description, action, children }) {
  return (
    <section className="glass-strong rounded-[2rem] p-6 sm:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet">{eyebrow}</p>}
          <h2 className="mt-1 text-2xl font-extrabold text-ink">{title}</h2>
          {description && <p className="mt-1 text-sm text-ink-soft">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function TextField({ label, id, className = "", ...props }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      <input id={id} className="field" {...props} />
    </div>
  );
}

export function TextArea({ label, id, className = "", hint, value = "", ...props }) {
  const words = value.trim() ? value.trim().split(/\s+/).length : 0;
  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={id} className="block text-sm font-medium text-ink">
          {label}
        </label>
        <span className="text-xs text-ink-soft">{words} words</span>
      </div>
      <textarea id={id} rows={4} className="field" value={value} {...props} />
      {hint && <p className="mt-1.5 text-xs text-ink-soft">{hint}</p>}
    </div>
  );
}

export function AddButton({ children, onClick }) {
  return (
    <button type="button" onClick={onClick} className="btn btn-glass btn-sm text-violet">
      <Plus size={16} /> {children}
    </button>
  );
}

export function ItemList({ items, render, empty }) {
  if (!items.length) {
    return (
      <div className="rounded-3xl border-2 border-dashed border-violet/20 bg-white/30 px-6 py-10 text-center text-sm text-ink-soft">
        {empty}
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <AnimatePresence initial={false}>
        {items.map((item, i) => (
          <motion.div
            key={i}
            layout
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}
          >
            {render(item, i)}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function ItemCard({ title, onRemove, children }) {
  return (
    <div className="rounded-3xl border border-white bg-white/55 p-5 shadow-[0_10px_30px_-22px_rgb(76_60_180/0.5)]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display font-bold text-ink">{title}</h3>
        <button type="button" onClick={onRemove} className="btn btn-danger btn-sm h-9 px-3" aria-label={`Remove ${title}`}>
          <Trash2 size={14} /> Remove
        </button>
      </div>
      {children}
    </div>
  );
}

/** Tag-style input: type and press Enter (or comma) to add. */
export function ChipInput({ id, values, onChange, placeholder, suggestions = [] }) {
  const [draft, setDraft] = useState("");
  const clean = values.filter((v) => v && v.trim());

  const add = (raw) => {
    const parts = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((s) => !clean.some((v) => v.toLowerCase() === s.toLowerCase()));
    if (parts.length) onChange([...clean, ...parts]);
    setDraft("");
  };

  const remove = (i) => onChange(clean.filter((_, idx) => idx !== i));

  return (
    <div>
      <div className="field flex h-auto min-h-14 flex-wrap items-center gap-2 py-2">
        <AnimatePresence initial={false}>
          {clean.map((v, i) => (
            <motion.span
              key={v}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet/12 to-sky/12 py-1.5 pl-3 pr-1.5 text-sm font-medium text-ink ring-1 ring-violet/15"
            >
              {v}
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label={`Remove ${v}`}
                className="grid h-5 w-5 place-items-center rounded-full text-ink-soft hover:bg-white hover:text-rose-500"
              >
                <X size={12} />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
        <input
          id={id}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === ",") && draft.trim()) {
              e.preventDefault();
              add(draft);
            } else if (e.key === "Backspace" && !draft && clean.length) {
              remove(clean.length - 1);
            }
          }}
          onBlur={() => draft.trim() && add(draft)}
          placeholder={clean.length ? "Add more…" : placeholder}
          className="min-w-[140px] flex-1 bg-transparent py-1 text-[15px] outline-none placeholder:text-ink-soft/50"
        />
      </div>
      <p className="mt-1.5 text-xs text-ink-soft">Press Enter or comma to add.</p>

      {suggestions.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {suggestions
            .filter((s) => !clean.some((v) => v.toLowerCase() === s.toLowerCase()))
            .slice(0, 10)
            .map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => add(s)}
                className="rounded-full border border-dashed border-violet/30 px-3 py-1.5 text-xs font-medium text-ink-soft transition hover:border-violet hover:bg-white hover:text-violet"
              >
                + {s}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
