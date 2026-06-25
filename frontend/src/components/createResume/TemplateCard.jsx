import sampleResume from "../data/sampleResume";

export default function TemplateCard({
  template,
  selectedTemplate,
  setResumeData,
}) {
  const Template =
    template.component;

  return (
    <button
      type="button"
      onClick={() =>
        setResumeData((prev) => ({
          ...prev,
          template: template.id,
        }))
      }
      className={`overflow-hidden rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-xl ${
        selectedTemplate ===
        template.id
          ? "border-sky-500 ring-4 ring-sky-200"
          : "border-slate-200"
      }`}
    >
      <div className="h-[260px] overflow-hidden rounded-t-2xl bg-slate-100">
  <div
    className="origin-top-left scale-[0.18]"
    style={{
      width: "560%",
    }}
  >
    <Template
      data={sampleResume}
    />
  </div>
</div>

      <div className="border-t bg-white p-4">
        <h3 className="font-bold">
          {template.name}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {template.description}
        </p>
      </div>
    </button>
  );
}