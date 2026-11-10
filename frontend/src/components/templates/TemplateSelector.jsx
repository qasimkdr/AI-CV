import { motion } from "framer-motion";
import { Check } from "lucide-react";

import { SectionCard } from "../editor/FormBits";
import TemplateThumb from "./TemplateThumb";
import { TEMPLATES } from "../../lib/templates";

export default function TemplateSelector({ selectedTemplate, setResumeData }) {
  const selected = String(selectedTemplate || "modern").toLowerCase();

  return (
    <SectionCard
      eyebrow="Visual style"
      title="Choose a template"
      description="You can switch at any time — your content stays the same."
    >
      <div role="radiogroup" aria-label="Resume template" className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {TEMPLATES.map((t) => {
          const isOn = selected === t.id;
          return (
            <motion.button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={isOn}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setResumeData((p) => ({ ...p, template: t.id }))}
              className={`relative overflow-hidden rounded-3xl border bg-white/60 p-2 text-left transition ${
                isOn ? "border-violet/60 ring-4 ring-violet/15" : "border-white hover:border-violet/25"
              }`}
            >
              <div className="overflow-hidden rounded-2xl ring-1 ring-black/5">
                <TemplateThumb template={t.component} aspect={1.2} />
              </div>
              <div className="px-1.5 pb-1 pt-2.5">
                <p className="font-display text-sm font-bold text-ink">{t.name}</p>
                <p className="line-clamp-1 text-xs text-ink-soft">{t.bestFor}</p>
              </div>
              {isOn && (
                <motion.span
                  layoutId="tpl-check"
                  className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-brand text-white shadow-lg"
                >
                  <Check size={15} strokeWidth={3} />
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>
    </SectionCard>
  );
}
