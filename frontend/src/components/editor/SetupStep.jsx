import { Reorder, motion, useDragControls } from "framer-motion";
import { Check, Eye, EyeOff, GripVertical } from "lucide-react";

import TemplateThumb from "../templates/TemplateThumb";
import TiltCard from "../motion/TiltCard";
import { useEditor } from "./EditorContext";
import { FIELDS } from "../../lib/fields";
import { sectionMeta, sectionsForField } from "../../lib/sections";
import { TEMPLATES } from "../../lib/templates";

export function FieldPicker() {
  const { data, setData } = useEditor();

  const choose = (f) =>
    setData((prev) => {
      const pristine = !prev.experience?.length && !prev.education?.length && !prev.skills?.length;
      return {
        ...prev,
        field: f.id,
        // Only reshape sections/template automatically on a fresh resume.
        ...(pristine ? { sections: sectionsForField(f.sections), template: f.template } : {}),
      };
    });

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {FIELDS.map((f, i) => {
        const on = data.field === f.id;
        return (
          <motion.div key={f.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <TiltCard max={10} className="h-full rounded-3xl">
              <button
                type="button"
                onClick={() => choose(f)}
                aria-pressed={on}
                className={`relative flex h-full w-full flex-col items-start rounded-3xl border p-4 text-left transition ${
                  on ? "border-violet/50 bg-white shadow-[0_20px_40px_-24px_rgb(124_92_255/0.7)] ring-4 ring-violet/10" : "border-white bg-white/55 hover:bg-white/80"
                }`}
              >
                <span className="text-3xl" aria-hidden="true">{f.emoji}</span>
                <span className="mt-3 font-display font-bold leading-tight text-ink">{f.label}</span>
                <span className="mt-1 text-xs leading-snug text-ink-soft">{f.blurb}</span>
                {on && (
                  <motion.span layoutId="field-check" className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-brand text-white">
                    <Check size={13} strokeWidth={3} />
                  </motion.span>
                )}
              </button>
            </TiltCard>
          </motion.div>
        );
      })}
    </div>
  );
}

export function TemplatePicker() {
  const { data, setData, field } = useEditor();
  return (
    <div role="radiogroup" aria-label="Template" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {TEMPLATES.map((t) => {
        const on = data.template === t.id;
        const recommended = field?.template === t.id;
        return (
          <motion.button
            key={t.id}
            type="button"
            role="radio"
            aria-checked={on}
            whileHover={{ y: -4 }}
            onClick={() => setData((p) => ({ ...p, template: t.id }))}
            className={`relative overflow-hidden rounded-2xl border bg-white/60 p-1.5 text-left transition ${on ? "border-violet/60 ring-4 ring-violet/15" : "border-white"}`}
          >
            <div className="overflow-hidden rounded-xl ring-1 ring-black/5">
              <TemplateThumb template={t.component} aspect={1.3} />
            </div>
            <p className="px-1 pb-0.5 pt-2 font-display text-sm font-bold text-ink">{t.name}</p>
            {recommended && <span className="absolute bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow">Recommended</span>}
            {on && (
              <span className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-brand text-white shadow">
                <Check size={13} strokeWidth={3} />
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

function SectionRow({ item, onToggle }) {
  const controls = useDragControls();
  const meta = sectionMeta(item.id);
  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={controls}
      className={`flex items-center gap-3 rounded-2xl border px-3 py-2.5 transition ${item.enabled ? "border-white bg-white/80" : "border-transparent bg-white/30"}`}
      whileDrag={{ scale: 1.03, boxShadow: "0 20px 40px -20px rgba(76,60,180,.5)" }}
    >
      <button type="button" onPointerDown={(e) => controls.start(e)} className="cursor-grab touch-none text-ink-soft/50 hover:text-ink" aria-label={`Drag ${meta.label}`}>
        <GripVertical size={18} />
      </button>
      <span className={`flex-1 text-sm font-medium ${item.enabled ? "text-ink" : "text-ink-soft line-through decoration-ink-soft/30"}`}>{meta.label}</span>
      <button
        type="button"
        onClick={onToggle}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${item.enabled ? "bg-emerald-50 text-emerald-600" : "bg-violet/10 text-ink-soft"}`}
        aria-pressed={item.enabled}
      >
        {item.enabled ? <Eye size={13} /> : <EyeOff size={13} />}
        {item.enabled ? "Shown" : "Hidden"}
      </button>
    </Reorder.Item>
  );
}

export function SectionManager() {
  const { data, setData } = useEditor();
  const setSections = (sections) => setData((p) => ({ ...p, sections }));
  return (
    <Reorder.Group axis="y" values={data.sections} onReorder={setSections} className="space-y-2">
      {data.sections.map((s) => (
        <SectionRow key={s.id} item={s} onToggle={() => setSections(data.sections.map((x) => (x.id === s.id ? { ...x, enabled: !x.enabled } : x)))} />
      ))}
    </Reorder.Group>
  );
}
