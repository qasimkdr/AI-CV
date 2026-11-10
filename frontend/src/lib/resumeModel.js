export const emptyResume = (template = "modern") => ({
  template,
  personalInfo: { fullName: "", title: "", email: "", phone: "", address: "", linkedin: "", github: "" },
  summary: "",
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
});

export const normalizeResume = (r = {}) => ({
  ...r,
  template: String(r.template || "modern").toLowerCase(),
  personalInfo: { ...emptyResume().personalInfo, ...(r.personalInfo || {}) },
  summary: r.summary || "",
  education: r.education || [],
  experience: r.experience || [],
  skills: r.skills || [],
  projects: r.projects || [],
  certifications: r.certifications || [],
});
