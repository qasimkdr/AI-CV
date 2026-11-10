import { contactItems, dateRange, initials, normalizeResume } from "./resumeData";
import { ContactIcon, Description, Page } from "./shared";

const ROSE = "#e0457b";

function SideHeading({ children }) {
  return <h2 className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-rose-900/70">{children}</h2>;
}

function MainHeading({ children }) {
  return (
    <h2 className="mb-4 text-[18px] font-extrabold tracking-tight text-slate-900">
      {children}
      <span className="ml-1" style={{ color: ROSE }}>.</span>
    </h2>
  );
}

export default function CreativeTemplate({ data }) {
  const r = normalizeResume(data);
  const headline = r.personal.title || r.experience[0]?.position;

  return (
    <Page className="grid min-h-[1060px] grid-cols-[250px_1fr] text-slate-700">
      <aside className="space-y-7 px-7 py-10" style={{ background: "linear-gradient(180deg,#fff0f5 0%,#fff6ec 100%)" }}>
        <div
          className="grid h-20 w-20 place-items-center rounded-[28%] text-[26px] font-extrabold text-white"
          style={{ background: `linear-gradient(135deg, ${ROSE}, #f59e6b)` }}
        >
          {initials(r.personal.fullName) || "CV"}
        </div>

        <section>
          <SideHeading>Contact</SideHeading>
          <ul className="space-y-2 text-[12px]">
            {contactItems(r.personal).map((c) => (
              <li key={c.key} className="flex items-start gap-2 break-all">
                <ContactIcon type={c.key} className="mt-[3px]" style={{ color: ROSE }} />
                {c.href ? <a href={c.href}>{c.label}</a> : c.label}
              </li>
            ))}
          </ul>
        </section>

        {r.skills.length > 0 && (
          <section>
            <SideHeading>Skills</SideHeading>
            <div className="flex flex-wrap gap-1.5">
              {r.skills.map((s, i) => (
                <span key={i} className="rounded-full bg-white px-2.5 py-1 text-[11.5px] font-medium text-slate-700 ring-1 ring-rose-200">
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {r.education.length > 0 && (
          <section>
            <SideHeading>Education</SideHeading>
            <div className="space-y-3">
              {r.education.map((e, i) => (
                <div key={i} className="break-inside-avoid text-[12px]">
                  <p className="font-bold leading-snug text-slate-900">{e.degree}</p>
                  {e.institute && <p>{e.institute}</p>}
                  {(e.startYear || e.endYear) && <p className="text-[11px] text-slate-500">{dateRange(e.startYear, e.endYear)}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {r.certifications.length > 0 && (
          <section>
            <SideHeading>Certifications</SideHeading>
            <ul className="space-y-1.5 text-[12px]">
              {r.certifications.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </section>
        )}
      </aside>

      <main className="px-10 py-10">
        <header className="mb-8">
          <h1 className="text-[38px] font-extrabold leading-[1.05] tracking-tight text-slate-900">{r.personal.fullName || "Your Name"}</h1>
          {headline && (
            <p className="mt-2 inline-block rounded-full px-3 py-1 text-[12.5px] font-semibold text-white" style={{ background: ROSE }}>
              {headline}
            </p>
          )}
          {r.summary && <p className="mt-4 text-[13.5px] leading-relaxed">{r.summary}</p>}
        </header>

        {r.experience.length > 0 && (
          <section className="mb-8">
            <MainHeading>Experience</MainHeading>
            <ol className="relative space-y-5 border-l-2 border-rose-100 pl-5">
              {r.experience.map((e, i) => (
                <li key={i} className="relative break-inside-avoid">
                  <span className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full border-2 border-white" style={{ background: ROSE }} />
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-[14px] font-bold text-slate-900">{e.position}</h3>
                    <span className="shrink-0 text-[11px] font-semibold text-slate-500">{dateRange(e.startDate, e.endDate)}</span>
                  </div>
                  {e.company && <p className="text-[12.5px] font-medium" style={{ color: ROSE }}>{e.company}</p>}
                  <Description text={e.description} className="mt-1.5" />
                </li>
              ))}
            </ol>
          </section>
        )}

        {r.projects.length > 0 && (
          <section>
            <MainHeading>Projects</MainHeading>
            <div className="grid grid-cols-2 gap-3">
              {r.projects.map((p, i) => (
                <div key={i} className="break-inside-avoid rounded-xl bg-rose-50/60 p-4 ring-1 ring-rose-100">
                  <h3 className="font-bold text-slate-900">{p.title}</h3>
                  <Description text={p.description} className="mt-1 text-[12.5px]" />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </Page>
  );
}
