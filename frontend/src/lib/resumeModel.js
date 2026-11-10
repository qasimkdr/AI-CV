import { getField } from "./fields";
import { SECTION_IDS, sectionsForField } from "./sections";

const DEFAULT_SECTIONS = ["summary", "experience", "education", "skills", "projects", "certifications"];

export const emptyResume = (template = "modern", fieldId = "") => {
  const field = fieldId ? getField(fieldId) : null;
  return {
    template: field && template === "auto" ? field.template : template === "auto" ? "modern" : template,
    field: fieldId,
    sections: sectionsForField(field ? field.sections : DEFAULT_SECTIONS),
    personalInfo: {
      fullName: "",
      title: "",
      email: "",
      phone: "",
      address: "",
      photo: "",
      showPhoto: false,
      links: [],
      details: { dateOfBirth: "", nationality: "", visaStatus: "", drivingLicense: "" },
      showDetails: false,
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    volunteering: [],
    awards: [],
    courses: [],
    publications: [],
    memberships: [],
    interests: [],
    references: { mode: "request", items: [] },
  };
};

const arr = (v) => (Array.isArray(v) ? v : []);

/** Upgrades any saved resume (including the old developer-only format). */
export function normalizeResume(r = {}) {
  const base = emptyResume();
  const p = r.personalInfo || {};

  let links = arr(p.links).filter((l) => l && (l.url || l.label));
  if (!links.length) {
    if (p.linkedin) links.push({ label: "LinkedIn", url: p.linkedin });
    if (p.github) links.push({ label: "GitHub", url: p.github });
  }

  // Sections: keep saved order, append anything new; legacy docs get sections that have data.
  let sections = arr(r.sections).filter((s) => SECTION_IDS.includes(s?.id));
  if (!sections.length) {
    const hasData = (id) => {
      const v = r[id];
      return Array.isArray(v) ? v.length > 0 : typeof v === "string" ? v.trim() : false;
    };
    const enabled = DEFAULT_SECTIONS.filter((id) => ["experience", "education", "skills"].includes(id) || hasData(id));
    sections = sectionsForField([...enabled, ...SECTION_IDS.filter((id) => !enabled.includes(id) && hasData(id))]);
  } else {
    const seen = new Set(sections.map((s) => s.id));
    sections = [...sections.map((s) => ({ id: s.id, enabled: s.enabled !== false })), ...SECTION_IDS.filter((id) => !seen.has(id)).map((id) => ({ id, enabled: false }))];
  }

  return {
    ...r,
    template: String(r.template || "modern").toLowerCase(),
    field: r.field || "",
    sections,
    personalInfo: {
      ...base.personalInfo,
      ...p,
      linkedin: "",
      github: "",
      links,
      details: { ...base.personalInfo.details, ...(p.details || {}) },
    },
    summary: r.summary || "",
    experience: arr(r.experience),
    education: arr(r.education),
    skills: arr(r.skills).map((s) => (typeof s === "string" ? { name: s, level: "", category: "professional" } : { name: "", level: "", category: "professional", ...s })),
    projects: arr(r.projects),
    certifications: arr(r.certifications).map((c) => (typeof c === "string" ? { name: c } : c)),
    languages: arr(r.languages),
    volunteering: arr(r.volunteering),
    awards: arr(r.awards),
    courses: arr(r.courses),
    publications: arr(r.publications),
    memberships: arr(r.memberships),
    interests: arr(r.interests).filter((i) => typeof i === "string"),
    references: { mode: r.references?.mode === "list" ? "list" : "request", items: arr(r.references?.items) },
  };
}
