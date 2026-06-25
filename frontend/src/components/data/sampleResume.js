const sampleResume = {
  template: "modern",

  personalInfo: {
    fullName: "John Anderson",
    email: "john.anderson@gmail.com",
    phone: "+1 (555) 123-4567",
    address: "New York, USA",
    linkedin: "linkedin.com/in/johnanderson",
    github: "github.com/johnanderson",
  },

  skills: [
    "React",
    "Node.js",
    "Express.js",
    "MongoDB",
    "Tailwind CSS",
    "JavaScript",
    "REST API",
    "Git",
  ],

  experience: [
    {
      company: "Google",
      position: "Senior Software Engineer",
      description:
        "Developed scalable web applications, optimized performance, collaborated with cross-functional teams, and built enterprise-level MERN applications.",
    },
  ],

  education: [
    {
      institute: "Stanford University",
      degree: "BS Computer Science",
      startYear: "2018",
      endYear: "2022",
    },
  ],

  projects: [
    {
      title: "AI Resume Builder",
      description:
        "Built an AI-powered resume builder using MERN Stack with ATS-friendly templates and PDF export.",
    },
    {
      title: "Learning Management System",
      description:
        "Created an LMS with authentication, course management, student dashboard and admin panel.",
    },
  ],

  certifications: [
    "AWS Certified Developer",
    "Google Cloud Associate",
  ],
};

export default sampleResume;