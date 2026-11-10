import { ChipInput, SectionCard } from "../editor/FormBits";

const SUGGESTED = [
  "Communication", "Leadership", "Problem solving", "Teamwork", "Project management",
  "JavaScript", "React", "Node.js", "Python", "SQL", "Excel", "Figma", "Data analysis", "Git",
];

export default function SkillsForm({ data = [], setResumeData }) {
  return (
    <SectionCard
      eyebrow="Toolkit"
      title="Skills"
      description="Aim for 6–12 skills. Mirror keywords from the job post."
    >
      <ChipInput
        id="skills"
        values={data}
        placeholder="e.g. React, Public speaking, SEO"
        suggestions={SUGGESTED}
        onChange={(skills) => setResumeData((p) => ({ ...p, skills }))}
      />
    </SectionCard>
  );
}
