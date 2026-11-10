// Every optional resume section. Personal info is always first (header).
export const SECTIONS = [
  { id: "summary", label: "Summary", question: "How would you describe yourself in 2–3 sentences?" },
  { id: "experience", label: "Experience", question: "Where have you worked?" },
  { id: "education", label: "Education", question: "Where did you study?" },
  { id: "skills", label: "Skills", question: "What are you great at?" },
  { id: "projects", label: "Projects", question: "What have you built or delivered?" },
  { id: "certifications", label: "Certifications & Licenses", question: "Which certificates or licences do you hold?" },
  { id: "languages", label: "Languages", question: "Which languages do you speak?" },
  { id: "volunteering", label: "Volunteering", question: "Where have you volunteered?" },
  { id: "awards", label: "Awards", question: "What recognition have you earned?" },
  { id: "courses", label: "Courses & Training", question: "Which courses or trainings have you completed?" },
  { id: "publications", label: "Publications", question: "What have you published?" },
  { id: "memberships", label: "Memberships", question: "Which professional bodies do you belong to?" },
  { id: "interests", label: "Interests", question: "What do you enjoy outside work?" },
  { id: "references", label: "References", question: "Who can vouch for your work?" },
];

export const SECTION_IDS = SECTIONS.map((s) => s.id);
export const sectionMeta = (id) => SECTIONS.find((s) => s.id === id);

export const LANGUAGE_LEVELS = ["Native", "Fluent", "Advanced", "Intermediate", "Basic"];
export const SKILL_LEVELS = ["", "Beginner", "Intermediate", "Advanced", "Expert"];
export const SKILL_CATEGORIES = [
  { id: "professional", label: "Professional" },
  { id: "tools", label: "Tools & software" },
  { id: "soft", label: "Soft skills" },
];
export const EMPLOYMENT_TYPES = ["", "Full-time", "Part-time", "Contract", "Freelance", "Internship", "Apprenticeship", "Temporary"];
export const LINK_TYPES = ["LinkedIn", "Portfolio", "Website", "GitHub", "Behance", "Dribbble", "X / Twitter", "Other"];

/** Section list for a new resume in a given field. */
export const sectionsForField = (enabledIds) => [
  ...enabledIds.map((id) => ({ id, enabled: true })),
  ...SECTION_IDS.filter((id) => !enabledIds.includes(id)).map((id) => ({ id, enabled: false })),
];
