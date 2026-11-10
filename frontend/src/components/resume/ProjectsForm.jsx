import { AddButton, ItemCard, ItemList, SectionCard, TextArea, TextField } from "../editor/FormBits";

export default function ProjectsForm({ data = [], setResumeData }) {
  const add = () => setResumeData((p) => ({ ...p, projects: [...(p.projects || []), { title: "", description: "" }] }));
  const remove = (index) =>
    setResumeData((p) => ({ ...p, projects: p.projects.filter((_, i) => i !== index) }));
  const change = (index, field, value) =>
    setResumeData((p) => {
      const updated = [...p.projects];
      updated[index] = { ...updated[index], [field]: value };
      return { ...p, projects: updated };
    });

  return (
    <SectionCard
      eyebrow="Portfolio"
      title="Projects"
      description="Side projects, case studies or open-source work that prove your skills."
      action={<AddButton onClick={add}>Add project</AddButton>}
    >
      <ItemList
        items={data}
        empty="Showcase something you built — it's often the most memorable part of a resume."
        render={(pr, i) => (
          <ItemCard title={pr.title || `Project #${i + 1}`} onRemove={() => remove(i)}>
            <div className="grid gap-4">
              <TextField id={`pr-title-${i}`} label="Project name" placeholder="AI Resume Builder" value={pr.title || ""} onChange={(e) => change(i, "title", e.target.value)} />
              <TextArea id={`pr-desc-${i}`} label="Description" placeholder="What it does, your role, tech used and the outcome." value={pr.description || ""} onChange={(e) => change(i, "description", e.target.value)} />
            </div>
          </ItemCard>
        )}
      />
    </SectionCard>
  );
}
