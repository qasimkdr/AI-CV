import { contactItems, dateRange, normalizeResume } from "./resumeData";
import { Description, Page } from "./shared";

const SERIF = 'Georgia, "Times New Roman", serif';
const GOLD = "#b08a3e";
const NAVY = "#1f2a44";

function Heading({ children }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <h2 className="text-[12px] font-semibold uppercase tracking-[0.25em]" style={{ color: NAVY }}>{children}</h2>
      <span className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />
    </div>
  );
}

export default function ExecutiveTemplate({ data }) {
  const r = normalizeResume(data);
  const contacts = contactItems(r.personal);
  const headline = r.personal.title || r.experience[0]?.position;

  return (
    <Page className="px-14 py-12 text-slate-700">
      <header className="text-center">
        <h1 className="text-[36px] tracking-wide" style={{ fontFamily: SERIF, color: NAVY }}>{r.personal.fullName || "Your Name"}</h1>
        {headline && <p className="mt-1 text-[12px] font-semibold uppercase tracking-[0.3em]" style={{ color: GOLD }}>{headline}</p>}
        <div className="mx-auto mt-4 flex items-center justify-center gap-3">
          <span className="h-px w-16" style={{ background: GOLD }} />
          <span className="h-1.5 w-1.5 rotate-45" style={{ background: GOLD }} />
          <span className="h-px w-16" style={{ background: GOLD }} />
        </div>
        {contacts.length > 0 && (
          <p className="mt-3 text-[12px] text-slate-600">
            {contacts.map((c, i) => (
              <span key={c.key}>
                {i > 0 && <span className="mx-2.5" style={{ color: GOLD }}>•</span>}
                {c.href ? <a href={c.href}>{c.label}</a> : c.label}
              </span>
            ))}
          </p>
        )}
      </header>

      {r.summary && (
        <section className="mt-8">
          <Heading>Executive Profile</Heading>
          <p className="text-[13.5px] leading-relaxed" style={{ fontFamily: SERIF }}>{r.summary}</p>
        </section>
      )}

      {r.skills.length > 0 && (
        <section className="mt-7">
          <Heading>Core Competencies</Heading>
          <ul className="grid grid-cols-3 gap-x-6 gap-y-1.5 text-[12.5px]">
            {r.skills.map((s, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="h-1 w-1 rotate-45" style={{ background: GOLD }} />
                {s}
              </li>
            ))}
          </ul>
        </section>
      )}

      {r.experience.length > 0 && (
        <section className="mt-7">
          <Heading>Professional Experience</Heading>
          <div className="space-y-5">
            {r.experience.map((e, i) => (
              <div key={i} className="break-inside-avoid">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-[15px]" style={{ fontFamily: SERIF, color: NAVY }}>
                    <span className="font-bold">{e.position}</span>
                    {e.company && <span className="italic text-slate-600"> — {e.company}</span>}
                  </h3>
                  <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{dateRange(e.startDate, e.endDate)}</span>
                </div>
                <Description text={e.description} className="mt-1.5" bulletClass="!rounded-none rotate-45" />
              </div>
            ))}
          </div>
        </section>
      )}

      {r.projects.length > 0 && (
        <section className="mt-7">
          <Heading>Key Initiatives</Heading>
          <div className="space-y-3.5">
            {r.projects.map((p, i) => (
              <div key={i} className="break-inside-avoid">
                <h3 className="font-bold" style={{ fontFamily: SERIF, color: NAVY }}>{p.title}</h3>
                <Description text={p.description} className="mt-0.5" />
              </div>
            ))}
          </div>
        </section>
      )}

      {(r.education.length > 0 || r.certifications.length > 0) && (
        <div className="mt-7 grid grid-cols-2 gap-10">
          {r.education.length > 0 && (
            <section>
              <Heading>Education</Heading>
              <div className="space-y-2.5">
                {r.education.map((e, i) => (
                  <div key={i} className="break-inside-avoid">
                    <p className="font-bold" style={{ fontFamily: SERIF, color: NAVY }}>{e.degree}</p>
                    <p className="text-[12.5px]">
                      {e.institute}
                      {(e.startYear || e.endYear) && <span className="text-slate-500"> · {dateRange(e.startYear, e.endYear)}</span>}
                    </p>
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
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </Page>
  );
}
