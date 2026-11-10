// Demo content used for template thumbnails and the public template gallery.
const sampleResume = {
  template: "modern",

  personalInfo: {
    fullName: "Jordan Rivera",
    title: "Senior Full-Stack Engineer",
    email: "jordan.rivera@email.com",
    phone: "+1 (555) 123-4567",
    address: "Austin, TX",
    links: [
      { label: "LinkedIn", url: "linkedin.com/in/jordanrivera" },
      { label: "Portfolio", url: "jordanrivera.dev" },
    ],
  },

  sections: [
    { id: "summary", enabled: true },
    { id: "experience", enabled: true },
    { id: "projects", enabled: true },
    { id: "education", enabled: true },
    { id: "skills", enabled: true },
    { id: "certifications", enabled: true },
    { id: "languages", enabled: true },
  ],

  languages: [
    { name: "English", level: "Native" },
    { name: "Spanish", level: "Fluent" },
  ],

  summary:
    "Full-stack engineer with 7+ years building fast, accessible web products. Led teams shipping React and Node.js platforms used by millions, with a focus on performance, clean architecture and mentoring.",

  experience: [
    {
      company: "Northwind Labs",
      position: "Senior Full-Stack Engineer",
      startDate: "2022",
      endDate: "Present",
      description:
        "Led the rebuild of the customer dashboard in React and TypeScript, cutting load time by 42%.\nDesigned a Node.js event pipeline processing 3M events per day.\nMentored 5 engineers and introduced code review guidelines adopted company-wide.",
    },
    {
      company: "Brightline Studio",
      position: "Frontend Engineer",
      startDate: "2019",
      endDate: "2022",
      description:
        "Built a shared component library used across 6 product teams.\nImproved checkout conversion by 18% through A/B-tested UX changes.",
    },
  ],

  education: [
    {
      institute: "University of Texas at Austin",
      degree: "BS Computer Science",
      startYear: "2014",
      endYear: "2018",
    },
  ],

  skills: ["TypeScript", "React", "Node.js", "GraphQL", "PostgreSQL", "AWS", "Docker", "CI/CD", "Testing", "System Design"],

  projects: [
    {
      title: "OpenBoard",
      description: "Real-time collaborative whiteboard built with WebSockets and CRDTs, used by 2k monthly users.",
    },
    {
      title: "Budgetly",
      description: "Open-source personal finance app with bank sync and smart categorisation (1.2k GitHub stars).",
    },
  ],

  certifications: ["AWS Certified Developer – Associate", "Google Professional Cloud Developer"],
};

export default sampleResume;
