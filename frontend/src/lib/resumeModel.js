export const emptyResume = (template = "modern") => ({
  template,
  personalInfo: { fullName: "", email: "", phone: "", address: "", linkedin: "", github: "" },
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
  education: r.education || [],
  experience: r.experience || [],
  skills: r.skills || [],
  projects: r.projects || [],
  certifications: r.certifications || [],
});
