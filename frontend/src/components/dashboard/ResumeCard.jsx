import { Link } from "react-router-dom";
import {
  Eye,
  Mail,
  Pencil,
  Phone,
} from "lucide-react";

export default function ResumeCard({
  resume,
}) {
  return (
    <div className="group rounded-2xl border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-200/60 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-200/60">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="line-clamp-1 text-lg font-black text-slate-950">
            {resume.personalInfo
              ?.fullName ||
              "Untitled Resume"}
          </h3>

          <p className="mt-1 text-sm font-medium text-sky-600">
            {resume.template || "modern"} template
          </p>
        </div>

        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-sky-400 to-emerald-300 shadow-lg shadow-sky-500/20 transition group-hover:rotate-6" />
      </div>

      <div className="space-y-3 rounded-xl border border-slate-100 bg-white/70 p-4">
        <p className="flex items-center gap-2 text-sm text-slate-600">
          <Mail
            size={15}
            className="text-sky-500"
          />
          {resume.personalInfo?.email ||
            "Not Provided"}
        </p>

        <p className="flex items-center gap-2 text-sm text-slate-600">
          <Phone
            size={15}
            className="text-emerald-500"
          />
          {resume.personalInfo?.phone ||
            "Not Provided"}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          to={`/edit-resume/${resume._id}`}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800"
        >
          <Pencil size={15} />
          Edit
        </Link>

        <Link
          to={`/resume-preview/${resume._id}`}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
        >
          <Eye size={15} />
          Preview
        </Link>
      </div>
    </div>
  );
}
