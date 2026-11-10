import { ChipInput, SectionCard } from "../editor/FormBits";

export default function CertificationsForm({ data = [], setResumeData }) {
  return (
    <SectionCard
      eyebrow="Credentials"
      title="Certifications"
      description="Licenses, certificates and awards that back up your expertise."
    >
      <ChipInput
        id="certifications"
        values={data}
        placeholder="e.g. AWS Certified Developer"
        onChange={(certifications) => setResumeData((p) => ({ ...p, certifications }))}
      />
    </SectionCard>
  );
}
