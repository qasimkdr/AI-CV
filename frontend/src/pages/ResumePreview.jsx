import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useReactToPrint } from "react-to-print";
import { ArrowLeft, FileDown, FileText, Minus, Pencil, Plus, Sparkles, Wand2 } from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import ScoreRing from "../components/motion/ScoreRing";
import { Spinner } from "../components/auth/fields";
import { getResume, updateResume } from "../services/resumeApi";
import { enhanceResume } from "../services/geminiApi";
import { TEMPLATES, getTemplate } from "../lib/templates";
import { scoreResume } from "../lib/resumeScore";
import { toast } from "../lib/toast";

export default function ResumePreview() {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [enhancing, setEnhancing] = useState(false);
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
    setEnhancing(true);
    try {
      const result = await enhanceResume(resume);

      let enhancedData;
      try {
        const cleaned = String(result.enhanced || "")
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();
        enhancedData = JSON.parse(cleaned);
      } catch (parseError) {
        console.error(parseError);
        toast.error("AI returned an invalid format — please try again");
        return;
      }

      // keep identity + chosen design if the AI omits them
      const merged = { ...resume, ...enhancedData, template: enhancedData.template || resume.template };
      await updateResume(id, merged);
      setResume(merged);
      toast.success("Resume enhanced with AI ✨");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "AI enhancement failed");
    } finally {
      setEnhancing(false);
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

              <AnimatePresence>
                {enhancing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 overflow-hidden rounded-2xl bg-white/50 backdrop-blur-[2px]"
                  >
                    <motion.div
                      animate={{ y: ["-10%", "110%"] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-violet/25 to-transparent"
                    />
                    <div className="sticky top-1/3 grid place-items-center pt-40">
                      <span className="glass-strong flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-violet">
                        <Sparkles size={16} className="animate-spin [animation-duration:3s]" />
                        AI is polishing your resume…
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
