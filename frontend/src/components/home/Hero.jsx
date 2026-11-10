import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, LayoutTemplate, Sparkles, Wand2 } from "lucide-react";

import Scene3D from "../three/Scene3D";
import { SHEET_VARIANTS } from "../three/variants";

const words = ["gets noticed", "beats the ATS", "lands interviews", "feels like you"];

function RotatingWord() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % words.length), 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="relative inline-grid align-bottom">
      {/* invisible sizer keeps layout stable for the longest word */}
      <span className="invisible col-start-1 row-start-1 whitespace-nowrap">lands interviews</span>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[i]}
          initial={{ y: "60%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-60%", opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="col-start-1 row-start-1 whitespace-nowrap"
        >
          <span className="text-gradient pb-1">{words[i]}</span>
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function SceneFallback() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="glass-strong animate-float h-[78%] max-h-[460px] w-[58%] max-w-[330px] rounded-3xl p-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-brand" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-3/4 rounded-full bg-ink/80" />
            <div className="h-2 w-1/2 rounded-full bg-violet/60" />
          </div>
        </div>
        {[0, 1, 2].map((s) => (
          <div key={s} className="mt-6 space-y-2">
            <div className="h-2 w-1/3 rounded-full bg-violet/70" />
            <div className="h-2 w-full rounded-full bg-slate-200" />
            <div className="h-2 w-5/6 rounded-full bg-slate-200" />
            <div className="h-2 w-2/3 rounded-full bg-slate-200" />
          </div>
        ))}
      </div>
    </div>
  );
}

const fade = (delay) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function Hero() {
  const [variant, setVariant] = useState(0);

  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-28 sm:px-6 md:pt-32 lg:min-h-[92svh] lg:pb-16">
      {/* soft blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-blob absolute -left-24 top-20 h-80 w-80 rounded-full bg-violet/20 blur-3xl" />
        <div className="animate-blob absolute right-0 top-40 h-96 w-96 rounded-full bg-sky/20 blur-3xl [animation-delay:-6s]" />
        <div className="animate-blob absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-blush/15 blur-3xl [animation-delay:-12s]" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
        <div className="relative z-10 text-center lg:text-left">
          <motion.div {...fade(0.05)}>
            <Link to="/signup" className="eyebrow group">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-brand text-white">
                <Sparkles size={11} />
              </span>
              AI rewrites your bullets in seconds
              <ArrowRight size={13} className="transition group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          <motion.h1
            {...fade(0.15)}
            className="mt-6 text-[2.6rem] font-extrabold leading-[1.04] text-ink sm:text-6xl lg:text-[4.2rem]"
          >
            <span className="mb-3 block font-sans text-base font-semibold tracking-normal text-violet sm:text-lg">
              Free AI Resume Builder
            </span>
            A resume that <br />
            <RotatingWord />
          </motion.h1>

          <motion.p
            {...fade(0.25)}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-soft lg:mx-0"
          >
            AI CV is the free AI resume builder that turns your experience into
            sharp, ATS-friendly resumes. Pick a stunning template, let AI polish
            every line, then export to PDF or Word.
          </motion.p>

          <motion.div
            {...fade(0.35)}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start"
          >
            <Link to="/signup" className="btn btn-primary btn-lg w-full sm:w-auto">
              <Wand2 size={18} />
              Build my CV — it's free
            </Link>
            <Link to="/templates" className="btn btn-glass btn-lg w-full sm:w-auto">
              <LayoutTemplate size={18} />
              Explore templates
            </Link>
          </motion.div>

          <motion.ul
            {...fade(0.45)}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink-soft lg:justify-start"
          >
            {["No credit card", "ATS-friendly", "PDF & DOCX export"].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                  <Check size={12} strokeWidth={3} />
                </span>
                {t}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* 3D stage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto aspect-square w-full max-w-[560px]"
        >
          <div aria-hidden="true" className="absolute inset-[8%] rounded-full bg-gradient-to-br from-violet/25 via-sky/20 to-blush/25 blur-3xl" />

          <Scene3D
            scene="hero"
            className="absolute inset-0"
            fallback={<SceneFallback />}
            onVariant={setVariant}
          />

          {/* floating glass badges */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="glass-strong animate-float absolute left-0 top-[14%] flex items-center gap-3 rounded-2xl px-4 py-3 sm:-left-4"
          >
            <span className="relative grid h-10 w-10 place-items-center rounded-full bg-emerald-50">
              <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90">
                <circle cx="18" cy="18" r="15" fill="none" stroke="#d1fae5" strokeWidth="4" />
                <circle cx="18" cy="18" r="15" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeDasharray="94" strokeDashoffset="6" />
              </svg>
              <span className="text-[11px] font-bold text-emerald-700">96</span>
            </span>
            <span className="text-left">
              <span className="block text-xs text-ink-soft">ATS score</span>
              <span className="block text-sm font-semibold text-ink">Excellent</span>
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="glass-strong animate-float-slow absolute bottom-[14%] right-0 flex items-center gap-3 rounded-2xl px-4 py-3 sm:-right-4"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-white">
              <Sparkles size={18} />
            </span>
            <span className="text-left">
              <span className="block text-xs text-ink-soft">AI enhanced</span>
              <span className="block text-sm font-semibold text-ink">4 bullets rewritten</span>
            </span>
          </motion.div>

          <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
            <AnimatePresence mode="wait">
              <motion.span
                key={variant}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold text-ink"
              >
                <span className="h-2 w-2 rounded-full" style={{ background: SHEET_VARIANTS[variant].a }} />
                {SHEET_VARIANTS[variant].name} template
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
