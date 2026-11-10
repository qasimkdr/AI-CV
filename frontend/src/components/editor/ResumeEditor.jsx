import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  BookOpen,
  Briefcase,
  Check,
  ChevronLeft,
  ChevronRight,
  Cloud,
  CloudOff,
  Eye,
  FileText,
  FolderKanban,
  GraduationCap,
  HandHeart,
  Heart,
  Languages,
  Library,
  Loader2,
  Save,
  ScrollText,
  Settings2,
  Sparkles,
  User,
  Users,
  Wrench,
  X,
  BadgeCheck,
} from "lucide-react";

import { EditorContext } from "./EditorContext";
import { FieldPicker, SectionManager, TemplatePicker } from "./SetupStep";
import PersonalSection from "./sections/PersonalSection";
import { SECTION_FORMS } from "./sections/registry";
import TemplateThumb from "../templates/TemplateThumb";
import ScoreRing from "../motion/ScoreRing";
import { Spinner } from "../auth/fields";
import { getTemplate } from "../../lib/templates";
import { scoreResume } from "../../lib/resumeScore";
import { getField } from "../../lib/fields";
import { sectionMeta } from "../../lib/sections";

const ICONS = {
  setup: Settings2,
  personal: User,
  summary: FileText,
  experience: Briefcase,
  education: GraduationCap,
  skills: Wrench,
  projects: FolderKanban,
  certifications: BadgeCheck,
  languages: Languages,
  volunteering: HandHeart,
  awards: Award,
  courses: BookOpen,
  publications: Library,
  memberships: Users,
  interests: Heart,
  references: ScrollText,
};

const filled = (v) => typeof v === "string" && v.trim().length > 0;

const isDone = (id, d) => {
  switch (id) {
    case "setup":
      return Boolean(d.field);
    case "personal":
      return filled(d.personalInfo.fullName) && (filled(d.personalInfo.email) || filled(d.personalInfo.phone));
    case "summary":
      return d.summary.trim().split(/\s+/).length >= 12;
    case "references":
      return d.references.mode === "request" || d.references.items.length > 0;
    case "interests":
      return d.interests.length > 0;
    default:
      return Array.isArray(d[id]) && d[id].length > 0;
  }
};

function Burst() {
  const colors = ["#7c5cff", "#38bdf8", "#f472b6", "#fbbf24", "#34d399"];
  return (
    <span className="pointer-events-none absolute inset-0" aria-hidden="true">
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full"
            style={{ background: colors[i % colors.length] }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: Math.cos(a) * 34, y: Math.sin(a) * 34, opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        );
      })}
    </span>
  );
}

