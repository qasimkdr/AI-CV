import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HelpCircle, Plus } from "lucide-react";

import SectionHeading from "./SectionHeading";
import Reveal from "../motion/Reveal";
import { FAQS } from "@/seo/site";

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="scroll-mt-24 px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="FAQ"
          icon={HelpCircle}
          title="Questions, answered"
          subtitle="Everything you need to know about building your resume with AI CV."
        />

        <div className="mt-12 space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 0.05}>
                <div className={`glass rounded-3xl transition ${isOpen ? "ring-2 ring-violet/20" : ""}`}>
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`faq-${i}`}
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-display text-lg font-semibold text-ink"
                    >
                      {f.q}
                      <span
                        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition duration-300 ${
                          isOpen ? "rotate-45 bg-brand text-white" : "bg-white text-ink-soft"
                        }`}
                      >
                        <Plus size={16} />
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-6 leading-relaxed text-ink-soft">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
