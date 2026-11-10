import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { History } from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import ResumeEditor from "../components/editor/ResumeEditor";
import { emptyResume, normalizeResume } from "../lib/resumeModel";
import { createResume, getResumes } from "../services/resumeApi";
import { TEMPLATES } from "../lib/templates";
import { toast } from "../lib/toast";

export default function CreateResume() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialTemplate = TEMPLATES.some((t) => t.id === params.get("template")) ? params.get("template") : "modern";

  const [resumeData, setResumeData] = useState(() => emptyResume(initialTemplate));
  const [latest, setLatest] = useState(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    getResumes()
      .then((list) => {
        if (list?.length) {
          setLatest(
            [...list].sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))[0]
          );
        }
      })
      .catch(() => {});
  }, []);

  const update = useCallback((updater) => {
    setDirty(true);
    setResumeData(updater);
  }, []);

  const importLatest = () => {
    if (!latest) return;
    // eslint-disable-next-line no-unused-vars
    const { _id, user, createdAt, updatedAt, __v, ...rest } = normalizeResume(latest);
    update(() => ({ ...rest, template: resumeData.template }));
    toast.info("Imported details from your latest resume");
  };

  const handleSave = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    try {
      const saved = await createResume(resumeData);
      setDirty(false);
      toast.success("Resume saved! Here's your preview.");
      navigate(`/resume-preview/${saved._id}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save resume");
    } finally {
      setSaving(false);
    }
  }, [navigate, resumeData, saving]);

  return (
    <DashboardLayout
      wide
      focus
      title="Create resume"
      subtitle="Fill each section — your preview updates as you type."
      seoTitle="Create resume — AI CV"
      actions={
        latest && (
          <button type="button" onClick={importLatest} className="btn btn-glass btn-sm hidden sm:inline-flex">
            <History size={15} /> Import latest
          </button>
        )
      }
    >
      <ResumeEditor
        data={resumeData}
        setData={update}
        onSave={handleSave}
        saving={saving}
        dirty={dirty}
      />
    </DashboardLayout>
  );
}
