// Friendly, NON-blocking checks. Users can always save — these only point out
// things that look missing or mistyped. Each issue knows which step it's on.

const t = (v) => (typeof v === "string" ? v.trim() : "");
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ym = (v) => (/^\d{4}(-\d{2})?$/.test(t(v)) ? t(v).padEnd(7, "-00") : null);

const dateOrder = (start, end, current) => {
  const a = ym(start);
  const b = ym(end);
  return !current && a && b && b < a;
};

export function checkResume(d) {
  const issues = [];
  const add = (step, message, level = "warn") => issues.push({ step, message, level });
  const p = d.personalInfo || {};

  if (!t(p.fullName)) add("personal", "Your name is empty — the resume will show “Your Name”.");
  if (t(p.email) && !EMAIL.test(t(p.email))) add("personal", `“${t(p.email)}” doesn't look like a valid email address.`);
  if (!t(p.email) && !t(p.phone)) add("personal", "Add an email or phone number so employers can contact you.");
  if (t(p.phone) && t(p.phone).replace(/\D/g, "").length < 7) add("personal", "Your phone number looks too short.");
  (p.links || []).forEach((l) => {
    if (t(l.url) && !/\.[a-z]{2,}/i.test(t(l.url))) add("personal", `The ${l.label || "link"} URL “${t(l.url)}” looks incomplete.`);
  });
  if (p.showPhoto && !p.photo) add("personal", "Photo is switched on but no photo is uploaded.", "info");

  const enabled = new Set((d.sections || []).filter((s) => s.enabled).map((s) => s.id));

  const entries = (key, label, nameOf, missing) => {
    if (!enabled.has(key)) return;
    (d[key] || []).forEach((e, i) => {
      const n = nameOf(e) || `${label} #${i + 1}`;
      const empty = !Object.entries(e || {}).some(([k, v]) => k !== "current" && t(v));
      if (empty) return add(key, `${label} #${i + 1} is empty and will be skipped.`, "info");
      missing(e, n);
    });
  };

  entries("experience", "Experience", (e) => t(e.position) || t(e.company), (e, n) => {
    if (!t(e.position)) add("experience", `${n}: job title is missing.`);
    if (!t(e.company)) add("experience", `${n}: employer is missing.`, "info");
    if (!t(e.startDate)) add("experience", `${n}: start date is missing.`, "info");
    if (dateOrder(e.startDate, e.endDate, e.current)) add("experience", `${n}: end date is before the start date.`);
  });
  entries("education", "Education", (e) => t(e.degree) || t(e.institute), (e, n) => {
    if (!t(e.institute)) add("education", `${n}: school / institution is missing.`, "info");
    if (dateOrder(e.startYear, e.endYear, e.current)) add("education", `${n}: end date is before the start date.`);
  });
  entries("volunteering", "Volunteering", (e) => t(e.role) || t(e.organization), (e, n) => {
    if (dateOrder(e.startDate, e.endDate, e.current)) add("volunteering", `${n}: end date is before the start date.`);
  });
  entries("certifications", "Certification", (c) => t(c.name), (c, n) => {
    if (!t(c.name)) add("certifications", `${n}: name is missing — it won't be shown.`);
  });
  entries("projects", "Project", (x) => t(x.title), (x, n) => {
    if (!t(x.title)) add("projects", `${n}: project name is missing.`, "info");
  });

  if (enabled.has("references") && d.references?.mode === "list" && !(d.references.items || []).some((r) => t(r.name))) {
    add("references", "No references added yet — “Available upon request” will be shown instead.", "info");
  }

  return issues;
}

/** Maps a server error path like "experience.0.startDate" to an editor step. */
export const stepForPath = (path = "") => {
  const root = path.split(".")[0];
  return root === "personalInfo" ? "personal" : root;
};
