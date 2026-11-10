// Pure helpers shared by the resume templates and the DOCX export.

const clean = (v) => (typeof v === "string" ? v.trim() : "");

/** Strips empty entries so templates never render blank bullets/headings. */
export function normalizeResume(data = {}) {
  const p = data.personalInfo || {};
  return {
    personal: {
      fullName: clean(p.fullName),
      title: clean(p.title),
      email: clean(p.email),
      phone: clean(p.phone),
      address: clean(p.address),
      linkedin: clean(p.linkedin),
      github: clean(p.github),
    },
    summary: clean(data.summary),
    experience: (data.experience || [])
      .map((e) => ({
        position: clean(e?.position),
        company: clean(e?.company),
        startDate: clean(e?.startDate),
        endDate: clean(e?.endDate),
        description: clean(e?.description),
      }))
      .filter((e) => e.position || e.company || e.description),
    education: (data.education || [])
      .map((e) => ({
        degree: clean(e?.degree),
        institute: clean(e?.institute),
        startYear: clean(e?.startYear),
        endYear: clean(e?.endYear),
      }))
      .filter((e) => e.degree || e.institute),
    projects: (data.projects || [])
      .map((p) => ({ title: clean(p?.title), description: clean(p?.description) }))
      .filter((p) => p.title || p.description),
    skills: (data.skills || []).map(clean).filter(Boolean),
    certifications: (data.certifications || []).map(clean).filter(Boolean),
  };
}

export const dateRange = (start, end) => {
  if (start && end) return `${start} – ${end}`;
  return start || end || "";
};

/** Turns "line\nline" or "• a • b" into bullet items; single sentences stay a paragraph. */
export function toBullets(text = "") {
  return text
    .split(/\n+|(?:^|\s)[•▪●]\s+/)
    .map((s) => s.replace(/^\s*[-*•▪●]\s*/, "").trim())
    .filter(Boolean);
}

const stripProtocol = (url) => url.replace(/^https?:\/\//i, "").replace(/\/$/, "");

const withProtocol = (url) => (/^https?:\/\//i.test(url) ? url : `https://${url}`);

/** Contact entries with proper links, in a stable order. */
export function contactItems(personal) {
  return [
    personal.email && { key: "email", label: personal.email, href: `mailto:${personal.email}` },
    personal.phone && { key: "phone", label: personal.phone, href: `tel:${personal.phone.replace(/[^\d+]/g, "")}` },
    personal.address && { key: "address", label: personal.address },
    personal.linkedin && { key: "linkedin", label: stripProtocol(personal.linkedin), href: withProtocol(personal.linkedin) },
    personal.github && { key: "github", label: stripProtocol(personal.github), href: withProtocol(personal.github) },
  ].filter(Boolean);
}

export const initials = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
