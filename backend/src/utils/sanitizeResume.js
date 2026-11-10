// Coerces client data into the shapes the Resume schema expects, so odd or
// partial input (missing fields, numbers, nulls, stray keys) never blocks a save.
// Empty entries are dropped; every field is optional.

const str = (v, max = 5000) => {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v.slice(0, max);
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return "";
};
const bool = (v) => v === true || v === "true";
const arr = (v, max = 50) => (Array.isArray(v) ? v.slice(0, max) : []);
const hasText = (obj, keys) => keys.some((k) => str(obj?.[k]).trim());

const pickStrings = (obj, keys, max) => Object.fromEntries(keys.map((k) => [k, str(obj?.[k], max)]));

const list = (value, keys, { bools = [], required = keys } = {}) =>
  arr(value)
    .filter((item) => item && typeof item === "object" && hasText(item, required))
    .map((item) => ({ ...pickStrings(item, keys), ...Object.fromEntries(bools.map((b) => [b, bool(item[b])])) }));

const SECTION_IDS = new Set([
  "summary", "experience", "education", "skills", "projects", "certifications", "languages",
  "volunteering", "awards", "courses", "publications", "memberships", "interests", "references",
]);

export function sanitizeResume(body = {}) {
  const out = {};
  const has = (k) => body[k] !== undefined;

  if (has("template")) out.template = str(body.template, 40) || "modern";
  if (has("field")) out.field = str(body.field, 40);
  if (has("summary")) out.summary = str(body.summary, 3000);

  if (has("sections")) {
    out.sections = arr(body.sections, 30)
      .filter((s) => s && SECTION_IDS.has(s.id))
      .map((s) => ({ id: s.id, enabled: s.enabled !== false }));
  }

  if (has("personalInfo")) {
    const p = body.personalInfo || {};
    const photo = str(p.photo, 1_500_000);
    out.personalInfo = {
      ...pickStrings(p, ["fullName", "title", "email", "phone", "address", "linkedin", "github"], 300),
      photo: photo.startsWith("data:image/") ? photo : "",
      showPhoto: bool(p.showPhoto),
      showDetails: bool(p.showDetails),
      links: arr(p.links, 10)
        .filter((l) => l && str(l.url).trim())
        .map((l) => ({ label: str(l.label, 40), url: str(l.url, 300) })),
      details: pickStrings(p.details || {}, ["dateOfBirth", "nationality", "visaStatus", "drivingLicense"], 120),
    };
  }

  if (has("experience"))
    out.experience = list(body.experience, ["company", "position", "location", "type", "startDate", "endDate", "description"], {
      bools: ["current"],
      required: ["company", "position", "description"],
    });
  if (has("education"))
    out.education = list(body.education, ["institute", "degree", "fieldOfStudy", "location", "startYear", "endYear", "grade", "honors", "coursework"], {
      bools: ["current"],
      required: ["institute", "degree", "fieldOfStudy"],
    });
  if (has("projects")) out.projects = list(body.projects, ["title", "role", "link", "description"], { required: ["title", "description"] });
  if (has("volunteering"))
    out.volunteering = list(body.volunteering, ["role", "organization", "startDate", "endDate", "description"], {
      bools: ["current"],
      required: ["role", "organization", "description"],
    });
  if (has("awards")) out.awards = list(body.awards, ["title", "issuer", "date", "description"], { required: ["title"] });
  if (has("courses")) out.courses = list(body.courses, ["name", "institution", "date"], { required: ["name"] });
  if (has("publications")) out.publications = list(body.publications, ["title", "publisher", "date", "url"], { required: ["title"] });
  if (has("memberships"))
    out.memberships = list(body.memberships, ["name", "role", "startDate", "endDate"], { bools: ["current"], required: ["name"] });
  if (has("languages")) out.languages = list(body.languages, ["name", "level"], { required: ["name"] });

  if (has("skills")) {
    out.skills = arr(body.skills, 60)
      .map((s) => (typeof s === "string" ? { name: s } : s && typeof s === "object" ? s : null))
      .filter((s) => s && str(s.name).trim())
      .map((s) => ({ name: str(s.name, 80).trim(), level: str(s.level, 20), category: str(s.category, 20) || "professional" }));
  }

  if (has("certifications")) {
    out.certifications = arr(body.certifications, 30)
      .map((c) => (typeof c === "string" ? { name: c } : c && typeof c === "object" ? c : null))
      .filter((c) => c && str(c.name).trim())
      .map((c) => pickStrings(c, ["name", "issuer", "date", "expiry", "credentialId"], 200));
  }

  if (has("interests")) out.interests = arr(body.interests, 30).map((i) => str(i, 80).trim()).filter(Boolean);

  if (has("references")) {
    const r = body.references || {};
    out.references = {
      mode: r.mode === "list" ? "list" : "request",
      items: list(r.items, ["name", "title", "company", "contact"], { required: ["name"] }),
    };
  }

  return out;
}
