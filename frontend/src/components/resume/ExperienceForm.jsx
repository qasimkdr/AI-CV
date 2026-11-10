import { AddButton, ItemCard, ItemList, SectionCard, TextArea, TextField } from "../editor/FormBits";

const blank = { company: "", position: "", startDate: "", endDate: "", description: "" };

export default function ExperienceForm({ data = [], setResumeData }) {
  const add = () => setResumeData((p) => ({ ...p, experience: [...(p.experience || []), { ...blank }] }));
  const remove = (index) =>
    setResumeData((p) => ({ ...p, experience: p.experience.filter((_, i) => i !== index) }));
  const change = (index, field, value) =>
    setResumeData((p) => {
      const updated = [...p.experience];
      updated[index] = { ...updated[index], [field]: value };
      return { ...p, experience: updated };
    });

  return (
    <SectionCard
      eyebrow="Work history"
      title="Experience"
      description="Most recent first. Focus on results, not just duties."
      action={<AddButton onClick={add}>Add experience</AddButton>}
    >
      <ItemList
        items={data}
        empty="No experience yet — add your most recent role, internship or volunteer work."
        render={(exp, i) => (
          <ItemCard title={exp.position || exp.company || `Experience #${i + 1}`} onRemove={() => remove(i)}>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField id={`ex-pos-${i}`} label="Job title" placeholder="Frontend Developer" value={exp.position || ""} onChange={(e) => change(i, "position", e.target.value)} />
              <TextField id={`ex-co-${i}`} label="Company" placeholder="Acme Inc." value={exp.company || ""} onChange={(e) => change(i, "company", e.target.value)} />
              <TextField id={`ex-start-${i}`} label="Start date" placeholder="Jan 2023" value={exp.startDate || ""} onChange={(e) => change(i, "startDate", e.target.value)} />
              <TextField id={`ex-end-${i}`} label="End date" placeholder="Present" value={exp.endDate || ""} onChange={(e) => change(i, "endDate", e.target.value)} />
              <TextArea
                id={`ex-desc-${i}`}
                className="md:col-span-2"
                label="What did you achieve?"
                placeholder="Led the redesign of… which increased… by 30%."
                hint="Tip: start with a verb and include a number. AI Enhance can polish this later."
                value={exp.description || ""}
                onChange={(e) => change(i, "description", e.target.value)}
              />
            </div>
          </ItemCard>
        )}
      />
    </SectionCard>
  );
}
