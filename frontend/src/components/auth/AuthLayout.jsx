import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

import Logo from "../brand/Logo";
import Seo from "../seo/Seo";
import Scene3D from "../three/Scene3D";

const perks = [
  "AI rewrites your experience in one click",
  "5 ATS-friendly, designer templates",
  "Export to PDF and Word instantly",
];

export default function AuthLayout({ title, subtitle, children, side }) {
  return (
    <>
      <Seo />
      <div className="aurora" aria-hidden="true" />

      <div className="grid min-h-[100dvh] lg:grid-cols-[1.1fr_1fr]">
        {/* Visual side */}
        <aside className="relative hidden overflow-hidden p-6 lg:block">
          <div className="glass relative flex h-full flex-col justify-between overflow-hidden rounded-[2.5rem] p-10">
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-violet/10 via-sky/10 to-blush/10" />
            <Logo className="relative" />

            <Scene3D
              scene="shapes"
              className="absolute inset-x-0 bottom-[36%] top-16"
              fallback={null}
            />

            <div className="relative">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="max-w-md text-4xl font-extrabold leading-tight text-ink xl:text-5xl"
              >
                {side?.title || (
                  <>
                    Your story, <span className="text-gradient">beautifully told.</span>
                  </>
                )}
              </motion.h2>
              <ul className="mt-6 space-y-3">
                {perks.map((p, i) => (
                  <motion.li
                    key={p}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.1 }}
                    className="flex items-center gap-3 text-ink-soft"
                  >
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-violet shadow-sm">
                      <Check size={14} strokeWidth={3} />
                    </span>
                    {p}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Form side */}
        <main className="flex items-center justify-center px-4 py-10 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md"
          >
            <div className="mb-8 flex justify-center lg:hidden">
              <Logo />
            </div>

            <div className="glass-strong rounded-[2rem] p-7 sm:p-9">
              <span className="eyebrow">
                <Sparkles size={13} /> AI resume studio
              </span>
              <h1 className="mt-5 text-3xl font-extrabold text-ink sm:text-4xl">{title}</h1>
              <p className="mt-2 text-ink-soft">{subtitle}</p>
              <div className="mt-8">{children}</div>
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
}
