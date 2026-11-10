import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  FileText,
  Flame,
  LayoutTemplate,
  Lightbulb,
  Plus,
  Search,
  Sparkles,
  Target,
  Wand2,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import ResumeCard from "../components/dashboard/ResumeCard";
import ScoreRing from "../components/motion/ScoreRing";
import Reveal from "../components/motion/Reveal";
import { deleteResume, getResumes } from "../services/resumeApi";
import { useAuth } from "../context/AuthContext";
import { scoreResume } from "../lib/resumeScore";
import { touchStreak } from "../lib/streak";
import { toast } from "../lib/toast";

const TIPS = [
  "Start each bullet with a strong verb: led, built, grew, reduced, launched.",
  "Numbers grab attention — add a metric to at least three bullets.",
  "Mirror keywords from the job description in your skills section.",
  "Keep it to one page if you have under 10 years of experience.",
  "Put your strongest, most relevant experience first.",
  "Link a portfolio or GitHub — recruiters love proof of work.",
  "Run AI Enhance after big edits to tighten your wording.",
];

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
};

export default function Dashboard() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [streak] = useState(() => touchStreak());
  const tip = TIPS[new Date().getDate() % TIPS.length];

  useEffect(() => {
    (async () => {
      try {
        const data = await getResumes();
        setResumes(
          [...(data || [])].sort(
            (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
          )
        );
      } catch (error) {
        console.error(error);
        toast.error("Couldn't load your resumes");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (resume) => {
    if (!window.confirm(`Delete "${resume.personalInfo?.fullName || "Untitled resume"}"? This can't be undone.`)) return;
    const prev = resumes;
    setResumes((r) => r.filter((x) => x._id !== resume._id));
    try {
      await deleteResume(resume._id);
      toast.success("Resume deleted");
    } catch {
      setResumes(prev);
      toast.error("Delete failed — please try again");
    }
  };

  const latest = resumes[0];
  const latestScore = useMemo(() => (latest ? scoreResume(latest) : null), [latest]);
  const avg = resumes.length
    ? Math.round(resumes.reduce((s, r) => s + scoreResume(r).score, 0) / resumes.length)
    : 0;
  const templatesUsed = new Set(resumes.map((r) => r.template || "modern")).size;

  const filtered = resumes.filter((r) =>
    `${r.personalInfo?.fullName || ""} ${r.template || ""}`.toLowerCase().includes(query.toLowerCase())
  );

  const firstName = user?.name?.split(" ")[0];

  return (
    <DashboardLayout title="Dashboard" seoTitle="Dashboard — AI CV">
      <div className="space-y-6">
        {/* Welcome hero */}
        <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="glass-strong relative overflow-hidden rounded-[2rem] p-7 sm:p-9">
            <div aria-hidden="true" className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gradient-to-br from-violet/25 to-sky/25 blur-3xl" />
            <div aria-hidden="true" className="absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-blush/20 blur-3xl" />
            <div className="relative">
              <div className="flex flex-wrap items-center gap-2">
                <span className="eyebrow">
                  <Sparkles size={13} /> Resume studio
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600">
                  <Flame size={13} /> {streak.count}-day streak
                </span>
              </div>
              <h2 className="mt-5 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
                {greeting()}
                {firstName ? `, ${firstName}` : ""}! <span className="inline-block origin-[70%_70%] animate-[wave_2.4s_ease-in-out_infinite]">👋</span>
              </h2>
              <p className="mt-3 max-w-lg text-ink-soft">
                {resumes.length
                  ? "Every small edit moves you closer to your next interview. Pick up where you left off."
                  : "Let's build your first standout resume — it takes just a few minutes."}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/create-resume" className="btn btn-primary">
                  <Plus size={18} /> New resume
                </Link>
                {latest && (
                  <Link to={`/resume-preview/${latest._id}`} className="btn btn-glass">
                    <Wand2 size={17} /> Enhance latest with AI
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="glass relative flex flex-col items-center justify-center rounded-[2rem] p-7 text-center">
            {latestScore ? (
              <>
                <ScoreRing value={latestScore.score} size={136} stroke={11} label="strength" />
                <p className={`mt-4 font-display text-lg font-bold ${latestScore.level.tone}`}>{latestScore.level.label}</p>
                {latestScore.missing[0] ? (
                  <Link
                    to={`/edit-resume/${latest._id}`}
                    className="mt-2 inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-violet"
                  >
                    <Target size={14} /> Next: {latestScore.missing[0].label}
                    <ArrowRight size={14} />
                  </Link>
                ) : (
                  <p className="mt-2 text-sm text-ink-soft">Your latest resume is complete. 🎉</p>
                )}
              </>
            ) : (
              <>
                <div className="grid h-20 w-20 place-items-center rounded-3xl bg-brand-soft text-violet">
                  <FileText size={34} />
                </div>
                <p className="mt-4 font-display text-lg font-bold text-ink">Your score lives here</p>
                <p className="mt-1 text-sm text-ink-soft">Create a resume to see its strength score.</p>
              </>
            )}
          </div>
        </section>

        {/* Stats + tip */}
        <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Resumes", value: resumes.length, icon: FileText, tone: "from-violet to-iris" },
            { label: "Avg. strength", value: `${avg}%`, icon: Target, tone: "from-sky to-blue-500" },
            { label: "Templates used", value: `${templatesUsed}/5`, icon: LayoutTemplate, tone: "from-blush to-peach" },
            { label: "Best streak", value: `${streak.best}d`, icon: Flame, tone: "from-amber-400 to-orange-500" },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 0.05} className="glass rounded-3xl p-5">
              <span className={`grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-md ${s.tone}`}>
                <s.icon size={18} />
              </span>
              <p className="mt-4 font-display text-3xl font-extrabold text-ink">{loading ? "–" : s.value}</p>
              <p className="text-sm text-ink-soft">{s.label}</p>
            </Reveal>
          ))}
        </section>

        <Reveal className="glass-tint flex items-start gap-4 rounded-3xl p-5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white text-amber-500 shadow-sm">
            <Lightbulb size={19} />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">Tip of the day</p>
            <p className="mt-0.5 text-sm text-ink-soft">{tip}</p>
          </div>
        </Reveal>

        {/* Resumes */}
        <section id="resumes" className="scroll-mt-6 pt-2">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-ink">My resumes</h2>
              <p className="text-sm text-ink-soft">Tailor a version for every role you apply to.</p>
            </div>
            {resumes.length > 2 && (
              <label className="relative block sm:w-72">
                <span className="sr-only">Search resumes</span>
                <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search resumes…"
                  className="field h-11 rounded-full pl-10"
                />
              </label>
            )}
          </div>

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="glass relative h-80 overflow-hidden rounded-[1.75rem]">
                  <div className="shimmer absolute inset-0" />
                </div>
              ))}
            </div>
          ) : resumes.length === 0 ? (
            <div className="glass rounded-[2rem] px-6 py-16 text-center">
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-brand text-white shadow-xl"
              >
                <FileText size={34} />
              </motion.div>
              <h3 className="mt-6 text-2xl font-bold text-ink">No resumes yet</h3>
              <p className="mx-auto mt-2 max-w-sm text-ink-soft">
                Create your first resume, let AI polish it, and download it in minutes.
              </p>
              <Link to="/create-resume" className="btn btn-primary mt-6">
                <Plus size={18} /> Create my first resume
              </Link>
            </div>
          ) : (
            <motion.div layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence>
                {filtered.map((resume) => (
                  <motion.div
                    key={resume._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <ResumeCard resume={resume} onDelete={handleDelete} />
                  </motion.div>
                ))}
                <motion.div key="new" layout>
                  <Link
                    to="/create-resume"
                    className="group grid h-full min-h-72 place-items-center rounded-[1.75rem] border-2 border-dashed border-violet/25 bg-white/30 p-6 text-center transition hover:border-violet/50 hover:bg-white/60"
                  >
                    <span>
                      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand text-white shadow-lg transition group-hover:scale-110 group-hover:rotate-6">
                        <Plus size={24} />
                      </span>
                      <span className="mt-4 block font-display text-lg font-bold text-ink">New resume</span>
                      <span className="text-sm text-ink-soft">Start from any template</span>
                    </span>
                  </Link>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
