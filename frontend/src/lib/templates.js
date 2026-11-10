import ModernTemplate from "@/components/templates/ModernTemplate";
import ATSClassicTemplate from "@/components/templates/ATSClassicTemplate";
import CreativeTemplate from "@/components/templates/CreativeTemplate";
import ExecutiveTemplate from "@/components/templates/ExecutiveTemplate";
import DeveloperTemplate from "@/components/templates/DeveloperTemplate";

export const TEMPLATES = [
  {
    id: "modern",
    name: "Modern",
    description: "Two-column layout with a soft violet header and skill chips.",
    bestFor: "Any industry — clean & modern",
    accent: "from-violet to-sky",
    component: ModernTemplate,
  },
  {
    id: "ats",
    name: "ATS Classic",
    description: "Single column, standard headings — the safest choice for ATS.",
    bestFor: "Corporate & large companies",
    accent: "from-sky to-mint",
    component: ATSClassicTemplate,
  },
  {
    id: "creative",
    name: "Creative",
    description: "Pastel sidebar, timeline experience and project cards.",
    bestFor: "Design, marketing & media",
    accent: "from-blush to-peach",
    component: CreativeTemplate,
  },
  {
    id: "executive",
    name: "Executive",
    description: "Elegant serif typography with navy and gold accents.",
    bestFor: "Leadership & management",
    accent: "from-peach to-violet",
    component: ExecutiveTemplate,
  },
  {
    id: "developer",
    name: "Tech",
    description: "Light, code-inspired layout with a tech-stack section.",
    bestFor: "Tech, data & engineering roles",
    accent: "from-mint to-violet",
    component: DeveloperTemplate,
  },
];

export const getTemplate = (id) =>
  TEMPLATES.find(
    (t) => t.id === String(id || "").toLowerCase()
  ) || TEMPLATES[0];
