import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, LayoutTemplate } from "lucide-react";

import SectionHeading from "./SectionHeading";
import TemplateThumb from "../templates/TemplateThumb";
import { TEMPLATES } from "@/lib/templates";

export default function TemplateShowcase() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [spread, setSpread] = useState(240);
  const reduce = useReducedMotion();
  const drag = useRef(null);

  useEffect(() => {
    const onResize = () => setSpread(window.innerWidth < 640 ? 120 : window.innerWidth < 1024 ? 190 : 250);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (paused || reduce) return;
    const id = setInterval(() => setIndex((i) => i + 1), 3200);
    return () => clearInterval(id);
  }, [paused, reduce]);

  const active = ((index % TEMPLATES.length) + TEMPLATES.length) % TEMPLATES.length;
  const current = TEMPLATES[active];

  return (
    <section id="templates" className="scroll-mt-24 overflow-hidden px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Templates"
          icon={LayoutTemplate}
          title={<>Designs that make <span className="text-gradient">recruiters pause</span></>}
          subtitle="Every template is ATS-friendly, print-perfect and fully customizable. Spin the gallery to find your look."
        />

        <div
          className="relative mt-14 h-[440px] select-none sm:h-[520px]"
          style={{ perspective: "1400px" }}
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          onPointerDown={(e) => (drag.current = e.clientX)}
          onPointerUp={(e) => {
            if (drag.current == null) return;
            const dx = e.clientX - drag.current;
            if (Math.abs(dx) > 40) setIndex((i) => i + (dx < 0 ? 1 : -1));
            drag.current = null;
          }}
        >
          <div className="preserve-3d absolute inset-0">
            {TEMPLATES.map((t, i) => {
              // signed distance from the active card, wrapped to [-2, 2]
              const n = TEMPLATES.length;
              let offset = (i - active) % n;
              if (offset > n / 2) offset -= n;
              if (offset < -n / 2) offset += n;
              const abs = Math.abs(offset);
              const isActive = offset === 0;

              return (
                <motion.div
                  key={t.id}
                  className="absolute left-1/2 top-4 w-[220px] sm:w-[270px]"
                  style={{ x: "-50%", zIndex: 10 - abs }}
                  animate={{
                    x: `calc(-50% + ${offset * spread}px)`,
                    z: -abs * 180,
                    rotateY: offset * -32,
                    scale: isActive ? 1 : 0.9,
                    opacity: abs > 1.5 ? 0.55 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                >
                  <button
                    type="button"
                    onClick={() => setIndex(index + offset)}
                    aria-label={`Show ${t.name} template`}
                    className={`glass-strong block w-full overflow-hidden rounded-3xl p-2 text-left transition-shadow duration-500 ${
                      isActive ? "shadow-[0_40px_80px_-30px_rgb(124_92_255/0.55)]" : ""
                    }`}
                  >
                    <div className="overflow-hidden rounded-2xl ring-1 ring-black/5">
                      <TemplateThumb template={t.component} aspect={1.3} />
                    </div>
                    <div className="flex items-center justify-between px-2 pb-1 pt-3">
                      <span>
                        <span className="block font-display font-bold text-ink">{t.name}</span>
                        <span className="block text-xs text-ink-soft">{t.bestFor}</span>
                      </span>
                      <span className={`h-3 w-3 rounded-full bg-gradient-to-br ${t.accent}`} />
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* floor glow */}
          <div aria-hidden="true" className="absolute bottom-2 left-1/2 h-16 w-[70%] -translate-x-1/2 rounded-[100%] bg-violet/20 blur-2xl" />
        </div>

        <div className="mt-2 flex flex-col items-center gap-5">
          <div className="flex items-center gap-3">
            <button type="button" aria-label="Previous template" onClick={() => setIndex((i) => i - 1)} className="btn btn-glass h-11 w-11 px-0">
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-1.5">
              {TEMPLATES.map((t, i) => (
                <span key={t.id} className={`h-2 rounded-full transition-all duration-500 ${i === active ? "w-7 bg-violet" : "w-2 bg-violet/25"}`} />
              ))}
            </div>
            <button type="button" aria-label="Next template" onClick={() => setIndex((i) => i + 1)} className="btn btn-glass h-11 w-11 px-0">
              <ChevronRight size={18} />
            </button>
          </div>
          <p className="max-w-md text-center text-ink-soft">
            <span className="font-semibold text-ink">{current.name}:</span> {current.description}
          </p>
          <Link to="/templates" className="btn btn-primary">
            Browse all templates <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
