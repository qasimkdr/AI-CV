import { contactItems, dateRange, normalizeResume } from "./resumeData";
import { ContactIcon, Description, Page } from "./shared";

const ACCENT = "#5b4bff";

function Heading({ children }) {
  return (
    <h2 className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: ACCENT }}>
      <span className="h-[2px] w-4 rounded-full" style={{ background: ACCENT }} />
      {children}
    </h2>
  );
}

export default function ModernTemplate({ data }) {
  const r = normalizeResume(data);
  const headline = r.personal.title || r.experience[0]?.position;

  return (
    <Page className="text-slate-700">
      <header className="relative overflow-hidden px-12 pb-8 pt-11" style={{ background: "linear-gradient(135deg,#f4f2ff 0%,#eef6ff 100%)" }}>
        <div className="absolute inset-y-0 left-0 w-1.5" style={{ background: ACCENT }} />
        <h1 className="text-[34px] font-extrabold leading-tight tracking-tight text-slate-900">{r.personal.fullName || "Your Name"}</h1>
        {headline && <p className="mt-1 text-[15px] font-semibold" style={{ color: ACCENT }}>{headline}</p>}
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-[12px] text-slate-600">
          {contactItems(r.personal).map((c) => (
            <li key={c.key} className="flex items-center gap-1.5">
              <ContactIcon type={c.key} className="text-slate-400" />
              {c.href ? <a href={c.href} className="hover:underline">{c.label}</a> : c.label}
            </li>
          ))}
        </ul>
      </header>

      <div className="grid grid-cols-[1fr_230px] gap-10 px-12 py-9">
        <main className="space-y-7">
          {r.summary && (
            <section>
              <Heading>Profile</Heading>
              <p>{r.summary}</p>
            </section>
          )}

          {r.experience.length > 0 && (
            <section>
              <Heading>Experience</Heading>
              <div className="space-y-5">
                {r.experience.map((e, i) => (
                  <div key={i} className="break-inside-avoid">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-[14px] font-bold text-slate-900">{e.position}</h3>
                      <span className="shrink-0 text-[11px] font-medium text-slate-500">{dateRange(e.startDate, e.endDate)}</span>
                    </div>
                    {e.company && <p className="text-[12.5px] font-semibold" style={{ color: ACCENT }}>{e.company}</p>}
                    <Description text={e.description} className="mt-1.5" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {r.projects.length > 0 && (
            <section>
              <Heading>Projects</Heading>
              <div className="space-y-4">
                {r.projects.map((p, i) => (
                  <div key={i} className="break-inside-avoid">
                    <h3 className="text-[13.5px] font-bold text-slate-900">{p.title}</h3>
                    <Description text={p.description} className="mt-1" />
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        <aside className="space-y-7">
          {r.skills.length > 0 && (
            <section>
              <Heading>Skills</Heading>
              <div className="flex flex-wrap gap-1.5">
                {r.skills.map((s, i) => (
                  <span key={i} className="rounded-md px-2 py-1 text-[11.5px] font-medium text-slate-700" style={{ background: "#f1efff" }}>
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}

          {r.education.length > 0 && (
            <section>
              <Heading>Education</Heading>
              <div className="space-y-3.5">
                {r.education.map((e, i) => (
                  <div key={i} className="break-inside-avoid">
                    <h3 className="font-bold leading-snug text-slate-900">{e.degree}</h3>
                    {e.institute && <p className="text-[12.5px]">{e.institute}</p>}
                    {(e.startYear || e.endYear) && <p className="text-[11px] text-slate-500">{dateRange(e.startYear, e.endYear)}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {r.certifications.length > 0 && (
            <section>
              <Heading>Certifications</Heading>
              <ul className="space-y-1.5 text-[12.5px]">
                {r.certifications.map((c, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: ACCENT }} />
                    {c}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </Page>
  );
}
