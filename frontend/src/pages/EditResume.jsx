import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Eye } from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import ResumeEditor from "../components/editor/ResumeEditor";
import { normalizeResume } from "../lib/resumeModel";
import { getResume, updateResume } from "../services/resumeApi";
import { toast } from "../lib/toast";

export default function EditResume() {
  const { id } = useParams();
  const [resumeData, setResumeData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    getResume(id)
      .then((data) => setResumeData(normalizeResume(data)))
      .catch((error) => {
        console.error(error);
        toast.error("Couldn't load this resume");
      });
  }, [id]);

  const update = useCallback((updater) => {
    setDirty(true);
    setResumeData(updater);
  }, []);

  const handleSave = useCallback(async () => {
    if (saving || !resumeData) return;
    setSaving(true);
    try {
      await updateResume(id, resumeData);
      setDirty(false);
      toast.success("Changes saved");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  }, [id, resumeData, saving]);

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
        <ResumeEditor
          data={resumeData}
          setData={update}
          onSave={handleSave}
          saving={saving}
          dirty={dirty}
          saveLabel="Save changes"
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1fr_400px]">
          <div className="glass relative h-[520px] overflow-hidden rounded-[2rem]">
            <div className="shimmer absolute inset-0" />
          </div>
          <div className="glass relative hidden h-[520px] overflow-hidden rounded-[2rem] xl:block">
            <div className="shimmer absolute inset-0" />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
