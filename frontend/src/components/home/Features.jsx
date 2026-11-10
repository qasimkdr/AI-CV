import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, FileStack, LayoutGrid, Repeat, ShieldCheck, Sparkles, Wand2 } from "lucide-react";

import SectionHeading from "./SectionHeading";
import Reveal from "../motion/Reveal";
import TiltCard from "../motion/TiltCard";
import ScoreRing from "../motion/ScoreRing";

const before = "Worked on the website and fixed bugs.";
const after =
  "Rebuilt checkout flow in React, cutting page load by 42% and lifting conversions 18%.";

function TypingDemo() {
  const [text, setText] = useState("");
  useEffect(() => {
    let i = 0;
    let timeout;
    const type = () => {
      i += 1;
      setText(after.slice(0, i));
      timeout = setTimeout(type, i >= after.length ? 2600 : 28);
      if (i >= after.length) i = 0;
    };
    timeout = setTimeout(type, 600);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="mt-6 space-y-3">
      <div className="rounded-2xl border border-rose-100 bg-rose-50/70 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-rose-400">Before</p>
        <p className="mt-1 text-sm text-ink-soft line-through decoration-rose-300">{before}</p>
      </div>
      <div className="rounded-2xl border border-violet/15 bg-white/80 p-4 shadow-sm">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-violet">
          <Sparkles size={12} /> After AI
        </p>
        <p className="mt-1 min-h-[3rem] text-sm font-medium text-ink">
          {text}
          <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-pulse bg-violet" />
        </p>
      </div>
    </div>
  );
}

function Tile({ className = "", children, delay = 0 }) {
  return (
    <Reveal delay={delay} className={className}>
      <TiltCard max={6} className="glass h-full rounded-[1.75rem] p-6 sm:p-7">
        {children}
      </TiltCard>
    </Reveal>
  );
}

function TileHead({ icon: Icon, title, text, tone = "bg-brand" }) {
  return (
    <>
      <span className={`grid h-11 w-11 place-items-center rounded-2xl text-white shadow-lg ${tone}`}>
        <Icon size={20} />
      </span>
      <h3 className="mt-5 text-xl font-bold text-ink">{title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{text}</p>
    </>
  );
}

export default function Features() {
  return (
    <section id="features" className="scroll-mt-24 px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Everything you need"
          icon={LayoutGrid}
          title={<>A resume studio that <span className="text-gradient">does the heavy lifting</span></>}
          subtitle="Write faster, look better and pass the bots. Every tool you need to go from blank page to interview-ready, in one place."
        />

        <div className="mt-16 grid gap-5 md:grid-cols-6">
          <Tile className="md:col-span-4 md:row-span-2">
            <TileHead
              icon={Wand2}
              title="AI that writes like a top recruiter"
              text="One click turns vague duties into measurable achievements with strong action verbs and the right keywords — your facts, sharper words."
            />
            <TypingDemo />
          </Tile>

          <Tile className="md:col-span-2" delay={0.08}>
            <TileHead
              icon={ShieldCheck}
              tone="bg-gradient-to-br from-emerald-400 to-teal-500"
              title="ATS-proof by design"
              text="Clean structure that applicant tracking systems read perfectly."
            />
            <div className="mt-5 flex justify-center">
              <ScoreRing value={96} size={104} stroke={9} label="ATS" />
            </div>
          </Tile>

          <Tile className="md:col-span-2" delay={0.12}>
            <TileHead
              icon={Download}
              tone="bg-gradient-to-br from-sky to-blue-500"
              title="PDF & Word export"
              text="Pixel-perfect PDF or an editable DOCX for any application portal."
            />
            <div className="mt-5 flex gap-3">
              {["PDF", "DOCX"].map((f, i) => (
                <motion.span
                  key={f}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.4 }}
                  className={`grid h-16 w-14 place-items-end rounded-xl p-2 text-[11px] font-bold text-white shadow-md ${
                    i ? "bg-gradient-to-b from-sky to-blue-500" : "bg-gradient-to-b from-blush to-rose-500"
                  }`}
                >
                  {f}
                </motion.span>
              ))}
            </div>
          </Tile>

          <Tile className="md:col-span-2" delay={0.06}>
            <TileHead
              icon={FileStack}
              tone="bg-gradient-to-br from-blush to-peach"
              title="5 designer templates"
              text="Modern, ATS Classic, Creative, Executive and Developer."
            />
          </Tile>

          <Tile className="md:col-span-2" delay={0.1}>
            <TileHead
              icon={Repeat}
              tone="bg-gradient-to-br from-iris to-violet"
              title="Switch designs instantly"
              text="Your content stays put — try a new look in one tap, no retyping."
            />
          </Tile>

          <Tile className="md:col-span-2" delay={0.14}>
            <TileHead
              icon={LayoutGrid}
              tone="bg-gradient-to-br from-mint to-sky"
              title="All resumes, one dashboard"
              text="Tailor a version for every job and track your resume strength."
            />
          </Tile>
        </div>
      </div>
    </section>
  );
}
