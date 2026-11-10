import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Download, LayoutTemplate, PenLine, Route, Wand2 } from "lucide-react";

import SectionHeading from "./SectionHeading";

const steps = [
  {
    icon: PenLine,
    title: "Add your details",
    text: "Fill in experience, education, skills and projects with a guided editor and a live preview.",
    color: "from-violet to-iris",
  },
  {
    icon: Wand2,
    title: "Let AI polish it",
    text: "One click rewrites every section with impact-driven, keyword-rich language recruiters love.",
    color: "from-sky to-blue-500",
  },
  {
    icon: LayoutTemplate,
    title: "Pick your template",
    text: "Switch between five ATS-friendly designs instantly — your content flows into each one.",
    color: "from-blush to-peach",
  },
  {
    icon: Download,
    title: "Export & apply",
    text: "Download a crisp PDF or editable DOCX and start applying with confidence.",
    color: "from-mint to-emerald-500",
  },
];

function BuildVisual({ step }) {
  return (
    <div className="glass-strong relative mx-auto aspect-[1/1.25] w-full max-w-sm rounded-[2rem] p-6">
      <div className="flex items-center gap-3">
        <motion.div layout className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${steps[Math.min(step, 3)].color}`} />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-3/4 rounded-full bg-ink/80" />
          <div className="h-2.5 w-1/2 rounded-full bg-ink-soft/30" />
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {[0, 1, 2].map((s) => (
          <motion.div
            key={s}
            initial={false}
            animate={{ opacity: step >= 0 ? 1 : 0.3 }}
            className="space-y-2"
          >
            <div className={`h-2.5 w-1/3 rounded-full bg-gradient-to-r ${steps[Math.min(step, 3)].color}`} />
            {[1, 0.85, 0.65].map((w, j) => (
              <motion.div
                key={j}
                initial={false}
                animate={{
                  width: `${w * 100}%`,
                  backgroundColor: step >= 1 ? "rgba(124,92,255,0.22)" : "rgba(148,163,184,0.25)",
                }}
                transition={{ duration: 0.6, delay: j * 0.08 }}
                className="h-2 rounded-full"
              />
            ))}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {step >= 1 && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="glass-strong absolute -right-4 top-24 flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-violet"
          >
            <Wand2 size={14} /> AI polished
          </motion.span>
        )}
        {step >= 3 && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 gap-2"
          >
            <span className="rounded-full bg-gradient-to-r from-blush to-rose-500 px-4 py-2 text-xs font-bold text-white shadow-lg">PDF</span>
            <span className="rounded-full bg-gradient-to-r from-sky to-blue-500 px-4 py-2 text-xs font-bold text-white shadow-lg">DOCX</span>
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function HowItWorks() {
  const ref = useRef(null);
  const [step, setStep] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 60%", "end 60%"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setStep(Math.min(steps.length - 1, Math.max(0, Math.floor(v * steps.length))));
  });

  return (
    <section id="how-it-works" className="scroll-mt-24 px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="How it works"
          icon={Route}
          title={<>From blank page to <span className="text-gradient">hired</span> in four steps</>}
          subtitle="A guided flow that keeps you moving — no design skills, no writer's block."
        />

        <div ref={ref} className="mt-16 grid gap-12 lg:grid-cols-2">
          <div className="hidden lg:block">
            <div className="sticky top-32">
              <BuildVisual step={step} />
            </div>
          </div>

          <ol className="relative space-y-6 lg:space-y-[22vh] lg:py-[8vh]">
            <span aria-hidden="true" className="absolute bottom-6 left-[1.6rem] top-6 w-px bg-gradient-to-b from-violet/30 via-sky/30 to-mint/30" />
            {steps.map((s, i) => {
              const Icon = s.icon;
              const on = i <= step;
              return (
                <motion.li
                  key={s.title}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6 }}
                  className="relative flex gap-5"
                >
                  <span
                    className={`relative z-10 grid h-[3.25rem] w-[3.25rem] shrink-0 place-items-center rounded-2xl text-white shadow-lg transition duration-500 bg-gradient-to-br ${s.color} ${
                      on ? "scale-100" : "scale-90 opacity-60 grayscale"
                    }`}
                  >
                    <Icon size={22} />
                  </span>
                  <div className={`glass flex-1 rounded-3xl p-6 transition duration-500 ${i === step ? "ring-2 ring-violet/25" : ""}`}>
                    <p className="text-xs font-semibold uppercase tracking-widest text-violet">Step {i + 1}</p>
                    <h3 className="mt-1 text-2xl font-bold text-ink">{s.title}</h3>
                    <p className="mt-2 leading-relaxed text-ink-soft">{s.text}</p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
