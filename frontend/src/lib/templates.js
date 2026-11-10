import ModernTemplate from "@/components/templates/ModernTemplate";
import ATSClassicTemplate from "@/components/templates/ATSClassicTemplate";
import CreativeTemplate from "@/components/templates/CreativeTemplate";
import ExecutiveTemplate from "@/components/templates/ExecutiveTemplate";
import DeveloperTemplate from "@/components/templates/DeveloperTemplate";

export const TEMPLATES = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean layout with a confident indigo accent.",
    bestFor: "Tech, product & startups",
    accent: "from-violet to-sky",
    component: ModernTemplate,
  },
  {
    id: "ats",
    name: "ATS Classic",
    description: "Recruiter-proof, single column, zero clutter.",
    bestFor: "Corporate & large companies",
    accent: "from-sky to-mint",
    component: ATSClassicTemplate,
  },
  {
    id: "creative",
    name: "Creative",
    description: "Stylish sidebar layout that stands out.",
    bestFor: "Design, marketing & media",
    accent: "from-blush to-peach",
    component: CreativeTemplate,
  },
  {
    id: "executive",
    name: "Executive",
    description: "Refined, premium layout for senior roles.",
    bestFor: "Leadership & management",
    accent: "from-peach to-violet",
    component: ExecutiveTemplate,
  },
  {
    id: "developer",
    name: "Developer",
    description: "Code-inspired design for engineers.",
    bestFor: "Software engineers",
    accent: "from-mint to-violet",
    component: DeveloperTemplate,
  },
];

export const getTemplate = (id) =>
  TEMPLATES.find(
    (t) => t.id === String(id || "").toLowerCase()
  ) || TEMPLATES[0];
