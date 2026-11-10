import { SectionCard, TextField } from "../editor/FormBits";

const fields = [
  { name: "fullName", label: "Full name", placeholder: "Jane Doe", autoComplete: "name" },
  { name: "email", label: "Email", placeholder: "jane@example.com", type: "email", autoComplete: "email" },
  { name: "phone", label: "Phone", placeholder: "+1 555 123 4567", type: "tel", autoComplete: "tel" },
  { name: "address", label: "Location", placeholder: "City, Country", autoComplete: "address-level2" },
  { name: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/in/janedoe" },
  { name: "github", label: "GitHub / Portfolio", placeholder: "github.com/janedoe" },
];

export default function PersonalInfoForm({ data = {}, setResumeData }) {
  const handleChange = (e) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [e.target.name]: e.target.value },
    }));
  };

  return (
    <SectionCard
      eyebrow="Identity"
      title="Personal information"
      description="How recruiters will reach you. Use a professional email address."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((f) => (
          <TextField
            key={f.name}
            id={`pi-${f.name}`}
            label={f.label}
            name={f.name}
            type={f.type || "text"}
            autoComplete={f.autoComplete}
            placeholder={f.placeholder}
            value={data[f.name] || ""}
            onChange={handleChange}
          />
        ))}
      </div>
    </SectionCard>
  );
}
