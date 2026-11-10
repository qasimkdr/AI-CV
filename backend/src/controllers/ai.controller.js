import { generateJson } from "../services/gemini.service.js";

// Only the parts AI may rewrite. Personal info, education, dates and
// certifications are never sent back from the model, so they can't be lost.
const SCHEMA = {
  type: "object",
  properties: {
    summary: { type: "string", description: "2-3 sentence professional summary" },
    experience: {
      type: "array",
      items: {
        type: "object",
        properties: {
          index: { type: "integer" },
          description: { type: "string" },
        },
        required: ["index", "description"],
      },
    },
    projects: {
      type: "array",
      items: {
        type: "object",
        properties: {
          index: { type: "integer" },
          description: { type: "string" },
        },
        required: ["index", "description"],
      },
    },
    skills: { type: "array", items: { type: "string" } },
  },
  required: ["experience", "projects", "skills"],
};

const str = (v, max = 4000) => (typeof v === "string" ? v.slice(0, max) : "");

// Case-insensitive de-duplication that keeps the first spelling.
const uniqueSkills = (list) => {
  const seen = new Set();
  return list
    .filter((s) => typeof s === "string" && s.trim())
    .map((s) => s.trim())
    .filter((s) => (seen.has(s.toLowerCase()) ? false : seen.add(s.toLowerCase())))
    .slice(0, 40);
};

export const enhanceResumeController = async (req, res, next) => {
  try {
    const resume = req.body || {};
    const experience = Array.isArray(resume.experience) ? resume.experience.slice(0, 15) : [];
    const projects = Array.isArray(resume.projects) ? resume.projects.slice(0, 15) : [];
    const skills = Array.isArray(resume.skills) ? resume.skills.filter((s) => typeof s === "string").slice(0, 40) : [];

    if (!experience.length && !projects.length && !skills.length) {
      return res.status(400).json({ message: "Add some experience, projects or skills before enhancing." });
    }

    const input = {
      targetName: str(resume.personalInfo?.fullName, 120),
      summary: str(resume.summary, 1500),
      experience: experience.map((e, index) => ({
        index,
        position: str(e?.position, 200),
        company: str(e?.company, 200),
        description: str(e?.description),
      })),
      projects: projects.map((p, index) => ({
        index,
        title: str(p?.title, 200),
        description: str(p?.description),
      })),
      skills,
      education: (resume.education || []).slice(0, 5).map((e) => str(e?.degree, 200)),
    };

    const prompt = `You are an expert ATS resume writer.
Rewrite the candidate's content to be concise, achievement-focused and keyword-rich.

Rules:
- Keep every fact true. Never invent employers, numbers, dates, degrees or tools that are not implied by the input.
- Experience & project descriptions: 2-4 short bullet-style sentences separated by newlines, each starting with a strong action verb. Quantify only when the input contains numbers.
- Return one entry per input item, using the same "index".
- Skills: clean up naming/casing, remove duplicates, keep the candidate's skills (you may add at most 3 closely related ones clearly implied by their experience).
- Summary: 2-3 sentences, no first person.
- Output must match the JSON schema exactly.

Candidate data:
${JSON.stringify(input)}`;

    const { data, model } = await generateJson({ prompt, schema: SCHEMA });

    // Merge AI output into the original resume, preserving everything else.
    const byIndex = (arr) => new Map((Array.isArray(arr) ? arr : []).map((x) => [x.index, x]));
    const expAi = byIndex(data.experience);
    const projAi = byIndex(data.projects);

    const enhanced = {
      ...resume,
      summary: str(data.summary, 1500) || resume.summary || "",
      experience: experience.map((e, i) => ({
        ...e,
        description: str(expAi.get(i)?.description) || e.description || "",
      })),
      projects: projects.map((p, i) => ({
        ...p,
        description: str(projAi.get(i)?.description) || p.description || "",
      })),
      skills:
        Array.isArray(data.skills) && data.skills.length
          ? uniqueSkills(data.skills)
          : skills,
    };

    // `enhanced` stays a JSON string for compatibility with the frontend.
    res.json({ enhanced: JSON.stringify(enhanced), model });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    next(error);
  }
};
