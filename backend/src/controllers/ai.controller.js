import { generateJson } from "../services/gemini.service.js";

const str = (v, max = 4000) => (typeof v === "string" ? v.slice(0, max) : "");
const arr = (v, max = 15) => (Array.isArray(v) ? v.slice(0, max) : []);

const indexed = {
  type: "array",
  items: {
    type: "object",
    properties: { index: { type: "integer" }, description: { type: "string" } },
    required: ["index", "description"],
  },
};

// Only the parts AI may rewrite. Personal info, education, dates and
// certifications are never sent back from the model, so they can't be lost.
const ENHANCE_SCHEMA = {
  type: "object",
  properties: {
    summary: { type: "string", description: "2-3 sentence professional summary" },
    experience: indexed,
    projects: indexed,
    volunteering: indexed,
    skills: { type: "array", items: { type: "string" } },
  },
  required: ["summary", "experience", "projects", "skills"],
};

const skillName = (s) => (typeof s === "string" ? s : str(s?.name, 80));

// Case-insensitive de-duplication that keeps the first spelling.
const uniqueStrings = (list, max = 40) => {
  const seen = new Set();
  return list
    .filter((s) => typeof s === "string" && s.trim())
    .map((s) => s.trim())
    .filter((s) => (seen.has(s.toLowerCase()) ? false : seen.add(s.toLowerCase())))
    .slice(0, max);
};

export const enhanceResumeController = async (req, res, next) => {
  try {
    const resume = req.body || {};
    const experience = arr(resume.experience);
    const projects = arr(resume.projects);
    const volunteering = arr(resume.volunteering);
    const skills = arr(resume.skills, 40);
    const skillNames = skills.map(skillName).filter(Boolean);

    if (!experience.length && !projects.length && !skillNames.length && !volunteering.length && !str(resume.summary).trim()) {
      return res.status(400).json({ message: "Add some experience, skills or a summary before enhancing." });
    }

    const input = {
      field: str(resume.fieldLabel || resume.field, 80) || "general",
      headline: str(resume.personalInfo?.title, 120),
      summary: str(resume.summary, 1500),
      experience: experience.map((e, index) => ({ index, position: str(e?.position, 200), employer: str(e?.company, 200), description: str(e?.description) })),
      projects: projects.map((p, index) => ({ index, title: str(p?.title, 200), role: str(p?.role, 120), description: str(p?.description) })),
      volunteering: volunteering.map((v, index) => ({ index, role: str(v?.role, 200), organization: str(v?.organization, 200), description: str(v?.description) })),
      skills: skillNames,
      education: arr(resume.education, 5).map((e) => [str(e?.degree, 120), str(e?.fieldOfStudy, 120)].filter(Boolean).join(" in ")),
    };

    const prompt = `You are an expert resume writer for ${input.field} professionals.
Rewrite the candidate's content to be concise, achievement-focused and keyword-rich for their field.

Rules:
- Keep every fact true. Never invent employers, numbers, dates, degrees, licences or tools that are not implied by the input.
- Use the vocabulary recruiters in this field expect (${input.field}).
- Descriptions: 2-4 short bullet-style lines separated by "\\n", each starting with a strong action verb, no leading bullet characters. Quantify only when the input contains numbers.
- Return one entry per input item, using the same "index". Leave an item's description empty only if the input had nothing to work with.
- Skills: fix naming/casing, remove duplicates, keep the candidate's skills; you may add at most 3 closely related ones clearly implied by their experience.
- Summary: 2-3 sentences, no first person. Write one even if none was given, based on the rest of the resume.
- Output must match the JSON schema exactly.

Candidate data:
${JSON.stringify(input)}`;

    const { data, model } = await generateJson({ prompt, schema: ENHANCE_SCHEMA });

    const byIndex = (list) => new Map((Array.isArray(list) ? list : []).map((x) => [x.index, x]));
    const mergeDescriptions = (items, aiList) => {
      const ai = byIndex(aiList);
      return items.map((it, i) => ({ ...it, description: str(ai.get(i)?.description).trim() || it?.description || "" }));
    };

    // Keep levels/categories for skills the user already had.
    const existing = new Map(skills.map((s) => [skillName(s).toLowerCase(), s]));
    const aiSkills = uniqueStrings(Array.isArray(data.skills) ? data.skills : []);
    const mergedSkills = aiSkills.length
      ? aiSkills.map((name) => {
          const prev = existing.get(name.toLowerCase());
          return prev && typeof prev === "object" ? { ...prev, name } : { name, level: "", category: "professional" };
        })
      : skills;

    const enhanced = {
      ...resume,
      summary: str(data.summary, 1500).trim() || resume.summary || "",
      experience: mergeDescriptions(experience, data.experience),
      projects: mergeDescriptions(projects, data.projects),
      volunteering: mergeDescriptions(volunteering, data.volunteering),
      skills: mergedSkills,
    };

    // `enhanced` stays a JSON string for compatibility with older clients.
    res.json({ enhanced: JSON.stringify(enhanced), model });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ message: error.message });
    next(error);
  }
};

const BULLETS_SCHEMA = {
  type: "object",
  properties: { bullets: { type: "array", items: { type: "string" } } },
  required: ["bullets"],
};

export const suggestBulletsController = async (req, res, next) => {
  try {
    const title = str(req.body?.title, 150).trim();
    if (!title) return res.status(400).json({ message: "A job title is required." });

    const kind = ["job", "project", "volunteer"].includes(req.body?.kind) ? req.body.kind : "job";
    const input = {
      title,
      organization: str(req.body?.organization, 150),
      field: str(req.body?.field, 80) || "general",
      kind,
      alreadyWritten: str(req.body?.existing, 2000),
    };

    const prompt = `You help people write resumes in any profession.
Write 3 or 4 resume bullet points for this ${kind === "job" ? "role" : kind}.

Rules:
- Each bullet: one line, starts with a strong action verb, 8-22 words, no leading bullet character.
- Typical, realistic responsibilities and achievements for a "${input.title}" in ${input.field}.
- Use placeholders like [X%] or [number] where a metric belongs, so the user can fill in their real figures. Never invent specific numbers.
- Don't repeat anything already written.

Context: ${JSON.stringify(input)}`;

    const { data, model } = await generateJson({ prompt, schema: BULLETS_SCHEMA, temperature: 0.8 });
    const bullets = uniqueStrings(Array.isArray(data.bullets) ? data.bullets : [], 5).map((b) => b.replace(/^[-•*\s]+/, ""));
    res.json({ bullets, model });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ message: error.message });
    next(error);
  }
};
