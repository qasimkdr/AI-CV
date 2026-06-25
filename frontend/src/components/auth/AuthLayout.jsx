import { motion } from "framer-motion";
import {
  FileText,
  Sparkles,
} from "lucide-react";

export default function AuthLayout({
  title,
  subtitle,
  children,
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,#dcf7ff_0,#f8fafc_34%,#ecfdf5_100%)] px-4 py-10">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{
            y: [0, -18, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[8%] top-[14%] h-64 w-64 rounded-full bg-sky-300/30 blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 16, 0],
            x: [0, -12, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[10%] right-[8%] h-72 w-72 rounded-full bg-emerald-300/25 blur-3xl"
        />
      </div>

      <div className="relative z-10 grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1fr_460px]">
        <motion.section
          initial={{
            opacity: 0,
            y: 24,
            rotateX: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
            rotateX: 0,
          }}
          transition={{
            duration: 0.55,
            ease: "easeOut",
          }}
          className="hidden min-h-[560px] rounded-2xl border border-white/70 bg-slate-950 p-10 text-white shadow-2xl shadow-sky-900/20 lg:block"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          <div className="relative h-full overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(56,189,248,0.42),transparent_30%),radial-gradient(circle_at_82%_72%,rgba(52,211,153,0.30),transparent_34%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.16),transparent_36%,rgba(255,255,255,0.08))]" />

            <div className="relative z-10 flex h-full flex-col justify-between p-8">
              <div>
                <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-sky-100 backdrop-blur">
                  <Sparkles size={16} />
                  3D resume workspace
                </div>

                <h2 className="max-w-md text-5xl font-black leading-tight tracking-tight">
                  Build resumes with a smarter visual flow.
                </h2>

                <p className="mt-5 max-w-md text-sm leading-6 text-slate-300">
                  Sign in and continue shaping polished CVs with AI assistance, clean templates, and a dashboard moving toward a full 3D motion experience.
                </p>
              </div>

              <motion.div
                animate={{
                  y: [0, -12, 0],
                  rotateY: [0, -4, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-80 rounded-2xl border border-white/15 bg-white/10 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl"
                style={{
                  transform:
                    "translateZ(42px) rotateX(5deg)",
                }}
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-sky-400 to-emerald-300 text-slate-950 shadow-lg shadow-sky-500/30">
                    <FileText size={24} />
                  </div>
                  <span className="rounded-full bg-emerald-300/15 px-3 py-1 text-xs text-emerald-100">
                    AI Ready
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="h-3 w-48 rounded-full bg-white/60" />
                  <div className="h-2 w-full rounded-full bg-white/25" />
                  <div className="h-2 w-5/6 rounded-full bg-white/20" />
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    <div className="h-16 rounded-xl bg-sky-300/25" />
                    <div className="h-16 rounded-xl bg-white/10" />
                    <div className="h-16 rounded-xl bg-emerald-300/25" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        <motion.div
          initial={{
            opacity: 0,
            y: 28,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.08,
            duration: 0.45,
            ease: "easeOut",
          }}
          className="w-full rounded-2xl border border-white/70 bg-white/85 p-6 shadow-2xl shadow-slate-200/70 backdrop-blur-xl sm:p-8"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-900/20">
              <FileText size={26} />
            </div>

            <h1 className="text-3xl font-black tracking-tight text-slate-950">
              {title}
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {subtitle}
            </p>
          </div>

          {children}
        </motion.div>
      </div>
    </div>
  );
}
