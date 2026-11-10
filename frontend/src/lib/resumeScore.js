// Lightweight, client-side resume strength score. Pure function so it can be
// used anywhere (dashboard cards, editor, preview).

const filled = (v) =>
  typeof v === "string" ? v.trim().length > 0 : Boolean(v);

export function scoreResume(resume = {}) {
  const p = resume.personalInfo || {};
  const experience = resume.experience || [];
  const education = resume.education || [];
  const skills = (resume.skills || []).filter(filled);
  const projects = resume.projects || [];
  const certifications = (resume.certifications || []).filter(filled);

  const checks = [
    {
      id: "name",
      label: "Add your full name",
      weight: 10,
      done: filled(p.fullName),
    },
    {
      id: "contact",
      label: "Add email and phone",
      weight: 10,
      done: filled(p.email) && filled(p.phone),
    },
    {
      id: "links",
      label: "Link LinkedIn or GitHub",
      weight: 8,
      done: filled(p.linkedin) || filled(p.github),
    },
    {
      id: "experience",
      label: "Add work experience",
      weight: 22,
      done: experience.some((e) => filled(e.company) || filled(e.position)),
    },
    {
      id: "impact",
      label: "Describe impact in your experience (40+ words)",
      weight: 12,
      done: experience.some(
        (e) => (e.description || "").trim().split(/\s+/).length >= 40
      ),
    },
    {
      id: "education",
      label: "Add education",
      weight: 12,
      done: education.some((e) => filled(e.institute) || filled(e.degree)),
    },
    {
      id: "skills",
      label: "List at least 6 skills",
      weight: 12,
      done: skills.length >= 6,
    },
    {
      id: "projects",
      label: "Showcase a project",
      weight: 9,
      done: projects.some((pr) => filled(pr.title)),
    },
    {
      id: "certs",
      label: "Add a certification",
      weight: 5,
      done: certifications.length > 0,
    },
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

  return {
    score,
    level,
    checks,
    missing: checks.filter((c) => !c.done),
  };
}