function SaveStatus({ state }) {
  if (!state) return null;
  const map = {
    saving: { icon: Loader2, text: "Saving…", cls: "text-ink-soft", spin: true },
    saved: { icon: Cloud, text: "All changes saved", cls: "text-emerald-600" },
    draft: { icon: Cloud, text: "Draft saved on this device", cls: "text-emerald-600" },
    unsaved: { icon: CloudOff, text: "Unsaved changes", cls: "text-amber-600" },
    error: { icon: CloudOff, text: "Couldn't save — retrying", cls: "text-rose-500" },
  }[state];
  if (!map) return null;
  const Icon = map.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${map.cls}`}>
      <Icon size={14} className={map.spin ? "animate-spin" : ""} /> {map.text}
    </span>
  );
}

function LivePreview({ data }) {
  const template = getTemplate(data.template);
  return (
    <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/5">
      <TemplateThumb template={template.component} data={data} aspect="auto" />
    </div>
  );
}

export default function ResumeEditor({ data, setData, onSave, saving, saveState, saveLabel = "Save resume", finishLabel = "Finish & preview" }) {
  const field = getField(data.field);
  const steps = useMemo(
    () => [
      { id: "setup", label: "Setup" },
      { id: "personal", label: "Personal" },
      ...data.sections.filter((s) => s.enabled).map((s) => ({ id: s.id, label: sectionMeta(s.id).label })),
    ],
    [data.sections]
  );

  // Brand-new resumes start with Setup (field, template, sections); existing ones jump straight in.
  const [stepId, setStepId] = useState(() => {
    const fresh = !data.field && !data.personalInfo.fullName && !data.experience.length && !data.education.length;
    return fresh ? "setup" : "personal";
  });
  const [dir, setDir] = useState(1);
  const [previewOpen, setPreviewOpen] = useState(false);
  const score = useMemo(() => scoreResume(data), [data]);

  const index = Math.max(0, steps.findIndex((s) => s.id === stepId));
  const current = steps[index];

  // Celebrate steps that just became complete (computed during render).
  const doneMap = Object.fromEntries(steps.map((s) => [s.id, isDone(s.id, data)]));
  const [prevDone, setPrevDone] = useState(doneMap);
  const [burst, setBurst] = useState(null);
  const newlyDone = steps.find((s) => doneMap[s.id] && prevDone[s.id] === false);
  if (steps.some((s) => doneMap[s.id] !== prevDone[s.id])) {
    setPrevDone(doneMap);
    if (newlyDone) setBurst((b) => ({ id: newlyDone.id, n: (b?.n || 0) + 1 }));
  }
  const doneCount = steps.filter((s) => doneMap[s.id]).length;

  const go = (i) => {
    const n = Math.max(0, Math.min(steps.length - 1, i));
    setDir(n > index ? 1 : -1);
    setStepId(steps[n].id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  const Form = SECTION_FORMS[current.id];
  const meta = sectionMeta(current.id);
  const headings = {
    setup: { q: "Let's set up your resume", d: "Tell us your field so we can tailor examples, suggestions and the AI to you." },
    personal: { q: "How can employers reach you?", d: "Your name, headline and contact details appear at the top of every template." },
  };
  const head = headings[current.id] || { q: meta?.question, d: meta?.label };
  const Icon = ICONS[current.id] || FileText;

  return (
    <EditorContext.Provider value={{ data, setData, field }}>
      <div className="grid gap-6 lg:grid-cols-[230px_minmax(0,1fr)] 2xl:grid-cols-[230px_minmax(0,1fr)_400px]">
        {/* Progress rail */}
        <nav aria-label="Resume steps" className="hidden lg:block">
          <div className="glass sticky top-6 rounded-[1.75rem] p-3">
            <div className="mb-3 px-2 pt-1">
              <div className="flex items-center justify-between text-xs font-semibold text-ink-soft">
                <span>Progress</span>
                <span>
                  {doneCount}/{steps.length}
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-violet/10">
                <motion.div className="bg-brand h-full rounded-full" animate={{ width: `${(doneCount / steps.length) * 100}%` }} transition={{ type: "spring", stiffness: 120, damping: 20 }} />
              </div>
            </div>
            <ol className="max-h-[calc(100dvh-12rem)] space-y-0.5 overflow-y-auto pr-1">
              {steps.map((s, i) => {
                const StepIcon = ICONS[s.id] || FileText;
                const on = i === index;
                const done = doneMap[s.id];
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => go(i)}
                      aria-current={on ? "step" : undefined}
                      className={`relative flex w-full items-center gap-3 rounded-2xl px-2.5 py-2 text-left text-sm font-medium transition ${on ? "bg-white text-ink shadow-[0_8px_20px_-14px_rgb(76_60_180/0.6)]" : "text-ink-soft hover:bg-white/60 hover:text-ink"}`}
                    >
                      <span className={`relative grid h-8 w-8 shrink-0 place-items-center rounded-xl transition ${done ? "bg-emerald-500 text-white" : on ? "bg-brand text-white" : "bg-violet/10 text-violet"}`}>
                        {done ? <Check size={15} strokeWidth={3} /> : <StepIcon size={15} />}
                        <AnimatePresence>{burst?.id === s.id && <Burst key={burst.n} />}</AnimatePresence>
                      </span>
                      <span className="truncate">{s.label}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </nav>

        <div className="min-w-0 space-y-5">
          {/* Mobile stepper */}
          <div className="glass no-scrollbar -mx-1 overflow-x-auto rounded-full p-1.5 lg:hidden">
            <ol className="flex min-w-max gap-1">
              {steps.map((s, i) => {
                const StepIcon = ICONS[s.id] || FileText;
                return (
                  <li key={s.id}>
                    <button type="button" onClick={() => go(i)} className={`flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition ${i === index ? "bg-brand text-white" : doneMap[s.id] ? "text-emerald-600" : "text-ink-soft"}`}>
                      {doneMap[s.id] && i !== index ? <Check size={13} strokeWidth={3} /> : <StepIcon size={13} />}
                      {s.label}
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          <AnimatePresence mode="wait" custom={dir}>
            <motion.section
              key={current.id}
              initial={{ opacity: 0, x: dir * 40, rotateY: dir * 5 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: dir * -40, rotateY: dir * -5 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformPerspective: 1200 }}
              className="glass-strong relative overflow-visible rounded-[2rem] p-6 sm:p-8"
            >
              <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-gradient-to-br from-violet/15 to-sky/15 blur-2xl" />
              <div className="relative mb-7 flex items-start gap-4">
                <motion.span initial={{ rotate: -12, scale: 0.8 }} animate={{ rotate: 0, scale: 1 }} className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand text-white shadow-lg">
                  <Icon size={22} />
                </motion.span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet">
                    Step {index + 1} of {steps.length}
                    {current.id !== "setup" && field && data.field ? ` · ${field.label}` : ""}
                  </p>
                  <h2 className="mt-1 text-2xl font-extrabold text-ink sm:text-3xl">{head.q}</h2>
                  {head.d && current.id !== "setup" && current.id !== "personal" ? null : <p className="mt-1 text-sm text-ink-soft">{head.d}</p>}
                </div>
              </div>

              <div className="relative">
                {current.id === "setup" ? (
                  <div className="space-y-9">
                    <div>
                      <h3 className="mb-3 font-display text-lg font-bold text-ink">1. What field are you in?</h3>
                      <FieldPicker />
                    </div>
                    <div>
                      <h3 className="mb-3 font-display text-lg font-bold text-ink">2. Pick a template</h3>
                      <TemplatePicker />
                    </div>
                    <div>
                      <h3 className="mb-1 font-display text-lg font-bold text-ink">3. Choose & order your sections</h3>
                      <p className="mb-3 text-sm text-ink-soft">Drag to reorder. Hidden sections keep their content but won't appear on the resume.</p>
                      <SectionManager />
                    </div>
                  </div>
                ) : current.id === "personal" ? (
                  <PersonalSection />
                ) : Form ? (
                  <Form />
                ) : null}
              </div>
            </motion.section>
          </AnimatePresence>

          {/* Bottom nav */}
          <div className="no-print sticky bottom-4 z-20">
            <div className="glass-strong flex items-center justify-between gap-2 rounded-full p-2">
              <button type="button" onClick={() => go(index - 1)} disabled={index === 0} className="btn btn-ghost btn-sm">
                <ChevronLeft size={16} /> <span className="hidden sm:inline">Back</span>
              </button>
              <div className="flex min-w-0 items-center gap-2">
                <span className="hidden md:inline">
                  <SaveStatus state={saveState} />
                </span>
                <button type="button" onClick={() => setPreviewOpen(true)} className="btn btn-glass btn-sm 2xl:hidden">
                  <Eye size={15} /> <span className="hidden sm:inline">Preview</span>
                </button>
                <button type="button" onClick={onSave} disabled={saving} className="btn btn-glass btn-sm">
                  {saving ? <Spinner /> : <Save size={15} />}
                  <span className="hidden sm:inline">{saving ? "Saving…" : saveLabel}</span>
                </button>
              </div>
              {index < steps.length - 1 ? (
                <button type="button" onClick={() => go(index + 1)} className="btn btn-primary btn-sm">
                  <span className="max-w-[9rem] truncate">{steps[index + 1].label}</span> <ChevronRight size={16} />
                </button>
              ) : (
                <button type="button" onClick={() => onSave({ finish: true })} disabled={saving} className="btn btn-primary btn-sm">
                  <Sparkles size={15} /> {finishLabel}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Preview column */}
        <aside className="hidden 2xl:block">
          <div className="sticky top-6 space-y-4">
            <div className="glass flex items-center gap-4 rounded-3xl p-4">
              <ScoreRing value={score.score} size={84} stroke={8} label="score" />
              <div className="min-w-0">
                <p className={`font-display font-bold ${score.level.tone}`}>{score.level.label}</p>
                {score.missing.slice(0, 2).map((m) => (
                  <p key={m.id} className="mt-0.5 truncate text-xs text-ink-soft">
                    • {m.label}
                  </p>
                ))}
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
              <div className="max-h-[calc(100dvh-15rem)] overflow-y-auto rounded-2xl">
                <LivePreview data={data} />
              </div>
            </div>
          </div>
        </aside>

        <AnimatePresence>
          {previewOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-ink/20 backdrop-blur-sm 2xl:hidden" onClick={() => setPreviewOpen(false)}>
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-strong absolute inset-x-0 bottom-0 mx-auto max-h-[90dvh] max-w-3xl overflow-y-auto rounded-t-[2rem] p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ScoreRing value={score.score} size={44} stroke={5} label="" />
                    <p className="font-display text-lg font-bold text-ink">Live preview</p>
                  </div>
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
    </EditorContext.Provider>
  );
}
