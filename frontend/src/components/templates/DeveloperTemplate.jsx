import { contactItems, dateRange, normalizeResume } from "./resumeData";
import { ContactIcon, Description, Page } from "./shared";

const MONO = 'ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace';
const TEAL = "#0f9488";

function Heading({ children }) {
  return (
    <h2 className="mb-3 text-[13px] font-bold text-slate-900" style={{ fontFamily: MONO }}>
      <span style={{ color: TEAL }}>## </span>
      {children}
    </h2>
  );
}

export default function DeveloperTemplate({ data }) {
  const r = normalizeResume(data);
  const headline = r.personal.title || r.experience[0]?.position;

  return (
    <Page className="px-12 py-11 text-slate-700">
      <header className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <div className="mb-3 flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
        </div>
        <p className="text-[12px] text-slate-400" style={{ fontFamily: MONO }}>
          <span style={{ color: TEAL }}>const</span> developer = {"{"}
        </p>
        <h1 className="mt-1 text-[32px] font-extrabold leading-tight tracking-tight text-slate-900">{r.personal.fullName || "Your Name"}</h1>
        {headline && (
          <p className="text-[14px] font-semibold" style={{ fontFamily: MONO, color: TEAL }}>
            {headline}
          </p>
        )}
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-slate-600" style={{ fontFamily: MONO }}>
          {contactItems(r.personal).map((c) => (
            <li key={c.key} className="flex items-center gap-1.5">
              <ContactIcon type={c.key} className="text-slate-400" />
              {c.href ? <a href={c.href}>{c.label}</a> : c.label}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[12px] text-slate-400" style={{ fontFamily: MONO }}>{"};"}</p>
      </header>

      {r.summary && (
        <section className="mt-7">
          <Heading>about</Heading>
          <p>{r.summary}</p>
        </section>
      )}

      {r.skills.length > 0 && (
        <section className="mt-7">
          <Heading>stack</Heading>
          <div className="flex flex-wrap gap-1.5" style={{ fontFamily: MONO }}>
            {r.skills.map((s, i) => (
              <span key={i} className="rounded-md border border-teal-200 bg-teal-50 px-2 py-0.5 text-[11.5px] text-teal-900">
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {r.experience.length > 0 && (
        <section className="mt-7">
          <Heading>experience</Heading>
          <div className="space-y-4">
            {r.experience.map((e, i) => (
              <div key={i} className="break-inside-avoid border-l-2 pl-4" style={{ borderColor: TEAL }}>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-[14px] font-bold text-slate-900">
                    {e.position}
                    {e.company && <span className="font-medium text-slate-500"> @ {e.company}</span>}
                  </h3>
                  <span className="shrink-0 text-[11px] text-slate-500" style={{ fontFamily: MONO }}>{dateRange(e.startDate, e.endDate)}</span>
                </div>
                <Description text={e.description} className="mt-1.5" />
              </div>
            ))}
          </div>
        </section>
      )}

      {r.projects.length > 0 && (
        <section className="mt-7">
          <Heading>projects</Heading>
          <div className="grid grid-cols-2 gap-3">
            {r.projects.map((p, i) => (
              <div key={i} className="break-inside-avoid rounded-xl border border-slate-200 p-4">
                <h3 className="text-[13px] font-bold text-slate-900" style={{ fontFamily: MONO }}>
                  <span style={{ color: TEAL }}>~/</span>
                  {p.title}
                </h3>
                <Description text={p.description} className="mt-1 text-[12.5px]" />
              </div>
            ))}
          </div>
        </section>
      )}

      {(r.education.length > 0 || r.certifications.length > 0) && (
        <div className="mt-7 grid grid-cols-2 gap-8">
          {r.education.length > 0 && (
            <section>
              <Heading>education</Heading>
              <div className="space-y-2.5">
                {r.education.map((e, i) => (
                  <div key={i} className="break-inside-avoid">
                    <p className="font-bold text-slate-900">{e.degree}</p>
                    <p className="text-[12.5px]">{e.institute}</p>
                    {(e.startYear || e.endYear) && <p className="text-[11px] text-slate-500" style={{ fontFamily: MONO }}>{dateRange(e.startYear, e.endYear)}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
          {r.certifications.length > 0 && (
            <section>
              <Heading>certifications</Heading>
              <ul className="space-y-1.5 text-[12.5px]">
                {r.certifications.map((c, i) => (
                  <li key={i} className="flex gap-2">
                    <span style={{ color: TEAL, fontFamily: MONO }}>✓</span>
                    {c}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </Page>
  );
}
