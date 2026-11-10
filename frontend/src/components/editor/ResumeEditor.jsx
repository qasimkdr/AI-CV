import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Briefcase,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  FolderGit2,
  GraduationCap,
  LayoutTemplate,
  Save,
  Sparkles,
  User,
  Wrench,
  X,
} from "lucide-react";

import TemplateSelector from "../templates/TemplateSelector";
import PersonalInfoForm from "../resume/PersonalInfoForm";
import ExperienceForm from "../resume/ExperienceForm";
import EducationForm from "../resume/EducationForm";
import SkillsForm from "../resume/SkillsForm";
import ProjectsForm from "../resume/ProjectsForm";
import CertificationsForm from "../resume/CertificationsForm";
import TemplateThumb from "../templates/TemplateThumb";
import ScoreRing from "../motion/ScoreRing";
import { Spinner } from "../auth/fields";
import { getTemplate } from "../../lib/templates";
import { scoreResume } from "../../lib/resumeScore";

const filled = (v) => (typeof v === "string" ? v.trim() : v);

const STEPS = [
  { id: "template", label: "Template", icon: LayoutTemplate, done: (d) => Boolean(d.template) },
  { id: "personal", label: "Personal", icon: User, done: (d) => Boolean(filled(d.personalInfo?.fullName)) },
  { id: "experience", label: "Experience", icon: Briefcase, done: (d) => d.experience?.length > 0 },
  { id: "education", label: "Education", icon: GraduationCap, done: (d) => d.education?.length > 0 },
  { id: "skills", label: "Skills", icon: Wrench, done: (d) => d.skills?.filter(filled).length > 0 },
  { id: "projects", label: "Projects", icon: FolderGit2, done: (d) => d.projects?.length > 0 },
  { id: "certifications", label: "Certifications", icon: Award, done: (d) => d.certifications?.filter(filled).length > 0 },
];

function LivePreview({ data, className = "" }) {
  const template = getTemplate(data.template);
  return (
    <div className={`overflow-hidden rounded-2xl bg-white ring-1 ring-black/5 ${className}`}>
      <TemplateThumb template={template.component} data={data} aspect="auto" />
    </div>
  );
}

export default function ResumeEditor({ data, setData, onSave, saving, dirty, saveLabel = "Save resume", extraActions }) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [previewOpen, setPreviewOpen] = useState(false);
  const score = useMemo(() => scoreResume(data), [data]);

  const go = (next) => {
    const n = Math.max(0, Math.min(STEPS.length - 1, next));
    setDir(n > step ? 1 : -1);
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Ctrl/Cmd + S saves
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        onSave();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onSave]);

  // warn before leaving with unsaved edits
  useEffect(() => {
    if (!dirty) return;
    const onBefore = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBefore);
    return () => window.removeEventListener("beforeunload", onBefore);
  }, [dirty]);

  const current = STEPS[step].id;
  const form = {
    template: <TemplateSelector selectedTemplate={data.template} setResumeData={setData} />,
    personal: <PersonalInfoForm data={data.personalInfo} summary={data.summary} setResumeData={setData} />,
    experience: <ExperienceForm data={data.experience} setResumeData={setData} />,
    education: <EducationForm data={data.education} setResumeData={setData} />,
    skills: <SkillsForm data={data.skills} setResumeData={setData} />,
    projects: <ProjectsForm data={data.projects} setResumeData={setData} />,
    certifications: <CertificationsForm data={data.certifications} setResumeData={setData} />,
  }[current];

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
      <div className="min-w-0 space-y-5">
        {/* Stepper */}
        <nav aria-label="Resume sections" className="glass no-scrollbar -mx-1 overflow-x-auto rounded-full p-1.5">
          <ol className="flex min-w-max gap-1">
            {STEPS.map((s, i) => {
              const isOn = i === step;
              const done = s.done(data);
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-current={isOn ? "step" : undefined}
                    className={`relative flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition ${
                      isOn ? "text-white" : "text-ink-soft hover:bg-white/70 hover:text-ink"
                    }`}
                  >
                    {isOn && <motion.span layoutId="step-pill" className="bg-brand absolute inset-0 rounded-full shadow-lg" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                    <span className="relative flex items-center gap-2">
                      {done && !isOn ? (
                        <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-white">
                          <Check size={12} strokeWidth={3} />
                        </span>
                      ) : (
                        <s.icon size={16} />
                      )}
                      {s.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Active section */}
        <div className="relative">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={current}
              custom={dir}
              initial={{ opacity: 0, x: dir * 40, rotateY: dir * 6 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: dir * -40, rotateY: dir * -6 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformPerspective: 1200 }}
            >
              {form}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Step controls */}
        <div className="no-print sticky bottom-4 z-20">
          <div className="glass-strong flex items-center justify-between gap-2 rounded-full p-2">
            <button type="button" onClick={() => go(step - 1)} disabled={step === 0} className="btn btn-ghost btn-sm">
              <ChevronLeft size={16} /> <span className="hidden sm:inline">Back</span>
            </button>

            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setPreviewOpen(true)} className="btn btn-glass btn-sm xl:hidden">
                <Eye size={15} /> Preview
              </button>
              <button type="button" onClick={onSave} disabled={saving} className="btn btn-glass btn-sm">
                {saving ? <Spinner /> : <Save size={15} />}
                <span className="hidden sm:inline">{saving ? "Saving…" : saveLabel}</span>
                {dirty && !saving && <span className="h-2 w-2 rounded-full bg-amber-400" title="Unsaved changes" />}
              </button>
            </div>

            {step < STEPS.length - 1 ? (
              <button type="button" onClick={() => go(step + 1)} className="btn btn-primary btn-sm">
                {STEPS[step + 1].label} <ChevronRight size={16} />
              </button>
            ) : (
              <button type="button" onClick={onSave} disabled={saving} className="btn btn-primary btn-sm">
                <Sparkles size={15} /> Finish
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar: score + live preview */}
      <aside className="hidden xl:block">
        <div className="sticky top-6 space-y-4">
          <div className="glass flex items-center gap-5 rounded-3xl p-5">
            <ScoreRing value={score.score} size={92} stroke={8} label="score" />
            <div className="min-w-0">
              <p className={`font-display font-bold ${score.level.tone}`}>{score.level.label}</p>
              {score.missing.slice(0, 2).map((m) => (
                <p key={m.id} className="mt-1 truncate text-xs text-ink-soft">
                  • {m.label}
                </p>
              ))}
              {!score.missing.length && <p className="mt-1 text-xs text-ink-soft">Everything's in place. Nice!</p>}
            </div>
          </div>

          <div className="glass rounded-3xl p-3">
            <div className="flex items-center justify-between px-2 pb-3 pt-1">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Live preview
              </p>
              <span className="text-xs text-ink-soft">{getTemplate(data.template).name}</span>
            </div>
            <div className="max-h-[calc(100dvh-16rem)] overflow-y-auto rounded-2xl">
              <LivePreview data={data} />
            </div>
          </div>
          {extraActions}
        </div>
      </aside>

      {/* Mobile preview sheet */}
      <AnimatePresence>
        {previewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-ink/20 backdrop-blur-sm xl:hidden"
            onClick={() => setPreviewOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong absolute inset-x-0 bottom-0 max-h-[88dvh] overflow-y-auto rounded-t-[2rem] p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="font-display text-lg font-bold text-ink">Live preview</p>
                <button type="button" onClick={() => setPreviewOpen(false)} className="btn btn-glass h-10 w-10 px-0" aria-label="Close preview">
                  <X size={18} />
                </button>
              </div>
              <LivePreview data={data} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
