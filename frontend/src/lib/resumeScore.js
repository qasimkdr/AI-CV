// Client-side resume strength score, field-agnostic.
import { normalizeResume } from "./resumeModel";

const filled = (v) => (typeof v === "string" ? v.trim().length > 0 : Boolean(v));
const bulletCount = (text = "") => text.split(/\n+/).filter((l) => l.trim()).length;

export function scoreResume(resume = {}) {
  const r = normalizeResume(resume);
  const p = r.personalInfo;
  const enabled = new Set(r.sections.filter((s) => s.enabled).map((s) => s.id));
  const extras = ["certifications", "languages", "volunteering", "awards", "courses", "projects", "publications", "memberships"];

  const checks = [
    { id: "name", label: "Add your full name", weight: 8, done: filled(p.fullName) },
    { id: "contact", label: "Add email and phone", weight: 8, done: filled(p.email) && filled(p.phone) },
    { id: "title", label: "Add a job title / headline", weight: 6, done: filled(p.title) },
    { id: "summary", label: "Write a 2–3 sentence summary", weight: 10, done: r.summary.trim().split(/\s+/).length >= 15 },
    { id: "experience", label: "Add work experience", weight: 18, done: r.experience.some((e) => filled(e.position) || filled(e.company)) || (!enabled.has("experience") && r.field === "student") },
    { id: "dates", label: "Add dates to your experience", weight: 6, done: r.experience.length > 0 && r.experience.every((e) => filled(e.startDate)) },
    { id: "impact", label: "Add 2+ achievement bullets to a role", weight: 12, done: r.experience.some((e) => bulletCount(e.description) >= 2) },
    { id: "education", label: "Add education", weight: 10, done: r.education.some((e) => filled(e.degree) || filled(e.institute)) },
    { id: "skills", label: "List at least 6 skills", weight: 12, done: r.skills.filter((s) => filled(s.name)).length >= 6 },
    { id: "extra", label: "Add certifications, languages or another section", weight: 6, done: extras.some((k) => r[k]?.length > 0) },
    { id: "links", label: "Add a LinkedIn or portfolio link", weight: 4, done: p.links.some((l) => filled(l.url)) },
  ];

  const total = checks.reduce((s, c) => s + c.weight, 0);
  const got = checks.reduce((s, c) => s + (c.done ? c.weight : 0), 0);
  const score = Math.round((got / total) * 100);

  const level =
    score >= 85
      ? { label: "Interview-ready", tone: "text-emerald-600" }
      : score >= 60
        ? { label: "Looking strong", tone: "text-sky-600" }
        : score >= 30
          ? { label: "Getting there", tone: "text-amber-600" }
          : { label: "Just started", tone: "text-rose-500" };

  return { score, level, checks, missing: checks.filter((c) => !c.done) };
}
