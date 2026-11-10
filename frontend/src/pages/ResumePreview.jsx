import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { normalizeResume } from "../lib/resumeModel";
import { getField } from "../lib/fields";
import { applyChanges } from "../lib/aiDiff";
import { useReactToPrint } from "react-to-print";
import { ArrowLeft, FileDown, FileText, Minus, Pencil, Plus, Wand2 } from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import ScoreRing from "../components/motion/ScoreRing";
import { Spinner } from "../components/auth/fields";
import { getResume, updateResume } from "../services/resumeApi";
import { enhanceResume } from "../services/geminiApi";
import { TEMPLATES, getTemplate } from "../lib/templates";
import { scoreResume } from "../lib/resumeScore";
import { toast } from "../lib/toast";

const loadOverlay = () => import("../components/ai/AIEnhanceOverlay");
const loadReview = () => import("../components/ai/AIReview");
const AIEnhanceOverlay = lazy(loadOverlay);
const AIReview = lazy(loadReview);

export default function ResumePreview() {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [ai, setAi] = useState(null); // { status: "working" | "done" }
  const [review, setReview] = useState(null); // { original, enhanced }
  const [applying, setApplying] = useState(false);
  const abortRef = useRef(null);
  const enhancing = Boolean(ai);
  const [exporting, setExporting] = useState(false);
  const [zoom, setZoom] = useState(1);
  const resumeRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: `${resume?.personalInfo?.fullName || "Resume"} - Resume`,
    // A4 pages with print margins; templates drop their screen padding in print.
    pageStyle: `
      @page { size: A4; margin: 10mm 0; }
      html, body { background: #fff !important; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .resume-page { max-width: none !important; }
    `,
  });

  useEffect(() => {
    getResume(id)
      .then(setResume)
      .catch((error) => {
        console.error(error);
        toast.error("Couldn't load this resume");
      });
  }, [id]);

  const switchTemplate = async (templateId) => {
    if (!resume || resume.template === templateId) return;
    const prev = resume;
    const next = { ...resume, template: templateId };
    setResume(next);
    try {
      await updateResume(id, next);
    } catch {
      setResume(prev);
      toast.error("Couldn't switch template");
    }
  };

  const handleEnhance = async () => {
    const original = normalizeResume(resume);
    const controller = new AbortController();
    abortRef.current = controller;
    loadReview(); // warm up so the review opens instantly
    setAi({ status: "working" });

    try {
      // Photos aren't needed by the AI — keep the request small.
      const payload = { ...original, fieldLabel: original.field ? getField(original.field).label : "", personalInfo: { ...original.personalInfo, photo: "" } };
      const result = await enhanceResume(payload, { signal: controller.signal });

      let enhanced;
      try {
        enhanced = normalizeResume(JSON.parse(String(result.enhanced || "").replace(/```json|```/g, "").trim()));
      } catch (parseError) {
        console.error(parseError);
        setAi(null);
        toast.error("AI returned an invalid format — please try again");
        return;
      }

      setAi({ status: "done" });
      setTimeout(() => {
        setAi(null);
        setReview({ original, enhanced });
      }, 1600);
    } catch (error) {
      setAi(null);
      if (error?.code === "ERR_CANCELED" || error?.name === "CanceledError") {
        toast.info("Enhancement cancelled");
        return;
      }
      console.error(error);
      toast.error(error?.response?.data?.message || "AI enhancement failed");
    }
  };

  const cancelEnhance = () => abortRef.current?.abort();

  const applyReview = async (accepted) => {
    if (!review) return;
    setApplying(true);
    const merged = applyChanges(review.original, review.enhanced, accepted);
    try {
      await updateResume(id, merged);
      setResume(merged);
      setReview(null);
      toast.success(`Applied ${accepted.length} AI improvement${accepted.length === 1 ? "" : "s"} ✨`);
    } catch (error) {
      console.error(error);
      toast.error("Couldn't save the changes");
    } finally {
      setApplying(false);
    }
  };

  const handleDocx = async () => {
    setExporting(true);
    try {
      // docx is heavy — load it only when the user exports
      const { downloadDocx } = await import("../utils/downloadDocx");
      await downloadDocx(resume);
      toast.success("DOCX downloaded");
    } catch (error) {
      console.error(error);
      toast.error("DOCX export failed");
    } finally {
      setExporting(false);
    }
  };

  if (!resume) {
    return (
      <DashboardLayout title="Preview" seoTitle="Resume preview — AI CV">
        <div className="glass relative mx-auto h-[70vh] max-w-3xl overflow-hidden rounded-[2rem]">
          <div className="shimmer absolute inset-0" />
        </div>
      </DashboardLayout>
    );
  }

  const template = getTemplate(resume.template);
  const Template = template.component;
  const score = scoreResume(resume);

  return (
    <DashboardLayout
      wide
      title={resume.personalInfo?.fullName || "Resume preview"}
      subtitle={`${template.name} template`}
      seoTitle="Resume preview — AI CV"
      actions={
        <Link to="/dashboard" className="btn btn-glass btn-sm hidden sm:inline-flex">
          <ArrowLeft size={15} /> Back
        </Link>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
        {/* Control panel */}
        <aside className="no-print space-y-4 xl:sticky xl:top-6 xl:self-start">
          <div className="glass-strong rounded-3xl p-5">
            <button
              type="button"
              onPointerEnter={loadOverlay}
              onClick={handleEnhance}
              disabled={enhancing}
              className="btn btn-primary btn-lg w-full"
            >
              {enhancing ? <Spinner /> : <Wand2 size={18} />}
              {enhancing ? "Enhancing…" : "Enhance with AI"}
            </button>
            <p className="mt-2 text-center text-xs text-ink-soft">Rewrites bullets with stronger, keyword-rich language.</p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button type="button" onClick={handlePrint} className="btn btn-glass btn-sm">
                <FileText size={15} className="text-rose-500" /> PDF
              </button>
              <button type="button" onClick={handleDocx} disabled={exporting} className="btn btn-glass btn-sm">
                {exporting ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-violet/30 border-t-violet" /> : <FileDown size={15} className="text-sky-500" />}
                DOCX
              </button>
            </div>
            <Link to={`/edit-resume/${id}`} className="btn btn-ghost btn-sm mt-2 w-full">
              <Pencil size={14} /> Edit content
            </Link>
          </div>

          <div className="glass rounded-3xl p-5">
            <p className="text-sm font-semibold text-ink">Template</p>
            <div className="mt-3 grid grid-cols-5 gap-2 xl:grid-cols-1">
              {TEMPLATES.map((t) => {
                const on = template.id === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => switchTemplate(t.id)}
                    aria-pressed={on}
                    title={t.name}
                    className={`flex items-center gap-3 rounded-2xl p-2 text-left text-sm font-medium transition xl:px-3 ${
                      on ? "bg-white text-ink shadow-[0_8px_20px_-12px_rgb(76_60_180/0.45)] ring-1 ring-violet/20" : "text-ink-soft hover:bg-white/60"
                    }`}
                  >
                    <span className={`mx-auto h-7 w-7 shrink-0 rounded-xl bg-gradient-to-br xl:mx-0 ${t.accent}`} />
                    <span className="hidden xl:inline">{t.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="glass flex items-center gap-4 rounded-3xl p-5">
            <ScoreRing value={score.score} size={76} stroke={7} label="score" />
            <div className="min-w-0">
              <p className={`font-display font-bold ${score.level.tone}`}>{score.level.label}</p>
              {score.missing[0] && (
                <Link to={`/edit-resume/${id}`} className="mt-0.5 block truncate text-xs text-ink-soft hover:text-violet">
                  Next: {score.missing[0].label}
                </Link>
              )}
            </div>
          </div>
        </aside>

        {/* Paper */}
        <section aria-label="Resume" className="min-w-0">
          <div className="no-print mb-3 flex items-center justify-end gap-1">
            <button type="button" onClick={() => setZoom((z) => Math.max(0.6, z - 0.1))} className="btn btn-glass h-9 w-9 px-0" aria-label="Zoom out">
              <Minus size={15} />
            </button>
            <span className="w-14 text-center text-xs font-semibold text-ink-soft">{Math.round(zoom * 100)}%</span>
            <button type="button" onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))} className="btn btn-glass h-9 w-9 px-0" aria-label="Zoom in">
              <Plus size={15} />
            </button>
          </div>

          <div className="perspective overflow-x-auto pb-6">
            <motion.div
              key={template.id}
              initial={{ opacity: 0, rotateX: 8, y: 30 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto origin-top"
              style={{ width: `${Math.round(820 * zoom)}px`, maxWidth: zoom <= 1 ? "100%" : undefined }}
            >
              <div className="overflow-hidden rounded-2xl bg-white shadow-[0_40px_80px_-40px_rgb(76_60_180/0.45)] ring-1 ring-black/5">
                <div ref={resumeRef} className="resume-root">
                  <Template data={resume} />
                </div>
              </div>


            </motion.div>
          </div>
        </section>
      </div>

      {/* Separate boundaries so loading one never suspends the other mid-animation */}
      <Suspense fallback={null}>
        <AnimatePresence>{ai && <AIEnhanceOverlay key="ai" status={ai.status} resume={resume} onCancel={cancelEnhance} />}</AnimatePresence>
      </Suspense>
      <Suspense fallback={null}>
        <AnimatePresence>
          {review && <AIReview key="review" original={review.original} enhanced={review.enhanced} applying={applying} onApply={applyReview} onClose={() => setReview(null)} />}
        </AnimatePresence>
      </Suspense>
    </DashboardLayout>
  );
}
