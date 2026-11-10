import { useEffect, useRef, useState } from "react";
import { AnimatePresence, Reorder, motion, useDragControls } from "framer-motion";
import { Calendar, Camera, ChevronLeft, ChevronRight, GripVertical, Plus, Sparkles, Trash2, X } from "lucide-react";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function Label({ htmlFor, children, hint }) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-2">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-ink">
        {children}
      </label>
      {hint && <span className="text-xs text-ink-soft">{hint}</span>}
    </div>
  );
}

export function Field({ id, label, hint, className = "", ...props }) {
  return (
    <div className={className}>
      <Label htmlFor={id} hint={hint}>
        {label}
      </Label>
      <input id={id} className="field" {...props} />
    </div>
  );
}

export function SelectField({ id, label, options, className = "", value, onChange }) {
  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label>
      <select id={id} className="field appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%236a7192%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:14px] bg-[right_1rem_center] bg-no-repeat pr-10" value={value || ""} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o || "Select…"}
          </option>
        ))}
      </select>
    </div>
  );
}

export function Toggle({ checked, onChange, label, description }) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-brand" : "bg-violet/15"}`}
      >
        <motion.span layout transition={{ type: "spring", stiffness: 500, damping: 32 }} className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${checked ? "right-0.5" : "left-0.5"}`} />
      </button>
      <span>
        <span className="block text-sm font-medium text-ink">{label}</span>
        {description && <span className="block text-xs text-ink-soft">{description}</span>}
      </span>
    </label>
  );
}

export function Segmented({ options, value, onChange, layoutId, size = "md" }) {
  return (
    <div className="glass inline-flex flex-wrap gap-1 rounded-2xl p-1">
      {options.map((o) => {
        const val = typeof o === "string" ? o : o.value;
        const label = typeof o === "string" ? o : o.label;
        const on = value === val;
        return (
          <button
            key={val}
            type="button"
            onClick={() => onChange(val)}
            className={`relative rounded-xl font-medium transition ${size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm"} ${on ? "text-white" : "text-ink-soft hover:text-ink"}`}
          >
            {on && <motion.span layoutId={layoutId} className="bg-brand absolute inset-0 rounded-xl" transition={{ type: "spring", stiffness: 500, damping: 36 }} />}
            <span className="relative">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Month/year picker storing "YYYY-MM". Free text typed earlier is kept and shown. */
export function MonthPicker({ id, label, value, onChange, disabled, placeholder = "Select month" }) {
  const [open, setOpen] = useState(false);
  const match = /^(\d{4})-(\d{2})$/.exec(value || "");
  const [year, setYear] = useState(() => (match ? Number(match[1]) : new Date().getFullYear()));
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const display = match ? `${MONTHS[Number(match[2]) - 1]} ${match[1]}` : value || "";

  return (
    <div ref={ref} className="relative">
      {label && <Label htmlFor={id}>{label}</Label>}
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={`field flex items-center justify-between text-left ${disabled ? "opacity-50" : ""}`}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className={display ? "text-ink" : "text-ink-soft/50"}>{disabled ? "Present" : display || placeholder}</span>
        <Calendar size={16} className="text-ink-soft" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className="absolute left-0 z-40 mt-2 w-64 rounded-2xl border border-violet/10 bg-white p-3 shadow-[0_24px_60px_-20px_rgb(76_60_180/0.45)]"
          >
            <div className="mb-2 flex items-center justify-between">
              <button type="button" onClick={() => setYear((y) => y - 1)} className="btn btn-ghost h-8 w-8 px-0" aria-label="Previous year">
                <ChevronLeft size={16} />
              </button>
              <span className="font-display font-bold text-ink">{year}</span>
              <button type="button" onClick={() => setYear((y) => Math.min(y + 1, new Date().getFullYear() + 6))} className="btn btn-ghost h-8 w-8 px-0" aria-label="Next year">
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {MONTHS.map((m, i) => {
                const v = `${year}-${String(i + 1).padStart(2, "0")}`;
                const on = v === value;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      onChange(v);
                      setOpen(false);
                    }}
                    className={`rounded-xl py-2 text-sm font-medium transition ${on ? "bg-brand text-white" : "text-ink hover:bg-violet/10"}`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
            <div className="mt-2 flex justify-between border-t border-violet/10 pt-2">
              <button type="button" onClick={() => { onChange(String(year)); setOpen(false); }} className="text-xs font-medium text-violet hover:underline">
                Year only ({year})
              </button>
              {value && (
                <button type="button" onClick={() => { onChange(""); setOpen(false); }} className="text-xs text-ink-soft hover:text-rose-500">
                  Clear
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const linesOf = (text) =>
  (text || "")
    .split(/\n+/)
    .map((l) => l.replace(/^\s*[-*•]\s*/, ""))
    .filter((l, i, all) => l.trim() || i === all.length - 1);

function BulletRow({ value, index, onChange, onRemove, onEnter, placeholder, inputRef }) {
  const controls = useDragControls();
  return (
    <Reorder.Item value={value} dragListener={false} dragControls={controls} className="group flex items-center gap-2">
      <button type="button" onPointerDown={(e) => controls.start(e)} className="cursor-grab touch-none text-ink-soft/40 hover:text-ink-soft" aria-label="Drag to reorder">
        <GripVertical size={16} />
      </button>
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet/60" />
      <input
        ref={inputRef}
        value={value.text}
        onChange={(e) => onChange(index, e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onEnter(index);
          }
        }}
        placeholder={placeholder}
        className="field h-11 flex-1"
      />
      <button type="button" onClick={() => onRemove(index)} className="grid h-9 w-9 place-items-center rounded-full text-ink-soft opacity-60 transition hover:bg-rose-50 hover:text-rose-500 group-hover:opacity-100" aria-label="Remove bullet">
        <X size={15} />
      </button>
    </Reorder.Item>
  );
}

/** Achievement bullets stored as newline-separated text (keeps old data working). */
export function BulletEditor({ label = "Key achievements", value, onChange, placeholder, onAiWrite, aiBusy }) {
  const [items, setItems] = useState(() => linesOf(value).map((text, i) => ({ id: `b${i}-${text.length}`, text })));
  const [synced, setSynced] = useState(value);
  const focusIndex = useRef(null);
  const refs = useRef([]);

  // Pick up external changes (AI suggestions, imports) during render.
  if (value !== synced) {
    setSynced(value);
    if (value !== items.map((i) => i.text).filter((t) => t.trim()).join("\n")) {
      setItems(linesOf(value).map((text, i) => ({ id: `x${i}-${text.length}-${(value || "").length}`, text })));
    }
  }

  const commit = (next) => {
    setItems(next);
    const text = next.map((i) => i.text).filter((t) => t.trim()).join("\n");
    setSynced(text);
    onChange(text);
  };

  useEffect(() => {
    if (focusIndex.current != null) {
      refs.current[focusIndex.current]?.focus();
      focusIndex.current = null;
    }
  });

  const add = (at = items.length) => {
    const next = [...items];
    next.splice(at, 0, { id: `n${items.length}-${at}-${Math.random().toString(36).slice(2, 7)}`, text: "" });
    focusIndex.current = at;
    setItems(next);
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-ink">{label}</span>
        {onAiWrite && (
          <button type="button" onClick={onAiWrite} disabled={aiBusy} className="btn btn-glass btn-sm h-8 px-3 text-xs text-teal-700">
            <Sparkles size={13} className={aiBusy ? "animate-spin" : ""} />
            {aiBusy ? "Writing…" : "Write with AI"}
          </button>
        )}
      </div>
      <Reorder.Group axis="y" values={items} onReorder={commit} className="space-y-2">
        {items.map((item, i) => (
          <BulletRow
            key={item.id}
            value={item}
            index={i}
            inputRef={(el) => (refs.current[i] = el)}
            placeholder={i === 0 ? placeholder : "Another achievement…"}
            onChange={(idx, text) => commit(items.map((it, j) => (j === idx ? { ...it, text } : it)))}
            onRemove={(idx) => commit(items.filter((_, j) => j !== idx))}
            onEnter={(idx) => add(idx + 1)}
          />
        ))}
      </Reorder.Group>
      <button type="button" onClick={() => add()} className="mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-violet transition hover:bg-violet/10">
        <Plus size={15} /> Add bullet
      </button>
      <p className="mt-1 text-xs text-ink-soft">Start with an action verb and add a number where you can. Press Enter for a new bullet.</p>
    </div>
  );
}

/** Square-cropped, compressed photo stored as a small data URL. */
export function PhotoUpload({ value, onChange }) {
  const inputRef = useRef(null);
  const [error, setError] = useState("");

  const onFile = async (file) => {
    setError("");
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Please choose an image file.");
    if (file.size > 8 * 1024 * 1024) return setError("Image must be under 8 MB.");

    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise((resolve, reject) => {
        const i = new Image();
        i.onload = () => resolve(i);
        i.onerror = reject;
        i.src = url;
      });
      const size = 360;
      const side = Math.min(img.width, img.height);
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      canvas.getContext("2d").drawImage(img, (img.width - side) / 2, (img.height - side) / 3, side, side, 0, 0, size, size);
      onChange(canvas.toDataURL("image/jpeg", 0.82));
    } catch {
      setError("Couldn't read that image.");
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group relative grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-dashed border-violet/30 bg-white/60 transition hover:border-violet"
        aria-label={value ? "Change photo" : "Upload photo"}
      >
        {value ? <img src={value} alt="Your photo" className="h-full w-full object-cover" /> : <Camera size={26} className="text-violet/60" />}
        <span className="absolute inset-0 grid place-items-center bg-ink/40 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100">{value ? "Change" : "Upload"}</span>
      </button>
      <div className="text-sm">
        <p className="font-medium text-ink">Profile photo</p>
        <p className="text-xs text-ink-soft">Square crop, JPG/PNG. Common in Europe, the Middle East & Asia — usually left off in the US/UK.</p>
        <div className="mt-2 flex gap-2">
          <button type="button" onClick={() => inputRef.current?.click()} className="btn btn-glass btn-sm h-8 px-3 text-xs">
            {value ? "Replace" : "Choose photo"}
          </button>
          {value && (
            <button type="button" onClick={() => onChange("")} className="btn btn-danger btn-sm h-8 px-3 text-xs">
              <Trash2 size={13} /> Remove
            </button>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
    </div>
  );
}
