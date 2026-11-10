import { Link } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";

import TiltCard from "../motion/TiltCard";
import TemplateThumb from "../templates/TemplateThumb";
import { getTemplate } from "../../lib/templates";
import { scoreResume } from "../../lib/resumeScore";

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "";

export default function ResumeCard({ resume, onDelete }) {
  const template = getTemplate(resume.template);
  const { score } = scoreResume(resume);

  return (
    <TiltCard max={6} className="glass group h-full rounded-[1.75rem] p-3">
      <Link to={`/resume-preview/${resume._id}`} className="block overflow-hidden rounded-[1.25rem] ring-1 ring-black/5">
        <div className="transition duration-700 group-hover:scale-[1.03]">
          <TemplateThumb template={template.component} data={resume} aspect={0.9} />
        </div>
      </Link>

      <div className="px-2 pb-1 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-display text-lg font-bold text-ink">
              {resume.personalInfo?.fullName || "Untitled resume"}
            </h3>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-soft">
              <span className={`h-2 w-2 rounded-full bg-gradient-to-br ${template.accent}`} />
              {template.name} · {fmt(resume.updatedAt || resume.createdAt)}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
              score >= 85 ? "bg-emerald-50 text-emerald-600" : score >= 60 ? "bg-sky-50 text-sky-600" : "bg-amber-50 text-amber-600"
            }`}
            title="Resume strength"
          >
            {score}%
          </span>
        </div>

        <div className="mt-4 flex gap-2">
          <Link to={`/edit-resume/${resume._id}`} className="btn btn-primary btn-sm flex-1">
            <Pencil size={14} /> Edit
          </Link>
          <Link to={`/resume-preview/${resume._id}`} className="btn btn-glass btn-sm flex-1">
            <Eye size={14} /> Preview
          </Link>
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(resume)}
              className="btn btn-danger btn-sm w-10 px-0"
              aria-label={`Delete ${resume.personalInfo?.fullName || "resume"}`}
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>
    </TiltCard>
  );
}
