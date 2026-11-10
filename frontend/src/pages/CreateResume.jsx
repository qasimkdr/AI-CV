import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { History, RotateCcw, X } from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import ResumeEditor from "../components/editor/ResumeEditor";
import { createResume, getResumes } from "../services/resumeApi";
import { emptyResume, normalizeResume } from "../lib/resumeModel";
import { TEMPLATES } from "../lib/templates";
import { toast } from "../lib/toast";

const DRAFT_KEY = "aicv:create-draft";

const readDraft = () => {
  try {
    const d = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
    return d?.data ? d : null;
  } catch {
    return null;
  }
};

export default function CreateResume() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const template = TEMPLATES.some((t) => t.id === params.get("template")) ? params.get("template") : "modern";

  const [resumeData, setResumeData] = useState(() => emptyResume(template));
  const [draft, setDraft] = useState(() => readDraft());
  const [latest, setLatest] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveState, setSaveState] = useState(null);
  const touched = useRef(false);

  useEffect(() => {
    getResumes()
      .then((list) => list?.length && setLatest([...list].sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))[0]))
      .catch(() => {});
  }, []);

  // Local draft autosave so nothing is lost before the first save.
  useEffect(() => {
    if (!touched.current) return;
    const id = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ data: resumeData, at: Date.now() }));
        setSaveState("draft");
      } catch {
        /* storage full or blocked */
      }
    }, 700);
    return () => clearTimeout(id);
  }, [resumeData]);

  const update = useCallback((updater) => {
    touched.current = true;
    setSaveState("unsaved");
    setResumeData(updater);
  }, []);

  const restoreDraft = () => {
    setResumeData(normalizeResume(draft.data));
    setDraft(null);
    toast.success("Draft restored");
  };

  const importLatest = () => {
    if (!latest) return;
    // eslint-disable-next-line no-unused-vars
    const { _id, userId, createdAt, updatedAt, __v, ...rest } = normalizeResume(latest);
    update(() => ({ ...rest, template: resumeData.template }));
    toast.info("Imported details from your latest resume");
  };

  const handleSave = useCallback(
    async (opts = {}) => {
      if (saving) return;
      setSaving(true);
      setSaveState("saving");
      try {
        const saved = await createResume(resumeData);
        localStorage.removeItem(DRAFT_KEY);
        toast.success("Resume saved!");
        navigate(opts.finish ? `/resume-preview/${saved._id}` : `/edit-resume/${saved._id}`, { replace: true });
      } catch (error) {
        console.error(error);
        setSaveState("error");
        toast.error(error?.response?.data?.message || "Failed to save resume");
      } finally {
        setSaving(false);
      }
    },
    [navigate, resumeData, saving]
  );

  return (
    <DashboardLayout
      wide
      focus
      title="Create resume"
      subtitle="Answer a few questions — your resume builds itself as you type."
      seoTitle="Create resume — AI CV"
      actions={
        latest && (
          <button type="button" onClick={importLatest} className="btn btn-glass btn-sm hidden sm:inline-flex">
            <History size={15} /> Import latest
          </button>
        )
      }
    >
      <AnimatePresence>
        {draft && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass-tint mb-5 flex flex-wrap items-center gap-3 rounded-3xl px-5 py-3">
            <RotateCcw size={18} className="text-violet" />
            <p className="flex-1 text-sm text-ink">
              You have an unsaved draft from {new Date(draft.at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}.
            </p>
            <button type="button" onClick={restoreDraft} className="btn btn-primary btn-sm">
              Restore draft
            </button>
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem(DRAFT_KEY);
                setDraft(null);
              }}
              className="btn btn-ghost btn-sm h-9 w-9 px-0"
              aria-label="Discard draft"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <ResumeEditor data={resumeData} setData={update} onSave={handleSave} saving={saving} saveState={saveState} />
    </DashboardLayout>
  );
}
