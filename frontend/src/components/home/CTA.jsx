import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

import Reveal from "../motion/Reveal";

export default function CTA() {
  return (
    <section className="px-4 py-20 sm:px-6">
      <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] border border-white bg-brand-soft p-10 text-center shadow-[0_40px_90px_-40px_rgb(124_92_255/0.55)] sm:p-16">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {[
            "left-[6%] top-[18%] h-20 w-20 from-violet/60 to-iris/40",
            "right-[8%] top-[12%] h-14 w-14 from-sky/60 to-mint/40",
            "left-[14%] bottom-[12%] h-12 w-12 from-blush/60 to-peach/40",
            "right-[14%] bottom-[16%] h-24 w-24 from-iris/50 to-sky/40",
          ].map((c, i) => (
            <motion.span
              key={c}
              animate={{ y: [0, -18, 0], rotate: [0, 12, 0] }}
              transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
              className={`absolute rounded-[35%] bg-gradient-to-br shadow-xl backdrop-blur ${c}`}
            />
          ))}
        </div>

        <div className="relative">
          <span className="eyebrow">
            <Sparkles size={13} /> Your next role is closer than you think
          </span>
          <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-[1.08] text-ink sm:text-6xl">
            Ready to build a resume <span className="text-gradient">you're proud of?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ink-soft">
            Join AI CV free and have a polished, ATS-ready resume in minutes.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/signup" className="btn btn-primary btn-lg">
              Start building — free <ArrowRight size={18} />
            </Link>
            <Link to="/templates" className="btn btn-glass btn-lg">
              See templates
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
