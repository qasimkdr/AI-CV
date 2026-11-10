import { AddButton, ItemCard, ItemList, SectionCard, TextField } from "../editor/FormBits";

const blank = { institute: "", degree: "", startYear: "", endYear: "" };

export default function EducationForm({ data = [], setResumeData }) {
  const add = () => setResumeData((p) => ({ ...p, education: [...(p.education || []), { ...blank }] }));
  const remove = (index) =>
    setResumeData((p) => ({ ...p, education: p.education.filter((_, i) => i !== index) }));
  const change = (index, field, value) =>
    setResumeData((p) => {
      const updated = [...p.education];
      updated[index] = { ...updated[index], [field]: value };
      return { ...p, education: updated };
    });

  return (
    <SectionCard
      eyebrow="Academics"
      title="Education"
      description="Degrees, diplomas and bootcamps."
      action={<AddButton onClick={add}>Add education</AddButton>}
    >
      <ItemList
        items={data}
        empty="Add your university, college or relevant course."
        render={(edu, i) => (
          <ItemCard title={edu.degree || edu.institute || `Education #${i + 1}`} onRemove={() => remove(i)}>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField id={`ed-inst-${i}`} label="School / Institute" placeholder="Stanford University" value={edu.institute || ""} onChange={(e) => change(i, "institute", e.target.value)} />
              <TextField id={`ed-deg-${i}`} label="Degree" placeholder="BS Computer Science" value={edu.degree || ""} onChange={(e) => change(i, "degree", e.target.value)} />
              <TextField id={`ed-start-${i}`} label="Start year" placeholder="2019" inputMode="numeric" value={edu.startYear || ""} onChange={(e) => change(i, "startYear", e.target.value)} />
              <TextField id={`ed-end-${i}`} label="End year" placeholder="2023" inputMode="numeric" value={edu.endYear || ""} onChange={(e) => change(i, "endYear", e.target.value)} />
            </div>
          </ItemCard>
        )}
      />
    </SectionCard>
  );
}
