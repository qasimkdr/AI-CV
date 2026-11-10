// Pure helpers shared by the resume templates and the DOCX export.
import { normalizeResume as upgrade } from "../../lib/resumeModel";

const clean = (v) => (typeof v === "string" ? v.trim() : "");
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2022-03" → "Mar 2022"; anything else is shown as typed. */
export const formatDate = (v) => {
  const s = clean(v);
  const m = s.match(/^(\d{4})-(\d{2})$/);
  return m ? `${MONTHS[Number(m[2]) - 1] || ""} ${m[1]}`.trim() : s;
};

export const dateRange = (start, end, current) => {
  const a = formatDate(start);
  const b = current ? "Present" : formatDate(end);
  if (a && b) return `${a} – ${b}`;
  return a || b || "";
};

const nonEmpty = (obj, keys) => keys.some((k) => clean(obj?.[k]));

/** Display model: cleaned, formatted, empty entries removed, sections in order. */
export function normalizeResume(data = {}) {
  const d = upgrade(data);
  const p = d.personalInfo;

  const r = {
    personal: {
      fullName: clean(p.fullName),
      title: clean(p.title),
      email: clean(p.email),
      phone: clean(p.phone),
      address: clean(p.address),
      photo: p.showPhoto && typeof p.photo === "string" && p.photo.startsWith("data:image") ? p.photo : "",
      links: p.links.map((l) => ({ label: clean(l.label) || "Link", url: clean(l.url) })).filter((l) => l.url),
      details: p.showDetails
        ? [
            ["Date of birth", formatDate(p.details.dateOfBirth)],
            ["Nationality", clean(p.details.nationality)],
            ["Visa / work permit", clean(p.details.visaStatus)],
            ["Driving licence", clean(p.details.drivingLicense)],
          ]
            .filter(([, v]) => v)
            .map(([label, value]) => ({ label, value }))
        : [],
    },
    summary: clean(d.summary),
    experience: d.experience
      .filter((e) => nonEmpty(e, ["position", "company", "description"]))
      .map((e) => ({
        title: clean(e.position),
        org: clean(e.company),
        location: clean(e.location),
        type: clean(e.type),
        date: dateRange(e.startDate, e.endDate, e.current),
        description: clean(e.description),
      })),
    education: d.education
      .filter((e) => nonEmpty(e, ["degree", "institute"]))
      .map((e) => ({
        title: [clean(e.degree), clean(e.fieldOfStudy)].filter(Boolean).join(", "),
        org: clean(e.institute),
        location: clean(e.location),
        date: dateRange(e.startYear, e.endYear, e.current),
        grade: clean(e.grade),
        honors: clean(e.honors),
        description: clean(e.coursework) ? `Relevant coursework: ${clean(e.coursework)}` : "",
      })),
    skills: d.skills.map((s) => ({ name: clean(s.name), level: clean(s.level), category: s.category || "professional" })).filter((s) => s.name),
    projects: d.projects
      .filter((x) => nonEmpty(x, ["title", "description"]))
      .map((x) => ({ title: clean(x.title), role: clean(x.role), link: clean(x.link), description: clean(x.description) })),
    certifications: d.certifications
      .filter((c) => clean(c.name))
      .map((c) => ({
        title: clean(c.name),
        org: clean(c.issuer),
        date: [formatDate(c.date), clean(c.expiry) ? `exp. ${formatDate(c.expiry)}` : ""].filter(Boolean).join(" · "),
        meta: clean(c.credentialId) ? `ID ${clean(c.credentialId)}` : "",
      })),
    languages: d.languages.map((l) => ({ name: clean(l.name), level: clean(l.level) })).filter((l) => l.name),
    volunteering: d.volunteering
      .filter((v) => nonEmpty(v, ["role", "organization", "description"]))
      .map((v) => ({ title: clean(v.role), org: clean(v.organization), date: dateRange(v.startDate, v.endDate, v.current), description: clean(v.description) })),
    awards: d.awards
      .filter((a) => clean(a.title))
      .map((a) => ({ title: clean(a.title), org: clean(a.issuer), date: formatDate(a.date), description: clean(a.description) })),
    courses: d.courses
      .filter((c) => clean(c.name))
      .map((c) => ({ title: clean(c.name), org: clean(c.institution), date: formatDate(c.date) })),
    publications: d.publications
      .filter((x) => clean(x.title))
      .map((x) => ({ title: clean(x.title), org: clean(x.publisher), date: formatDate(x.date), link: clean(x.url) })),
    memberships: d.memberships
      .filter((m) => clean(m.name))
      .map((m) => ({ title: clean(m.name), org: clean(m.role), date: dateRange(m.startDate, m.endDate, m.current) })),
    interests: d.interests.map(clean).filter(Boolean),
    references: {
      mode: d.references.mode,
      items: d.references.items
        .filter((x) => clean(x.name))
        .map((x) => ({ name: clean(x.name), title: [clean(x.title), clean(x.company)].filter(Boolean).join(", "), contact: clean(x.contact) })),
    },
  };

  const hasContent = (id) => {
    if (id === "summary") return Boolean(r.summary);
    if (id === "references") return r.references.mode === "request" || r.references.items.length > 0;
    return r[id]?.length > 0;
  };

  r.order = d.sections.filter((s) => s.enabled && hasContent(s.id)).map((s) => s.id);
  return r;
}

/** Turns "line\nline" or "• a • b" into bullet items. */
export function toBullets(text = "") {
  return text
    .split(/\n+|(?:^|\s)[•▪●]\s+/)
    .map((s) => s.replace(/^\s*[-*•▪●]\s*/, "").trim())
    .filter(Boolean);
}

const stripProtocol = (url) => url.replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/$/, "");
const withProtocol = (url) => (/^https?:\/\//i.test(url) ? url : `https://${url}`);

const iconFor = (label = "") => {
  const l = label.toLowerCase();
  if (l.includes("linkedin")) return "linkedin";
  if (l.includes("github")) return "github";
  return "link";
};

/** Contact entries with proper links, in a stable order. */
export function contactItems(personal) {
  return [
    personal.email && { key: "email", icon: "email", label: personal.email, href: `mailto:${personal.email}` },
    personal.phone && { key: "phone", icon: "phone", label: personal.phone, href: `tel:${personal.phone.replace(/[^\d+]/g, "")}` },
    personal.address && { key: "address", icon: "address", label: personal.address },
    ...personal.links.map((l, i) => ({ key: `link-${i}`, icon: iconFor(l.label), label: stripProtocol(l.url), href: withProtocol(l.url) })),
  ].filter(Boolean);
}

export const linkHref = withProtocol;
export const linkLabel = stripProtocol;

export const initials = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

export const SECTION_TITLES = {
  summary: "Profile",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certifications & Licenses",
  languages: "Languages",
  volunteering: "Volunteering",
  awards: "Awards",
  courses: "Courses & Training",
  publications: "Publications",
  memberships: "Memberships",
  interests: "Interests",
  references: "References",
};

export const SKILL_GROUP_LABELS = { professional: "Professional", tools: "Tools & Software", soft: "Soft Skills" };
