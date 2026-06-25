import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  FileText,
  Plus,
  Sparkles,
  Wand2,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import ResumeCard from "../components/dashboard/ResumeCard";
import { getResumes } from "../services/resumeApi";

const statCards = [
  {
    label: "AI polish",
    value: "Ready",
    icon: Wand2,
  },
  {
    label: "Templates",
    value: "3",
    icon: Sparkles,
  },
];

export default function Dashboard() {
  const [resumes, setResumes] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const data =
        await getResumes();

      const latestThree =
        [...data]
          .sort(
            (a, b) =>
              new Date(
                b.createdAt
              ) -
              new Date(
                a.createdAt
              )
          )
          .slice(0, 3);

      setResumes(latestThree);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <motion.section
          initial={{
            opacity: 0,
            y: 24,
            rotateX: 5,
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
          className="relative overflow-hidden rounded-2xl border border-white/70 bg-slate-950 p-6 text-white shadow-2xl shadow-sky-900/20 md:p-8"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(56,189,248,0.42),transparent_30%),radial-gradient(circle_at_82%_72%,rgba(52,211,153,0.30),transparent_34%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.16),transparent_36%,rgba(255,255,255,0.08))]" />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-sky-100 backdrop-blur">
                <Sparkles size={16} />
                Motion dashboard
              </div>

              <h1 className="max-w-2xl text-4xl font-black leading-tight tracking-tight md:text-5xl">
                Create a resume that feels sharp before anyone reads it.
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">
                Manage your resumes, launch AI enhancement, and move through templates inside a cleaner 3D workspace.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/create-resume"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-black/20 transition hover:-translate-y-0.5"
                >
                  <Plus size={18} />
                  Create Resume
                </Link>

                <Link
                  to="/profile"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
                >
                  Profile Settings
                  <ArrowUpRight size={17} />
                </Link>
              </div>
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
              className="rounded-2xl border border-white/15 bg-white/10 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl"
              style={{
                transform:
                  "translateZ(42px) rotateX(5deg)",
              }}
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-sky-400 to-emerald-300 text-slate-950">
                  <FileText size={24} />
                </div>
                <span className="rounded-full bg-emerald-300/15 px-3 py-1 text-xs text-emerald-100">
                  {resumes.length} recent
                </span>
              </div>

              <div className="space-y-3">
                <div className="h-3 w-48 rounded-full bg-white/60" />
                <div className="h-2 w-full rounded-full bg-white/25" />
                <div className="h-2 w-5/6 rounded-full bg-white/20" />
                <div className="mt-5 grid grid-cols-3 gap-2">
                  <div className="h-20 rounded-xl bg-sky-300/25" />
                  <div className="h-20 rounded-xl bg-white/10" />
                  <div className="h-20 rounded-xl bg-emerald-300/25" />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-200/60 backdrop-blur-xl">
            <p className="text-sm font-semibold text-slate-500">
              Total resumes
            </p>
            <p className="mt-2 text-3xl font-black text-slate-950">
              {resumes.length}
            </p>
          </div>

          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.label}
                className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-200/60 backdrop-blur-xl"
              >
                <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-900/15">
                  <Icon size={18} />
                </div>
                <p className="text-sm font-semibold text-slate-500">
                  {card.label}
                </p>
                <p className="mt-2 text-3xl font-black text-slate-950">
                  {card.value}
                </p>
              </div>
            );
          })}
        </section>

        <section id="recent-resumes">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-950">
                Recent Resumes
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Pick up where you left off.
              </p>
            </div>

            <Link
              to="/create-resume"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-sky-200 hover:text-sky-700"
            >
              <Plus size={16} />
              New resume
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-56 animate-pulse rounded-2xl border border-white/70 bg-white/60 shadow-xl shadow-slate-200/60"
                />
              ))}
            </div>
          ) : resumes.length === 0 ? (
            <div className="rounded-2xl border border-white/70 bg-white/80 p-10 text-center shadow-xl shadow-slate-200/60 backdrop-blur-xl">
              <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-slate-950 text-white">
                <FileText size={26} />
              </div>

              <h3 className="text-xl font-black text-slate-950">
                No resume found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Create your first professional resume and bring it into the new 3D workspace.
              </p>

              <Link
                to="/create-resume"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-lg shadow-slate-900/15"
              >
                <Plus size={18} />
                Create Resume
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {resumes.map((resume) => (
                <ResumeCard
                  key={resume._id}
                  resume={resume}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
