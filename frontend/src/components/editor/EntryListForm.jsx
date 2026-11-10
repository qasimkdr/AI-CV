import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Copy, Plus, Trash2 } from "lucide-react";

import { BulletEditor, Field, MonthPicker, SelectField, Toggle } from "./inputs";
import { TextArea } from "./FormBits";

/**
 * Generic list editor driven by a field config:
 *  { name, label, type: text|month|textarea|bullets|select|current, options, placeholder, span }
 */
export default function EntryListForm({ items = [], onChange, fields, blank, titleOf, subtitleOf, addLabel, emptyText, renderExtra }) {
  const [open, setOpen] = useState(() => (items.length ? items.length - 1 : -1));

  const update = (index, patch) => onChange(items.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  const add = () => {
    onChange([...items, { ...blank }]);
    setOpen(items.length);
  };
  const remove = (index) => {
    onChange(items.filter((_, i) => i !== index));
    setOpen(-1);
  };
  const duplicate = (index) => {
    onChange([...items.slice(0, index + 1), { ...items[index] }, ...items.slice(index + 1)]);
    setOpen(index + 1);
  };
  const move = (index, dir) => {
    const j = index + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[index], next[j]] = [next[j], next[index]];
    onChange(next);
    setOpen(j);
  };

  return (
    <div className="space-y-3">
      {!items.length && (
        <button
          type="button"
          onClick={add}
          className="group grid w-full place-items-center rounded-3xl border-2 border-dashed border-violet/25 bg-white/40 px-6 py-10 text-center transition hover:border-violet/50 hover:bg-white/70"
        >
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand text-white shadow-lg transition group-hover:scale-110 group-hover:rotate-6">
            <Plus size={22} />
          </span>
          <span className="mt-3 font-display font-bold text-ink">{addLabel}</span>
          <span className="mt-1 max-w-sm text-sm text-ink-soft">{emptyText}</span>
        </button>
      )}

      <AnimatePresence initial={false}>
        {items.map((item, i) => {
          const isOpen = open === i;
          const title = titleOf(item) || `${addLabel.replace(/^Add /, "")} #${i + 1}`;
          const subtitle = subtitleOf?.(item);
          return (
            <motion.div
              key={i}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className={`overflow-hidden rounded-3xl border bg-white/60 transition ${isOpen ? "border-violet/25 shadow-[0_18px_40px_-28px_rgb(76_60_180/0.6)]" : "border-white"}`}
            >
              <div className="flex items-center gap-2 px-5 py-4">
                <button type="button" onClick={() => setOpen(isOpen ? -1 : i)} className="flex min-w-0 flex-1 items-center gap-3 text-left" aria-expanded={isOpen}>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet/10 font-display text-sm font-bold text-violet">{i + 1}</span>
                  <span className="min-w-0">
                    <span className="block truncate font-display font-bold text-ink">{title}</span>
                    {subtitle && <span className="block truncate text-xs text-ink-soft">{subtitle}</span>}
                  </span>
                  <ChevronDown size={18} className={`ml-auto shrink-0 text-ink-soft transition ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <div className="flex shrink-0 items-center">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="hidden h-8 w-8 place-items-center rounded-full text-ink-soft hover:bg-violet/10 disabled:opacity-30 sm:grid" aria-label="Move up">
                    ↑
                  </button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="hidden h-8 w-8 place-items-center rounded-full text-ink-soft hover:bg-violet/10 disabled:opacity-30 sm:grid" aria-label="Move down">
                    ↓
                  </button>
                  <button type="button" onClick={() => duplicate(i)} className="grid h-8 w-8 place-items-center rounded-full text-ink-soft hover:bg-violet/10" aria-label="Duplicate">
                    <Copy size={14} />
                  </button>
                  <button type="button" onClick={() => remove(i)} className="grid h-8 w-8 place-items-center rounded-full text-ink-soft hover:bg-rose-50 hover:text-rose-500" aria-label="Remove">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                    <div className="grid gap-4 border-t border-violet/10 px-5 pb-5 pt-4 md:grid-cols-2">
                      {fields.map((f) => {
                        const id = `${f.name}-${i}`;
                        const span = f.span === 2 || ["textarea", "bullets"].includes(f.type) ? "md:col-span-2" : "";
                        if (f.type === "current")
                          return (
                            <div key={f.name} className="md:col-span-2">
                              <Toggle checked={Boolean(item[f.name])} onChange={(v) => update(i, { [f.name]: v, ...(v ? { [f.clears]: "" } : {}) })} label={f.label} />
                            </div>
                          );
                        if (f.type === "month")
                          return (
                            <MonthPicker
                              key={f.name}
                              id={id}
                              label={f.label}
                              value={item[f.name] || ""}
                              disabled={f.disabledBy && item[f.disabledBy]}
                              onChange={(v) => update(i, { [f.name]: v })}
                            />
                          );
                        if (f.type === "select")
                          return <SelectField key={f.name} id={id} label={f.label} options={f.options} value={item[f.name]} onChange={(v) => update(i, { [f.name]: v })} className={span} />;
                        if (f.type === "textarea")
                          return (
                            <TextArea key={f.name} id={id} label={f.label} placeholder={f.placeholder} value={item[f.name] || ""} onChange={(e) => update(i, { [f.name]: e.target.value })} className={span} />
                          );
                        if (f.type === "bullets")
                          return (
                            <div key={f.name} className="md:col-span-2">
                              <BulletEditor
                                label={f.label}
                                value={item[f.name] || ""}
                                placeholder={f.placeholder}
                                onChange={(v) => update(i, { [f.name]: v })}
                                {...(renderExtra?.bulletProps?.(item, i, (v) => update(i, { [f.name]: v })) || {})}
                              />
                            </div>
                          );
                        return (
                          <Field
                            key={f.name}
                            id={id}
                            label={f.label}
                            placeholder={f.placeholder}
                            inputMode={f.inputMode}
                            value={item[f.name] || ""}
                            onChange={(e) => update(i, { [f.name]: e.target.value })}
                            className={span}
                          />
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {items.length > 0 && (
        <button type="button" onClick={add} className="btn btn-glass w-full border-dashed text-violet">
          <Plus size={16} /> {addLabel}
        </button>
      )}
    </div>
  );
}
