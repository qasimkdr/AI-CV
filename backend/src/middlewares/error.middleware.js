import { isDbConnected } from "../config/db.js";

/** Fails fast with 503 instead of hanging when MongoDB is down. */
export const requireDb = (req, res, next) => {
  if (isDbConnected()) return next();
  res.status(503).json({ message: "Database is temporarily unavailable. Please try again shortly." });
};

const LABELS = {
  experience: "Experience",
  education: "Education",
  projects: "Project",
  certifications: "Certification",
  languages: "Language",
  volunteering: "Volunteering",
  awards: "Award",
  courses: "Course",
  publications: "Publication",
  memberships: "Membership",
  skills: "Skill",
  personalInfo: "Personal info",
  references: "References",
};

// "experience.0.startDate" -> "Experience #1 (start date)"
const humanPath = (path = "") => {
  const [root, index, ...rest] = path.split(".");
  const label = LABELS[root] || root;
  const field = (Number.isNaN(Number(index)) ? [index, ...rest] : rest)
    .filter(Boolean)
    .join(" ")
    .replace(/([A-Z])/g, " $1")
    .toLowerCase();
  const num = Number.isNaN(Number(index)) ? "" : ` #${Number(index) + 1}`;
  return `${label}${num}${field ? ` (${field})` : ""}`;
};

export const notFound = (req, res) => {
  res.status(404).json({ message: `Not found: ${req.method} ${req.originalUrl}` });
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid JSON body" });
  }
  if (err?.type === "entity.too.large") {
    return res.status(413).json({ message: "Request body is too large" });
  }
  if (err?.name === "CastError") {
    return res.status(404).json({ message: "Resource not found" });
  }
  if (err?.name === "ValidationError") {
    const fields = Object.values(err.errors || {}).map((e) => ({ path: e.path, label: humanPath(e.path), message: e.kind === "required" ? "is required" : "has an invalid value" }));
    return res.status(400).json({
      message: fields.length ? `Please check: ${fields.map((f) => `${f.label} ${f.message}`).join("; ")}` : "Some information couldn't be saved. Please check your entries.",
      fields,
    });
  }
  if (err?.message?.startsWith("CORS")) {
    return res.status(403).json({ message: err.message });
  }

  const status = err.status || err.statusCode || 500;
  if (status >= 500) console.error("[error]", err);
  res.status(status).json({
    message: status >= 500 ? "Something went wrong on our side" : err.message,
  });
};
