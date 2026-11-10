import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Eye } from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import ResumeEditor from "../components/editor/ResumeEditor";
import { getResume, updateResume } from "../services/resumeApi";
import { normalizeResume } from "../lib/resumeModel";
import { toast } from "../lib/toast";

export default function EditResume() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveState, setSaveState] = useState("saved");
  const dirty = useRef(false);
  const latest = useRef(null);

  useEffect(() => {
    getResume(id)
      .then((data) => setResumeData(normalizeResume(data)))
      .catch((error) => {
        console.error(error);
        toast.error("Couldn't load this resume");
      });
  }, [id]);

  useEffect(() => {
    latest.current = resumeData;
  }, [resumeData]);

  const persist = useCallback(async () => {
    if (!latest.current) return false;
    dirty.current = false;
    setSaveState("saving");
    try {
      await updateResume(id, latest.current);
      setSaveState(dirty.current ? "unsaved" : "saved");
      return true;
    } catch (error) {
      console.error(error);
      dirty.current = true;
      setSaveState("error");
      return false;
    }
  }, [id]);

  // Autosave 2s after the last change.
  useEffect(() => {
    if (!dirty.current) return;
    const t = setTimeout(persist, 2000);
    return () => clearTimeout(t);
  }, [resumeData, persist]);

  // Warn before closing the tab with unsaved edits.
  useEffect(() => {
    const onBefore = (e) => {
      if (dirty.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onBefore);
    return () => window.removeEventListener("beforeunload", onBefore);
  }, []);

  const update = useCallback((updater) => {
    dirty.current = true;
    setSaveState("unsaved");
    setResumeData(updater);
  }, []);

  const handleSave = useCallback(
    async (opts = {}) => {
      setSaving(true);
      const ok = await persist();
      setSaving(false);
      if (!ok) return toast.error("Failed to save changes");
      if (opts.finish) navigate(`/resume-preview/${id}`);
      else toast.success("Changes saved");
    },
    [id, navigate, persist]
  );

  return (
    <DashboardLayout
      wide
      focus
      title="Edit resume"
      subtitle={resumeData?.personalInfo?.fullName || "Loading…"}
      seoTitle="Edit resume — AI CV"
      actions={
        <Link to={`/resume-preview/${id}`} className="btn btn-glass btn-sm hidden sm:inline-flex">
          <Eye size={15} /> Preview
        </Link>
      }
    >
      {resumeData ? (
        <ResumeEditor data={resumeData} setData={update} onSave={handleSave} saving={saving} saveState={saveState} saveLabel="Save now" />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[230px_1fr]">
          <div className="glass relative hidden h-[520px] overflow-hidden rounded-[2rem] lg:block">
            <div className="shimmer absolute inset-0" />
          </div>
          <div className="glass relative h-[520px] overflow-hidden rounded-[2rem]">
            <div className="shimmer absolute inset-0" />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
