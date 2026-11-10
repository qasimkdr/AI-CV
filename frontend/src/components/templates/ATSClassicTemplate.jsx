import { contactItems, dateRange, normalizeResume } from "./resumeData";
import { Description, Page } from "./shared";

// Deliberately plain: single column, standard headings, no icons or columns —
// the format applicant tracking systems parse most reliably.
function Section({ title, children }) {
  return (
    <section className="mt-5">
      <h2 className="border-b border-slate-800 pb-1 text-[12px] font-bold uppercase tracking-[0.12em] text-slate-900">{title}</h2>
      <div className="mt-2.5">{children}</div>
    </section>
  );
}

export default function ATSClassicTemplate({ data }) {
  const r = normalizeResume(data);
  const contacts = contactItems(r.personal);

  return (
    <Page className="px-14 py-12 text-slate-800" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <header className="text-center">
        <h1 className="text-[28px] font-bold tracking-wide text-slate-900">{r.personal.fullName || "Your Name"}</h1>
        {r.personal.title && <p className="mt-0.5 text-[14px] text-slate-700">{r.personal.title}</p>}
        {contacts.length > 0 && (
          <p className="mt-2 text-[12px] text-slate-700">
            {contacts.map((c, i) => (
              <span key={c.key}>
                {i > 0 && <span className="mx-2 text-slate-400">|</span>}
                {c.href ? <a href={c.href}>{c.label}</a> : c.label}
              </span>
            ))}
          </p>
        )}
      </header>

      {r.summary && (
        <Section title="Professional Summary">
          <p>{r.summary}</p>
        </Section>
      )}

      {r.experience.length > 0 && (
        <Section title="Experience">
          <div className="space-y-4">
            {r.experience.map((e, i) => (
              <div key={i} className="break-inside-avoid">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="font-bold text-slate-900">
                    {e.position}
                    {e.position && e.company && ", "}
                    <span className="font-normal">{e.company}</span>
                  </p>
                  <span className="shrink-0 text-[12px]">{dateRange(e.startDate, e.endDate)}</span>
                </div>
                <Description text={e.description} className="mt-1" />
              </div>
            ))}
          </div>
        </Section>
      )}

      {r.projects.length > 0 && (
        <Section title="Projects">
          <div className="space-y-3">
            {r.projects.map((p, i) => (
              <div key={i} className="break-inside-avoid">
                <p className="font-bold text-slate-900">{p.title}</p>
                <Description text={p.description} className="mt-0.5" />
              </div>
            ))}
          </div>
        </Section>
      )}

      {r.education.length > 0 && (
        <Section title="Education">
          <div className="space-y-2">
            {r.education.map((e, i) => (
              <div key={i} className="flex items-baseline justify-between gap-4 break-inside-avoid">
                <p>
                  <span className="font-bold text-slate-900">{e.degree}</span>
                  {e.degree && e.institute && ", "}
                  {e.institute}
                </p>
                <span className="shrink-0 text-[12px]">{dateRange(e.startYear, e.endYear)}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {r.skills.length > 0 && (
        <Section title="Skills">
          <p>{r.skills.join(", ")}</p>
        </Section>
      )}

      {r.certifications.length > 0 && (
        <Section title="Certifications">
          <ul className="list-disc space-y-0.5 pl-5">
            {r.certifications.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </Section>
      )}
    </Page>
  );
}
